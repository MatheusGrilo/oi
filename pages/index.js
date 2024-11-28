import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([{ from: 'Grilo', text: 'Qual seu nome?' }]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [isEasterEgg, setIsEasterEgg] = useState(false);
  const [name, setName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = (from, text) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages, { from, text }];
      return newMessages.length > 30 ? newMessages.slice(newMessages.length - 30) : newMessages;
    });
  };

  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      return "Bom dia";
    } else if (hour >= 12 && hour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  };

  const handleInputSubmit = () => {
    if (step === 0) {
      if (!isValidName(input)) {
        sendMessage('Grilo', 'Por favor, insira um nome válido.');
        setInput('');
        return;
      }
      
      sendMessage('Eu', input);
      // Exibir "digitando..." por 2 segundos
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        if (input.toLowerCase() === 'alyne') {
          setName('Alyne');
          setIsEasterEgg(false);
          setStep(1);
          sendMessage('Grilo', `${getGreeting()}... Alyne? Tem certeza que esse é seu nome?`);
        } else if (input.toLowerCase() === 'aline') {
          setName('Aline');
          setIsEasterEgg(true);
          setStep(1);
          sendMessage('Grilo', `${getGreeting()} Aline? Tem certeza que esse é seu nome?`);
        } else {
          setName(input);
          sendMessage('Grilo', `Desculpe ${input}, essa página não é para você. Não errou o nome?`);
        }
      }, 2000);
    }
    setInput('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleInputSubmit();
    }
  };

  const handleConfirmation = (confirmation) => {
    sendMessage('Eu', confirmation ? 'Sim' : 'Não');
    if (confirmation) {
      if (isEasterEgg) {
        sendMessage('Grilo', 'Márcia, please... Não gosto de mentiras, talkey! Preciso que seja sincera comigo 🌟 UOOOOOOOOOOOOOOOOOOOOOOOOW');
      } else {
        sendMessage('Grilo', 'Eu te amo, minha princesa linda, maravilhosa, perfeita, que nunca erra, e tá sempre certa, e que vai todos os dias ao bosque colher lenha. ❤️');
      }
      setStep(2);
    } else {
      setMessages([{ from: 'Grilo', text: 'Qual seu nome?' }]);
      setStep(0);
      setName('');
      setIsEasterEgg(false);
    }
  };

  const reset = () => {
    setMessages([{ from: 'Grilo', text: 'Qual seu nome?' }]);
    setInput('');
    setStep(0);
    setName('');
    setIsEasterEgg(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isValidName = (name) => {
    const regex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
    return regex.test(name);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col space-y-4 mb-4 max-h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.from === 'Grilo' ? 'justify-start' : 'justify-end'}`}>
              <div className={`p-2 rounded ${msg.from === 'Grilo' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                <strong>{msg.from}:</strong> {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="p-2 rounded bg-gray-300 text-gray-700">Digitando...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {step < 2 && (
          <div className="flex items-center space-x-2">
            {step === 1 ? (
              <>
                <button
                  className="bg-green-500 text-white p-2 rounded dark:bg-green-700"
                  onClick={() => handleConfirmation(true)}
                  disabled={isTyping}
                >
                  Sim
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded dark:bg-red-700"
                  onClick={() => handleConfirmation(false)}
                  disabled={isTyping}
                >
                  Não
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  className="flex-1 border p-2 dark:bg-gray-700 dark:text-gray-100"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                />
                <button
                  className="bg-blue-500 text-white p-2 rounded dark:bg-blue-700"
                  onClick={handleInputSubmit}
                  disabled={isTyping}
                >
                  Enviar
                </button>
              </>
            )}
          </div>
        )}
        {step === 2 && (
          <button
            className="mt-4 bg-gray-500 text-white p-2 rounded dark:bg-gray-700"
            onClick={reset}
          >
            Reiniciar
          </button>
        )}
      </div>
    </div>
  );
}