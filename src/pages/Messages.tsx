import React, { useState } from 'react';
import { Contact, MessageTemplate } from '../types';
import { Send, Eye, Plus, Edit3, Trash2, Type, Image } from 'lucide-react';
import { messageTemplates } from '../data/mockData';
import MediaUpload from '../components/MediaUpload';

interface MessagesProps {
  contacts: Contact[];
  onSendMessage: (contact: Contact, message: string, media?: { file: File; type: 'image' | 'video'; caption: string }) => void;
  sending: boolean;
}

const Messages: React.FC<MessagesProps> = ({ contacts, onSendMessage, sending }) => {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [messageType, setMessageType] = useState<'text' | 'media'>('text');
  const [selectedMedia, setSelectedMedia] = useState<{ file: File; type: 'image' | 'video'; preview: string } | null>(null);
  const [mediaCaption, setMediaCaption] = useState('');

  const processMessage = (template: string, vars: Record<string, string>) => {
    let processed = template;
    Object.entries(vars).forEach(([key, value]) => {
      processed = processed.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return processed;
  };

  const getCurrentMessage = () => {
    if (selectedTemplate) {
      return processMessage(selectedTemplate.content, variables);
    }
    return customMessage;
  };

  const handleMediaSelect = (file: File, type: 'image' | 'video') => {
    const preview = URL.createObjectURL(file);
    setSelectedMedia({ file, type, preview });
  };

  const handleRemoveMedia = () => {
    if (selectedMedia) {
      URL.revokeObjectURL(selectedMedia.preview);
    }
    setSelectedMedia(null);
    setMediaCaption('');
  };
  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setCustomMessage('');
    
    // Inicializar variáveis padrão
    const defaultVars: Record<string, string> = {
      corretor: 'João Corretor',
      imobiliaria: 'Imobiliária Prime',
      nome: '{será substituído para cada contato}',
    };
    
    const newVariables = { ...defaultVars };
    template.variables.forEach(variable => {
      if (!newVariables[variable]) {
        newVariables[variable] = '';
      }
    });
    setVariables(newVariables);
  };

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    setSelectedContacts(
      selectedContacts.length === contacts.length
        ? []
        : contacts.map(c => c.id)
    );
  };

  const handleSendBulk = async () => {
    if (selectedContacts.length === 0) {
      alert('Selecione pelo menos um contato');
      return;
    }

    if (messageType === 'media' && !selectedMedia) {
      alert('Selecione uma mídia para enviar');
      return;
    }

    if (messageType === 'text') {
      const message = getCurrentMessage();
      if (!message.trim()) {
        alert('Digite uma mensagem');
        return;
      }
    }

    const selectedContactObjects = contacts.filter(c => selectedContacts.includes(c.id));
    
    for (const contact of selectedContactObjects) {
      try {
        if (messageType === 'media') {
          await onSendMessage(contact, mediaCaption, {
            file: selectedMedia!.file,
            type: selectedMedia!.type,
            caption: mediaCaption
          });
        } else {
          // Personalizar mensagem para cada contato
          const message = getCurrentMessage();
          let personalizedMessage = message;
          if (selectedTemplate) {
            const contactVars = { ...variables, nome: contact.name };
            personalizedMessage = processMessage(selectedTemplate.content, contactVars);
          }
          await onSendMessage(contact, personalizedMessage);
        }
        // Delay entre mensagens
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Erro ao enviar mensagem para', contact.name, error);
      }
    }
    
    alert(`Mensagens enviadas para ${selectedContacts.length} contatos!`);
    setSelectedContacts([]);
  };

  // Cleanup URL objects when component unmounts or media changes
  React.useEffect(() => {
    return () => {
      if (selectedMedia) {
        URL.revokeObjectURL(selectedMedia.preview);
      }
    };
  }, [selectedMedia]);
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mensagens</h1>
        <p className="text-gray-600">Crie e envie mensagens personalizadas via WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Selecionar Contatos ({selectedContacts.length})
            </h2>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {selectedContacts.length === contacts.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {contacts.map((contact) => (
              <label key={contact.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => handleContactToggle(contact.id)}
                  className="h-4 w-4 text-blue-600"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                  <p className="text-xs text-gray-600">{contact.phone}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  contact.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                  contact.status === 'negotiating' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {contact.status}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Template Selection */}
        <div className={`bg-white rounded-lg shadow-md p-6 ${messageType === 'media' ? 'lg:col-span-1' : ''}`}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Templates de Mensagem</h2>
          
          {/* Message Type Selector */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Tipo de Mensagem</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setMessageType('text');
                  handleRemoveMedia();
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  messageType === 'text'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Type className="h-4 w-4" />
                <span className="text-sm">Texto</span>
              </button>
              <button
                onClick={() => {
                  setMessageType('media');
                  setSelectedTemplate(null);
                  setCustomMessage('');
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  messageType === 'media'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Image className="h-4 w-4" />
                <span className="text-sm">Mídia</span>
              </button>
            </div>
          </div>
          
          {messageType === 'text' && (
            <div className="space-y-2 mb-4">
            {messageTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {template.category}
                </div>
              </button>
            ))}
            
            <button
              onClick={() => {
                setSelectedTemplate(null);
                setCustomMessage('');
              }}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                !selectedTemplate
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-sm">Mensagem Personalizada</div>
              <div className="text-xs text-gray-600 mt-1">
                Escreva sua própria mensagem
              </div>
            </button>
            </div>
          )}
        </div>

        {/* Message Editor */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Editor de Mensagem</h2>
          
          {messageType === 'media' ? (
            <div>
              <h3 className="font-medium text-gray-700 mb-4">Enviar Mídia</h3>
              <MediaUpload
                onMediaSelect={handleMediaSelect}
                onRemoveMedia={handleRemoveMedia}
                selectedMedia={selectedMedia}
                caption={mediaCaption}
                onCaptionChange={setMediaCaption}
              />
              
              {showPreview && selectedMedia && (
                <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Preview Final:</h4>
                  <div className="bg-white p-3 rounded border">
                    {selectedMedia.type === 'image' ? (
                      <img
                        src={selectedMedia.preview}
                        alt="Preview"
                        className="max-w-full h-32 object-cover rounded mb-2"
                      />
                    ) : (
                      <video
                        src={selectedMedia.preview}
                        className="max-w-full h-32 object-cover rounded mb-2"
                        muted
                      />
                    )}
                    {mediaCaption && (
                      <p className="text-sm text-gray-800">{mediaCaption}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : selectedTemplate ? (
            <div>
              <h3 className="font-medium text-gray-700 mb-3">{selectedTemplate.name}</h3>
              
              {/* Variables */}
              <div className="space-y-3 mb-4">
                {selectedTemplate.variables.map((variable) => (
                  <div key={variable}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {variable}
                    </label>
                    <input
                      type="text"
                      value={variables[variable] || ''}
                      onChange={(e) =>
                        setVariables({ ...variables, [variable]: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={
                        variable === 'nome' 
                          ? 'Será personalizado para cada contato'
                          : `Digite o valor para {${variable}}`
                      }
                      disabled={variable === 'nome'}
                    />
                  </div>
                ))}
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Preview:</h4>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {processMessage(selectedTemplate.content, variables)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Digite sua mensagem personalizada..."
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {showPreview && customMessage && (
                <div className="bg-gray-50 p-3 rounded-lg mt-3">
                  <h4 className="font-medium text-gray-700 mb-2">Preview:</h4>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {customMessage}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Eye className="h-4 w-4" />
              <span>{showPreview ? 'Ocultar' : 'Mostrar'} Preview</span>
            </button>
            
            <button
              onClick={handleSendBulk}
              disabled={sending || selectedContacts.length === 0 || !getCurrentMessage().trim()}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>
                {sending ? 'Enviando...' : 
                 messageType === 'media' ? `Enviar mídia para ${selectedContacts.length} contato(s)` :
                 `Enviar para ${selectedContacts.length} contato(s)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;