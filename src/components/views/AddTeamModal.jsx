
import React, { useState } from 'react';
import { useAddTeam } from '../../lib/queries';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AddTeamModal = ({ isOpen, onClose }) => {
    const addTeam = useAddTeam();
    const [newTeamNumber, setNewTeamNumber] = useState('');
    const [newTeamName, setNewTeamName] = useState('');

    const handleAddTeam = async () => {
        if (!newTeamNumber.trim()) return;
        try {
            await addTeam.mutateAsync({ number: newTeamNumber, name: newTeamName });
            setNewTeamNumber('');
            setNewTeamName('');
            onClose();
        } catch (e) {
            alert('Error adding team: ' + e.message);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-panel border border-glass-border p-6 rounded-3xl w-full max-w-sm shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Add New Team</h3>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted mb-1">Team Number (e.g. 1234A)</label>
                                <input
                                    className="w-full bg-[#2a2a35] border border-glass-border rounded-xl p-3 text-white placeholder-gray-500 focus:border-primary outline-none"
                                    value={newTeamNumber}
                                    onChange={e => setNewTeamNumber(e.target.value)}
                                    placeholder="1234A"
                                    autoFocus
                                    style={{ color: 'white', background: '#2a2a35' }} // Force style
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted mb-1">Team Name (Optional)</label>
                                <input
                                    className="w-full bg-[#2a2a35] border border-glass-border rounded-xl p-3 text-white placeholder-gray-500 focus:border-primary outline-none"
                                    value={newTeamName}
                                    onChange={e => setNewTeamName(e.target.value)}
                                    placeholder="The Scouts"
                                    style={{ color: 'white', background: '#2a2a35' }} // Force style
                                />
                            </div>
                            <button
                                onClick={handleAddTeam}
                                disabled={addTeam.isPending}
                                className="w-full bg-primary py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all mt-4 flex justify-center items-center gap-2"
                            >
                                <Save size={20} />
                                <span>{addTeam.isPending ? 'Saving...' : 'Add Team'}</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
