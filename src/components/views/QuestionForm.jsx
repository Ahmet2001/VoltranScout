
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSaveMatchData, useTeamMatches } from '../../lib/queries';
import { Save, ArrowLeft, User } from 'lucide-react';
import { QUESTIONS_BQ } from '../../config/questions_bq';
import { QUESTIONS_MATCH } from '../../config/questions_match';
import { QUESTIONS_OUR_TEAM } from '../../config/questions_our_team';

export const QuestionForm = ({ overrideIds }) => {
    const params = useParams();
    const teamId = overrideIds?.teamId || params.teamId;
    const cardId = overrideIds?.cardId || params.cardId;

    const navigate = useNavigate();
    const saveMatch = useSaveMatchData();
    const { data: allMatches } = useTeamMatches(teamId);

    // Initial State
    const [answers, setAnswers] = useState({});
    const [scoutInfo, setScoutInfo] = useState(null);

    // Load existing data if available
    useEffect(() => {
        if (allMatches) {
            const existingMatch = allMatches.find(m => m.match_type === cardId);
            if (existingMatch) {
                setAnswers(existingMatch.data || {});
                setScoutInfo(existingMatch.scout_name);
            }
        }
    }, [allMatches, cardId]);

    // Define questions based on type
    let questions = [];
    if (cardId === 'BQ') {
        questions = QUESTIONS_BQ;
    } else if (cardId === 'OUR_TEAM') {
        questions = QUESTIONS_OUR_TEAM;
    } else {
        questions = QUESTIONS_MATCH;
    }

    const handleSave = async () => {
        try {
            await saveMatch.mutateAsync({
                teamId,
                matchType: cardId,
                data: answers,
                scoutName: 'Anon' // Could grab from local storage later
            });
            navigate(-1); // Go back to Team Details
        } catch (err) {
            alert('Failed to save: ' + err.message);
        }
    };

    const handleChange = (id, val) => {
        setAnswers(prev => ({ ...prev, [id]: val }));
    };

    return (
        <div className="container pb-24">
            <div className="sticky top-0 bg-app/95 backdrop-blur-md z-10 py-4 mb-4 border-b border-glass-border flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10">
                        <ArrowLeft />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold">{cardId} Analysis</h2>
                        {scoutInfo && (
                            <div className="flex items-center gap-1 text-xs text-primary">
                                <User size={12} />
                                <span>Scouted by {scoutInfo}</span>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saveMatch.isPending}
                    className="p-2 bg-primary rounded-full text-white shadow-lg active:scale-95 transition-transform"
                >
                    <Save size={20} />
                </button>
            </div>

            <div className="flex flex-col gap-6">
                {questions.map(q => (
                    <div key={q.id} className="bg-card border border-glass-border p-4 rounded-2xl">
                        <label className="block text-sm font-bold text-muted uppercase tracking-wider mb-2">
                            {q.label}
                        </label>

                        {q.type === 'textarea' ? (
                            <textarea
                                className="w-full bg-black/20 border border-glass-border rounded-xl p-3 text-white focus:border-primary outline-none min-h-[100px]"
                                placeholder="Type here..."
                                value={answers[q.id] || ''}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                            />
                        ) : (
                            <input
                                type={q.type}
                                className="w-full bg-black/20 border border-glass-border rounded-xl p-3 text-white focus:border-primary outline-none"
                                placeholder={q.type === 'number' ? '0' : 'Type here...'}
                                value={answers[q.id] || ''}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
