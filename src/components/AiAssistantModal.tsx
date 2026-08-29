import React, { useState } from 'react';
import { WasteBin, CollectionArea, CollectionRoute } from '../types';
import { Bot, Sparkles, Send, User, CheckCircle2, RefreshCw } from 'lucide-react';
import { fetchAiConsultantAnswer } from '../services/aiService';

interface AiAssistantModalProps {
  bins: WasteBin[];
  areas: CollectionArea[];
  routes: CollectionRoute[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  actions?: string[];
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  bins,
  areas,
  routes
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello, Officer. I am your WasteWise AI Operations Assistant. I monitor all real-time IoT smart bin levels, accumulation velocities, and fleet dispatches. How may I assist your municipal planning today?',
      actions: [
        'Forecast Zone A overflow timeline',
        'Recommend electric fleet reallocation',
        'Summarize peak holiday surge mitigations'
      ],
      timestamp: '10:00 AM'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const context = {
        totalBins: bins.length,
        criticalBins: bins.filter(b => b.currentFillPercent >= 90).length,
        requiringCollection: bins.filter(b => b.currentFillPercent >= 75).length,
        efficiency: '94.2%',
        activeRoutesCount: routes.length
      };

      const result = await fetchAiConsultantAnswer(textToSend, context);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: result.answer,
        actions: result.recommendedActions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#111417] rounded-2xl border border-[#272D33] shadow-sm flex flex-col h-[650px]">
      {/* Header */}
      <div className="p-4 border-b border-[#272D33] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 flex items-center justify-center font-bold shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[#F1F3F4]">
                WasteWise AI Municipal Advisor
              </h3>
              <span className="text-[10px] font-bold bg-[#171B1F] text-emerald-400 border border-[#272D33] px-2 py-0.5 rounded-md">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-[11px] text-[#68717B]">
              Live operational query engine with direct telemetry context
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
              msg.sender === 'user'
                ? 'bg-[#1C2126] text-[#F1F3F4] border border-[#272D33]'
                : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
            </div>

            <div className={`max-w-xl rounded-2xl p-4 text-xs space-y-2 leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-[#1C2126] text-[#F1F3F4] border border-[#272D33] font-medium'
                : 'bg-[#171B1F] border border-[#272D33] text-[#9AA3AD]'
            }`}>
              <p className="text-[#F1F3F4]">{msg.text}</p>

              {msg.actions && msg.actions.length > 0 && (
                <div className="pt-2 border-t border-[#272D33] space-y-1.5">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Recommended Operational Directives:
                  </div>
                  {msg.actions.map((act, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#F1F3F4] bg-[#111417] p-2 rounded-lg border border-[#272D33]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className={`text-[9px] text-[#68717B] text-right font-mono`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#9AA3AD] bg-[#171B1F] border border-[#272D33] p-3 rounded-xl w-fit font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Consulting real-time waste sensor matrix...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-[#272D33] bg-[#111417]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about accumulation trends, route bottlenecks, or bin health..."
            className="flex-1 text-xs bg-[#171B1F] border border-[#272D33] rounded-xl px-4 py-3 text-[#F1F3F4] placeholder-[#68717B] focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold px-4 py-3 rounded-xl text-xs transition-all border border-emerald-600/40 flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
