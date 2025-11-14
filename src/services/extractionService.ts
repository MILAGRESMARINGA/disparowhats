import { EXTRACTION_PATTERNS } from '../utils/constants';
import { IExtractedData } from '../types/crm';

/**
 * Serviço para extração automática de dados de mensagens
 * Usa regex para identificar nome, telefone, bairro, tipo de imóvel e valor
 */
export class ExtractionService {
  /**
   * Extrai todas as informações possíveis de um texto
   * @param text - Texto da mensagem recebida
   * @returns Dados extraídos
   */
  static extractAll(text: string): IExtractedData {
    return {
      nome: this.extractName(text),
      telefone: this.extractPhone(text),
      bairro: this.extractLocation(text),
      tipoImovel: this.extractPropertyType(text),
      valor: this.extractValue(text)
    };
  }

  /**
   * Extrai nome do texto
   * Padrões: "Meu nome é X", "Eu sou X", "Me chamo X", "Sou o/a X"
   * @param text - Texto a analisar
   * @returns Nome extraído ou undefined
   */
  static extractName(text: string): string | undefined {
    const match = text.match(EXTRACTION_PATTERNS.nome);

    if (match && match[2]) {
      // Limpar e capitalizar
      const name = match[2].trim();
      return this.capitalizeName(name);
    }

    return undefined;
  }

  /**
   * Extrai telefone(s) do texto
   * Padrões: (XX) 9XXXX-XXXX, (XX) XXXXX-XXXX, XX 9XXXXXXXX
   * @param text - Texto a analisar
   * @returns Telefone formatado ou undefined
   */
  static extractPhone(text: string): string | undefined {
    const matches = text.match(EXTRACTION_PATTERNS.telefone);

    if (matches && matches.length > 0) {
      // Pegar o primeiro telefone encontrado
      const phone = matches[0];

      // Formatar para padrão brasileiro
      return this.formatPhone(phone);
    }

    return undefined;
  }

  /**
   * Extrai bairro/localização do texto
   * Padrões: "bairro X", "região X", "em X", "no X"
   * @param text - Texto a analisar
   * @returns Bairro extraído ou undefined
   */
  static extractLocation(text: string): string | undefined {
    const match = text.match(EXTRACTION_PATTERNS.bairro);

    if (match && match[2]) {
      // Limpar e capitalizar
      const location = match[2].trim();
      return this.capitalizeName(location);
    }

    return undefined;
  }

  /**
   * Extrai tipo de imóvel do texto
   * Palavras-chave: casa, apartamento, terreno, chácara, sobrado, kitnet, studio
   * @param text - Texto a analisar
   * @returns Tipo de imóvel ou undefined
   */
  static extractPropertyType(text: string): string | undefined {
    const match = text.match(EXTRACTION_PATTERNS.tipoImovel);

    if (match && match[1]) {
      return match[1].toLowerCase();
    }

    return undefined;
  }

  /**
   * Extrai valor(es) do texto
   * Padrões: R$ X, reais, mil, milhões
   * @param text - Texto a analisar
   * @returns Valor extraído ou undefined
   */
  static extractValue(text: string): string | undefined {
    const matches = text.match(EXTRACTION_PATTERNS.valor);

    if (matches && matches.length > 0) {
      // Retornar o primeiro valor encontrado
      return matches[0];
    }

    return undefined;
  }

  /**
   * Capitaliza nome próprio
   * @param name - Nome a capitalizar
   * @returns Nome capitalizado
   */
  private static capitalizeName(name: string): string {
    return name
      .split(' ')
      .map((word) => {
        // Não capitalizar preposições
        if (['de', 'da', 'do', 'dos', 'das'].includes(word.toLowerCase())) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  /**
   * Formata telefone para padrão brasileiro
   * @param phone - Telefone a formatar
   * @returns Telefone formatado
   */
  private static formatPhone(phone: string): string {
    // Remove tudo exceto números
    const numbers = phone.replace(/\D/g, '');

    // Formatar baseado no tamanho
    if (numbers.length === 11) {
      // (XX) 9XXXX-XXXX
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
      // (XX) XXXX-XXXX
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }

    return phone;
  }

  /**
   * Verifica se o texto contém dados suficientes para extração
   * @param text - Texto a verificar
   * @returns true se contém dados extraíveis
   */
  static hasExtractableData(text: string): boolean {
    const extracted = this.extractAll(text);

    // Pelo menos nome OU telefone deve estar presente
    return !!(extracted.nome || extracted.telefone);
  }

  /**
   * Gera relatório de extração com confiança
   * @param text - Texto analisado
   * @returns Objeto com dados e confiança da extração
   */
  static extractWithConfidence(text: string): {
    data: IExtractedData;
    confidence: number;
    fieldsFound: number;
  } {
    const data = this.extractAll(text);
    const fieldsFound = Object.values(data).filter((v) => v !== undefined).length;
    const totalFields = 5; // nome, telefone, bairro, tipoImovel, valor

    // Calcular confiança baseado em quantos campos foram encontrados
    const confidence = (fieldsFound / totalFields) * 100;

    return {
      data,
      confidence,
      fieldsFound
    };
  }
}
