import Redis from 'ioredis';
import fs from 'fs';
import path from 'path';

interface SessionStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
  getStorageInfo(): { type: 'redis' | 'fs'; path?: string; connected?: boolean };
}

class RedisSessionStore implements SessionStore {
  private redis: Redis;
  private connected = false;

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl, {
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    this.redis.on('connect', () => {
      this.connected = true;
      console.log('✅ Redis conectado para storage de sessões');
    });

    this.redis.on('error', (err) => {
      this.connected = false;
      console.error('❌ Erro Redis:', err.message);
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(`wpp:session:${key}`);
    } catch (error) {
      console.error('Erro ao ler do Redis:', error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await this.redis.set(`wpp:session:${key}`, value, 'EX', 86400); // 24h TTL
    } catch (error) {
      console.error('Erro ao escrever no Redis:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(`wpp:session:${key}`);
    } catch (error) {
      console.error('Erro ao deletar do Redis:', error);
    }
  }

  getStorageInfo() {
    return {
      type: 'redis' as const,
      connected: this.connected
    };
  }
}

class FileSessionStore implements SessionStore {
  private basePath: string;

  constructor() {
    // Priorizar /data (volume persistente), fallback para /tmp
    const possiblePaths = ['/data', '/tmp', './data', './tmp'];
    
    for (const testPath of possiblePaths) {
      try {
        if (fs.existsSync(testPath)) {
          this.basePath = path.join(testPath, 'wpp-sessions');
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!this.basePath) {
      this.basePath = path.join(process.cwd(), 'sessions');
    }

    // Criar diretório se não existir
    try {
      if (!fs.existsSync(this.basePath)) {
        fs.mkdirSync(this.basePath, { recursive: true });
      }
      console.log(`📁 Storage de sessões: ${this.basePath}`);
    } catch (error) {
      console.error('Erro ao criar diretório de sessões:', error);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const filePath = path.join(this.basePath, `${key}.json`);
      if (!fs.existsSync(filePath)) return null;
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error('Erro ao ler sessão do arquivo:', error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      const filePath = path.join(this.basePath, `${key}.json`);
      fs.writeFileSync(filePath, value, 'utf8');
    } catch (error) {
      console.error('Erro ao salvar sessão no arquivo:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      const filePath = path.join(this.basePath, `${key}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Erro ao deletar sessão do arquivo:', error);
    }
  }

  getStorageInfo() {
    return {
      type: 'fs' as const,
      path: this.basePath
    };
  }
}

// Factory function para criar o store apropriado
export function createSessionStore(): SessionStore {
  const redisUrl = process.env.REDIS_URL;
  
  if (redisUrl) {
    console.log('🔄 Configurando Redis para storage de sessões...');
    return new RedisSessionStore(redisUrl);
  } else {
    console.log('📁 Usando filesystem para storage de sessões...');
    return new FileSessionStore();
  }
}

// Instância singleton
export const sessionStore = createSessionStore();