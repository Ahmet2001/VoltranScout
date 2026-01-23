
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeams, useTeamMatches } from '../../lib/queries';
import { ArrowLeft, ClipboardList, Activity, CheckCircle, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export const TeamDetail = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const { data: teams } = useTeams();
    const { data: matches, isLoading } = useTeamMatches(teamId);

    const team = teams?.find(t => t.id === teamId);

    if (!team) return <div className="p-10 text-center">Team not found</div>;

    // Define the cards structure
    // BQ = Pre-Game, Q1-Q7 = Matches
    const cards = [
        { id: 'BQ', label: 'BQ', sub: 'Pre-Game Analysis', type: 'PRE' },
        { id: 'Q1', label: 'Q1', sub: 'Qualifier 1', type: 'MATCH' },
        { id: 'Q2', label: 'Q2', sub: 'Qualifier 2', type: 'MATCH' },
        { id: 'Q3', label: 'Q3', sub: 'Qualifier 3', type: 'MATCH' },
        { id: 'Q4', label: 'Q4', sub: 'Qualifier 4', type: 'MATCH' },
        { id: 'Q5', label: 'Q5', sub: 'Qualifier 5', type: 'MATCH' },
        { id: 'Q6', label: 'Q6', sub: 'Qualifier 6', type: 'MATCH' },
        { id: 'Q7', label: 'Q7', sub: 'Qualifier 7', type: 'MATCH' },
    ];

    const isCompleted = (cardId) => {
        return matches?.some(m => m.match_type === cardId);
    };

    return (
        <div className="container pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-app/95 backdrop-blur-md z-10 py-4 mb-4 border-b border-glass-border flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeft />
                </button>
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter">{team.number}</h1>
                    <p className="text-primary font-medium text-sm">{team.name || 'No Name'}</p>
                </div>
            </div>

            {/* AI Insight Banner (Future) */}
            <div className="glass-panel p-4 rounded-xl mb-6 flex items-center gap-3 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Activity size={20} className="text-primary" />
                </div>
                <div>
                    <h4 className="font-bold text-sm">AI Analysis</h4>
                    <p className="text-xs text-muted">Complete BQ and at least 3 matches to unlock AI insights.</p>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
                {cards.map((card, index) => {
                    const completed = isCompleted(card.id);
                    return (
                        <motion.button
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => navigate(`/teams/${teamId}/analysis/${card.id}`)}
                            className={`
                                relative p-4 rounded-2xl border text-left flex flex-col justify-between h-32 active:scale-95 transition-all
                                ${completed
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : 'bg-card border-glass-border hover:border-primary/50'}
                            `}
                        >
                            <div className="flex justify-between items-start w-full">
                                <span className={`text-2xl font-black ${completed ? 'text-green-400' : 'text-white'}`}>
                                    {card.label}
                                </span>
                                {completed && <CheckCircle size={18} className="text-green-400" />}
                            </div>

                            <div>
                                <div className="text-xs text-muted uppercase tracking-wider font-bold mb-1">{card.type}</div>
                                <div className="text-xs text-white/60">{card.sub}</div>
                            </div>

                            {/* BQ Special Glow */}
                            {card.id === 'BQ' && !completed && (
                                <div className="absolute inset-0 bg-accent/5 rounded-2xl border border-accent/20 animate-pulse pointer-events-none" />
                            )}
                        </motion.button>
                    )
                })}
            </div>
        </div>
    );
};
