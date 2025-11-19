import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Chat } from '@google/genai';
import type { ChatMessage, SessionMetadata } from './types';
import { getEvaluationPrompt, getWeekThemes } from './services/geminiService';
import ChatMessageComponent from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WeekSelector from './components/WeekSelector';
import SessionTimer from './components/SessionTimer';
import { DownloadIcon, EmailIcon } from './components/Icons';
import { generateEvaluationReport } from './utils/reportGenerator';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentThemes, setCurrentThemes] = useState<string>(getWeekThemes(currentWeek));
  const [error, setError] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  // Timer pour la durée de session
  useEffect(() => {
    if (isSessionActive) {
      timerIntervalRef.current = setInterval(() => {
        setSessionDuration(Date.now() - sessionStartTime);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isSessionActive, sessionStartTime]);

  const startNewSession = () => {
    setIsLoading(true);
    setMessages([]);
    const startTime = Date.now();
    setSessionStartTime(startTime);
    setSessionDuration(0);
    setIsSessionActive(true);
    
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: `model-${startTime}`,
        role: 'model',
        text: `Bonjour ! Bienvenue dans cette session d'évaluation dialogique. Nous avons environ 20 minutes ensemble.

Mon objectif n'est pas de vous donner une note, mais de comprendre **COMMENT** vous apprenez et réfléchissez en français.

Je vais vous poser des questions sur :
- Votre processus de réflexion
- Vos stratégies d'apprentissage  
- Ce qui vous aide à apprendre

Il n'y a pas de mauvaise réponse - ce qui m'intéresse, c'est de voir comment vous pensez.

Nous travaillons sur les thèmes de la semaine ${currentWeek}.

Prêt(e) ? Commençons ! Comment vous sentez-vous aujourd'hui ?`,
        timestamp: startTime,
      };
      setMessages([welcomeMessage]);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    const initializeChat = () => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("VITE_GEMINI_API_KEY environment variable not set.");
        }
        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        setCurrentThemes(getWeekThemes(currentWeek));
        const systemInstruction = getEvaluationPrompt(currentWeek);
        
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction,
          },
        });
        
        startNewSession();

      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred during initialization.');
      }
    };
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeek]);
  
  const handleWeekChange = (week: number) => {
    if (messages.length > 1 && !window.confirm('Changer de semaine va démarrer une nouvelle session d\'évaluation. Voulez-vous continuer ?')) {
      return;
    }
    setCurrentWeek(week);
  };

  const handleEndSession = () => {
    if (!window.confirm('Voulez-vous vraiment terminer cette session d\'évaluation ?')) {
      return;
    }
    setIsSessionActive(false);
    
    // Message de fin
    const endMessage: ChatMessage = {
      id: `model-end-${Date.now()}`,
      role: 'model',
      text: `Merci pour votre participation à cette session d'évaluation dialogique ! 

La session a duré ${Math.floor(sessionDuration / 60000)} minutes et ${Math.floor((sessionDuration % 60000) / 1000)} secondes.

Vous pouvez maintenant télécharger le rapport d'évaluation en cliquant sur le bouton de téléchargement.

N'oubliez pas de l'envoyer à votre enseignante Marion Vizier-Marzais : marionviz@hotmail.com`,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, endMessage]);
  };

  const handleDownload = () => {
    const metadata: SessionMetadata = {
      sessionId: `${currentWeek}-${sessionStartTime}`,
      week: currentWeek,
      startTime: sessionStartTime,
      endTime: Date.now(),
      totalExchanges: messages.filter(m => m.role === 'user').length,
      metacognitiveQuestionsAsked: messages.filter(m => 
        m.role === 'model' && m.text.includes('❓')
      ).length,
    };

    const report = generateEvaluationReport(messages, metadata, currentWeek);
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluacompagnon-semaine-${currentWeek}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = () => {
    const metadata: SessionMetadata = {
      sessionId: `${currentWeek}-${sessionStartTime}`,
      week: currentWeek,
      startTime: sessionStartTime,
      endTime: Date.now(),
      totalExchanges: messages.filter(m => m.role === 'user').length,
      metacognitiveQuestionsAsked: messages.filter(m => 
        m.role === 'model' && m.text.includes('❓')
      ).length,
    };

    const report = generateEvaluationReport(messages, metadata, currentWeek);
    
    // Créer l'URL mailto avec le rapport dans le corps
    const subject = encodeURIComponent(`ÉvaluaCompagnon - Semaine ${currentWeek} - ${new Date().toLocaleDateString('fr-FR')}`);
    const body = encodeURIComponent(report);
    const mailtoLink = `mailto:marionviz@hotmail.com?subject=${subject}&body=${body}`;
    
    // Ouvrir le client email
    window.location.href = mailtoLink;
  };

  const handleSendMessage = async (text: string) => {
    if (!chatRef.current) {
      setError("Chat is not initialized.");
      return;
    }

    setIsLoading(true);
    const timestamp = Date.now();
    const userMessage: ChatMessage = { 
      id: `user-${timestamp}`, 
      role: 'user', 
      text,
      timestamp 
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const modelMessage: ChatMessage = { 
      id: `model-${timestamp}`, 
      role: 'model', 
      text: '',
      timestamp: Date.now()
    };
    setMessages((prevMessages) => [...prevMessages, modelMessage]);

    try {
      const result = await chatRef.current.sendMessageStream({ message: text });
      
      let streamedText = '';
      for await (const chunk of result) {
        streamedText += chunk.text;
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          if (newMessages.length > 0) {
            const lastMessage = newMessages[newMessages.length - 1];
            newMessages[newMessages.length - 1] = { 
              ...lastMessage, 
              text: streamedText,
              timestamp: Date.now()
            };
          }
          return newMessages;
        });
      }

    } catch (e) {
      console.error(e);
      const errorMessage = "Désolé, une erreur est survenue. Veuillez réessayer.";
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        if (newMessages.length > 0) {
          const lastMessage = newMessages[newMessages.length - 1];
          newMessages[newMessages.length - 1] = { 
            ...lastMessage, 
            text: errorMessage 
          };
        }
        return newMessages;
      });
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white font-sans">
      <header className="p-4 border-b-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              ÉVALUATION
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              Évalua<span className="text-green-600">Compagnon</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <SessionTimer 
              duration={sessionDuration} 
              isActive={isSessionActive}
              maxDuration={20 * 60 * 1000}
            />
            <WeekSelector currentWeek={currentWeek} onWeekChange={handleWeekChange} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex-grow">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Semaine {currentWeek} :</span> {currentThemes}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              📊 Échanges : {messages.filter(m => m.role === 'user').length} • 
              ⏱️ Durée : {formatTime(sessionDuration)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownload} 
              disabled={messages.length < 2}
              aria-label="Télécharger le rapport" 
              className="p-2 rounded-md text-gray-500 hover:bg-green-100 hover:text-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Télécharger le rapport"
            >
              <DownloadIcon className="w-5 h-5"/>
            </button>
            <button 
              onClick={handleSendEmail} 
              disabled={messages.length < 2}
              aria-label="Envoyer par email" 
              className="p-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Envoyer le rapport par email à votre enseignante"
            >
              <EmailIcon className="w-5 h-5"/>
            </button>
            <button 
              onClick={handleEndSession} 
              disabled={!isSessionActive || messages.length < 2}
              className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Terminer
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-green-50/30 to-white">
        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
            <span className="font-medium">Erreur :</span> {error}
          </div>
        )}

        {!isSessionActive && messages.length > 1 && (
          <div className="p-4 mb-4 text-sm text-green-800 bg-green-100 rounded-lg">
            <span className="font-medium">✅ Session terminée</span> • Vous pouvez télécharger votre rapport d'évaluation.
          </div>
        )}

        <div className="flex flex-col">
          {messages.map((msg) => (
            <ChatMessageComponent 
              key={msg.id} 
              message={msg}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <footer className="p-2 sticky bottom-0 bg-white border-t border-gray-200">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
          disabled={!isSessionActive}
        />
      </footer>
    </div>
  );
};

export default App;
