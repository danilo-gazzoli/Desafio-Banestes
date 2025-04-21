import React from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { Mensagem } from '../types';

export function ChatAI() {
  // armazena a lista de mensagens 
  const [messages, setMensagens] = React.useState<Mensagem[]>([]);

  // armazena o texto atual como input
  const [input, setInput] = React.useState('');

  // faz o gerenciamento do loading
  const [isLoading, setIsLoading] = React.useState(false);

  // referencia a um elemento vazio para rolar a janela
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // funcao que rola suavemente ate o elemento referenciado, garantindo que a ultima mensagem fique vizivel
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // sempre que a mensagem mudar executa o efeito de rolar para baixo
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // chamado ao enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    // evita recarregar a pagina
    e.preventDefault();

    // nada acontece se o campo estiver vazio
    if (!input.trim()) return;

    // cria uma mensagem com o texto digitado
    const userMessage = { role: 'user' as const, content: input };

    // adiciona ao array Mensagens
    setMensagens(prev => [...prev, userMessage]);

    // limpa o campo de input
    setInput('');

    // inicia o carregamento
    setIsLoading(true);

    // Simula resposta de IA (trocar com chamada da api)
    setTimeout(() => {
      const aiMessage = {
        role: 'assistant' as const,
        content: 'This is a simulated response. Replace this with actual AI integration.'
      };
      setMensagens(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // carrega pagina principal
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-white">
      {/* Header */}
      <div className="bg-[#004B8D] text-white p-4 shadow-lg">
        <h1 className="text-xl font-semibold">Banestes AI Assistant</h1>
        <p className="text-sm opacity-80">Ask me anything about banking services</p>
      </div>

      {/* Chat de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 mx-auto text-[#004B8D] mb-2" />
              <h2 className="text-lg font-semibold text-[#004B8D]">Welcome to Banestes AI Assistant</h2>
              <p className="text-gray-600 mt-2">How can I help you today?</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-[#F7941E]' 
                  : 'bg-[#004B8D]'
              }`}>
                {message.role === 'user' 
                  ? <User className="w-5 h-5 text-white" /> 
                  : <Bot className="w-5 h-5 text-white" />
                }
              </div>
              <div className={`flex flex-col w-full max-w-[80%] leading-1.5 ${
                message.role === 'user' 
                  ? 'items-end' 
                  : 'items-start'
              }`}>
                <div className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-[#F7941E] text-white'
                    : 'bg-[#004B8D] text-white'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#004B8D] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="p-4 rounded-lg bg-[#004B8D] text-white">
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Formulario de input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004B8D] focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-[#003865] text-white rounded-lg hover:bg-[#002D52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
