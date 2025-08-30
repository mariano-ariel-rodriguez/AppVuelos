import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Minimize2, Maximize2, MessageCircle } from 'lucide-react';

const AIChatbot = ({ currentService }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '¡Hola! Soy tu asistente IA especializado en vuelos privados. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Respuestas IA simuladas (en producción usarías OpenAI/Claude)
  const getAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = userMessage.toLowerCase();
    let response = '';

    // Respuestas contextuales según el servicio actual
    if (currentService === 'medical') {
      if (lowerMessage.includes('equipamiento') || lowerMessage.includes('médico')) {
        response = `Para emergencias médicas, recomiendo:\n\n✈️ **Citation Medical** con:\n- UCI completa a bordo\n- Desfibrilador automático\n- Respirador portátil\n- Personal médico certificado\n\n💰 Precio estimado: $15,000 USD\n⏱️ Disponible en 30 minutos`;
      } else if (lowerMessage.includes('urgente') || lowerMessage.includes('emergencia')) {
        response = `🚨 **PROTOCOLO DE EMERGENCIA ACTIVADO**\n\nTengo 3 ambulancias aéreas disponibles:\n\n1. **King Air Medical** - 15 min\n2. **Citation Medical** - 20 min\n3. **Helicopter Rescue** - 8 min\n\n¿Cuál es la ubicación del paciente?`;
      } else {
        response = `En vuelos médicos, puedo ayudarte con:\n\n🏥 Coordinación hospitalaria\n💊 Equipamiento especializado\n👨‍⚕️ Personal médico a bordo\n📞 Protocolos de emergencia\n\n¿Qué necesitas específicamente?`;
      }
    } else if (currentService === 'incucai') {
      if (lowerMessage.includes('órgano') || lowerMessage.includes('trasplante')) {
        response = `🫀 **PROTOCOLO INCUCAI**\n\nPara trasplante de órganos:\n\n❄️ **Cadena de frío garantizada**\n📦 Contenedores especializados\n🔴 Prioridad absoluta en rutas aéreas\n📱 Tracking GPS en tiempo real\n\n⏰ **Tiempo crítico**: ¿Qué órgano necesitas transportar?`;
      } else if (lowerMessage.includes('tiempo') || lowerMessage.includes('isquemia')) {
        response = `⏱️ **TIEMPOS MÁXIMOS DE ISQUEMIA:**\n\n💓 Corazón: 4-6 horas\n🫁 Pulmón: 6-8 horas\n🫘 Riñón: 18-24 horas\n🫗 Hígado: 12-15 horas\n\nTenemos jets especializados listos 24/7. ¿Cuál es la urgencia?`;
      } else {
        response = `Para trasplantes INCUCAI ofrezco:\n\n🚁 Helicópteros para distancias cortas\n✈️ Jets para traslados interprovinciales\n❄️ Sistemas de preservación de órganos\n📋 Coordinación con hospitales\n\n¿Necesitas activar protocolo urgente?`;
      }
    } else {
      // Servicio ejecutivo
      if (lowerMessage.includes('precio') || lowerMessage.includes('costo')) {
        response = `💰 **ESTIMACIÓN DE PRECIOS:**\n\n🛩️ **Jet Ligero** (1-8 pax): $5,000-$12,000\n✈️ **Jet Mediano** (6-10 pax): $8,000-$18,000\n🛫 **Jet Pesado** (10-16 pax): $15,000-$35,000\n\n📍 ¿Cuál es tu ruta y fecha de viaje?`;
      } else if (lowerMessage.includes('empty leg') || lowerMessage.includes('oferta')) {
        response = `🎯 **EMPTY LEGS DISPONIBLES:**\n\n✈️ **Citation CJ3+**\nBuenos Aires → Mendoza\n💰 $7,200 (40% OFF)\n📅 Mañana 14:30\n\n🛩️ **King Air 350i**\nCórdoba → Buenos Aires  \n💰 $4,250 (50% OFF)\n📅 Pasado mañana 09:15\n\n¿Te interesa alguno?`;
      } else if (lowerMessage.includes('recomendación') || lowerMessage.includes('jet')) {
        response = `🎯 **RECOMENDACIONES PERSONALIZADAS:**\n\nPara elegir el jet perfecto necesito saber:\n\n👥 ¿Cuántos pasajeros?\n📍 ¿Ruta de vuelo?\n📅 ¿Fecha y horario?\n🍾 ¿Servicios especiales? (catering, WiFi, etc.)\n\n¡Cuéntame más detalles!`;
      } else {
        response = `¡Hola! Como experto en vuelos privados puedo ayudarte con:\n\n✈️ **Recomendaciones de aeronaves**\n💰 **Cotizaciones en tiempo real**\n🎯 **Empty legs con descuentos**\n🍾 **Servicios premium a bordo**\n📱 **Reservas inmediatas**\n\n¿Qué necesitas para tu próximo vuelo?`;
      }
    }

    setIsTyping(false);
    return response;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');

    const aiResponse = await getAIResponse(inputMessage);
    
    const newAIMessage = {
      id: messages.length + 2,
      type: 'ai',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newAIMessage]);
  };

  const quickQuestions = {
    executive: [
      "¿Cuáles son los precios para Buenos Aires-Mendoza?",
      "¿Hay empty legs disponibles hoy?",
      "Recomiéndame un jet para 6 personas"
    ],
    medical: [
      "Necesito una ambulancia aérea urgente",
      "¿Qué equipamiento médico tienen?",
      "Protocolo para emergencia cardiológica"
    ],
    incucai: [
      "Trasplante de corazón urgente",
      "¿Cuánto tiempo de isquemia permite?",
      "Activar protocolo INCUCAI"
    ]
  };

  const currentQuestions = quickQuestions[currentService] || quickQuestions.executive;

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          >
            <MessageCircle size={24} />
          </button>
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
        </div>
      )}

      {/* Chatbot expandido */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className={`p-4 rounded-t-2xl text-white flex items-center justify-between ${
            currentService === 'medical' ? 'bg-gradient-to-r from-red-600 to-red-700' :
            currentService === 'incucai' ? 'bg-gradient-to-r from-green-600 to-green-700' :
            'bg-gradient-to-r from-blue-600 to-purple-600'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold">Asistente IA</h3>
                <p className="text-sm opacity-90">
                  {currentService === 'medical' ? 'Especialista Médico' :
                   currentService === 'incucai' ? 'Experto INCUCAI' :
                   'Consultor de Vuelos'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line text-sm">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Preguntas frecuentes:</p>
            <div className="flex flex-wrap gap-2">
              {currentQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                placeholder="Escribe tu consulta..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;