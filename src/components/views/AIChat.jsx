
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import { useAllScoutingData } from '../../lib/queries';
import { groq, SYSTEM_PROMPT } from '../../lib/groqClient';
import { motion } from 'framer-motion';

export const AIChat = () => {
    const { data: scoutingData, isLoading: isLoadingData } = useAllScoutingData();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your VEX Scout AI. I have analyzed all the team data. Ask me anything! e.g., 'Who is the best driver?' or 'What is 1234A's weakness?'" }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isThinking) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsThinking(true);

        try {
            // 1. Construct RAG Context
            let contextText = "CURRENT DATABASE STATE:\n";
            if (scoutingData?.teams?.length) {
                contextText += `TEAMS: ${scoutingData.teams.map(t => `${t.number} (${t.name})`).join(', ')}\n`;
            } else {
                contextText += "No teams found in database.\n";
            }

            if (scoutingData?.matches?.length) {
                contextText += "MATCH/ANALYSIS LOGS:\n";
                scoutingData.matches.forEach(m => {
                    contextText += `- Team ${m.teams?.number}: [${m.match_type}] Data: ${JSON.stringify(m.data)}\n`;
                });
            } else {
                contextText += "No match analysis recorded yet.\n";
            }

            // 2. Call Groq
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT + "\n\n" + contextText },
                    ...messages.map(m => ({ role: m.role, content: m.content })),
                    { role: 'user', content: userMsg }
                ],
                model: 'llama-3.1-8b-instant', // Updated to supported model
                temperature: 0.5,
            });

            const reply = completion.choices[0]?.message?.content || "I couldn't generate a response.";
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Error accessing AI: " + err.message }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="container flex flex-col h-[85vh] p-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-accent" />
                <h2 className="text-2xl font-black italic">AI Analyst</h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-black/20 border border-glass-border rounded-2xl p-4 flex flex-col gap-4 mb-4">
                {isLoadingData && <div className="text-center text-muted">Loading Scouting Data...</div>}
                {!isLoadingData && messages.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-primary' : 'bg-accent'}`}>
                            {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`
                            p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed
                            ${m.role === 'assistant'
                                ? 'bg-panel border border-glass-border text-white'
                                : 'bg-primary text-white font-medium'}
                        `}>
                            {m.content}
                        </div>
                    </motion.div>
                ))}
                {isThinking && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><Bot size={16} /></div>
                        <div className="bg-panel border border-glass-border p-3 rounded-2xl text-muted text-sm italic animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Ask about team strategies..."
                    className="w-full bg-card border border-glass-border rounded-xl py-4 pl-4 pr-12 text-white focus:border-primary outline-none shadow-lg"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    disabled={isThinking || !input.trim()}
                    className="absolute right-2 top-2 p-2 bg-primary text-white rounded-lg hover:brightness-110 active:scale-95 transition-transform disabled:opacity-50"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};
