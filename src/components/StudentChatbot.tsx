import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface StudentChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function StudentChatbot({ isOpen, onToggle }: StudentChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Magic Bus assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const suggestedQuestions = [
    'How do I complete registration?',
    'What are the training modules?',
    'How can I apply for placements?',
    'How do I link my DigiLocker?',
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const getBotResponse = (userText: string): string => {
    const text = userText.toLowerCase();

    if (text.includes('registration')) {
      return 'To complete registration, go to the Registration section and fill in your Personal Details, Academic Details, and Extra-Curricular Activities. Then review and confirm your information.';
    }
    if (text.includes('training') || text.includes('module')) {
      return 'Our training modules cover essential skills like communication, technical skills, and advanced topics. You can access them in the Training Modules section after completing registration.';
    }
    if (text.includes('placement')) {
      return 'Check the Placement Support section to view latest job opportunities. You can apply directly through the platform and get career guidance from our mentors.';
    }
    if (text.includes('digilocker')) {
      return 'DigiLocker integration allows you to securely fetch and store your academic certificates. You can link it from your profile settings to auto-fill academic details.';
    }
    if (text.includes('progress') || text.includes('status')) {
      return 'Your application status is tracked in the Application Status section. You can see which stages you\'ve completed and what\'s next.';
    }
    if (text.includes('help') || text.includes('support')) {
      return 'I\'m here to help! You can ask me about registration, training, placements, or any other aspect of the Magic Bus program. Feel free to reach out anytime!';
    }

    return 'Thank you for your question! You can explore different sections of your dashboard to find more information. Would you like help with registration, training, placements, or something else?';
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 left-8 w-80 bg-white rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col max-h-96">
          <div className="bg-red-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold text-sm">Magic Bus Assistant</h3>
            <button
              onClick={onToggle}
              className="hover:bg-red-700 p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-red-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {messages.length === 1 && (
            <div className="p-3 bg-white border-t border-gray-200 space-y-2">
              <p className="text-xs font-semibold text-gray-600">Suggested:</p>
              <div className="space-y-1">
                {suggestedQuestions.slice(0, 2).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-left text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 p-2 bg-white flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(inputValue);
                }
              }}
              placeholder="Type message..."
              className="flex-grow px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-red-500"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              className="bg-red-600 hover:bg-red-700 text-white p-1 rounded transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        className={`fixed bottom-8 left-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 z-40 flex-shrink-0 ${
          isOpen ? 'bg-gray-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>
    </>
  );
}
