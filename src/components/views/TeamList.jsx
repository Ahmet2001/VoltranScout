
import React, { useState } from 'react';
import { useTeams, useAddTeam } from '../../lib/queries';
import { useUI } from '../../lib/AppProvider';
import { Plus, X, Search, ChevronRight, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';



export const TeamList = () => {
    const { data: teams, isLoading, error } = useTeams();
    const { setIsAddTeamModalOpen } = useUI();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredTeams = teams?.filter(t =>
        t.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (error) return <div className="p-4 text-red-500">Error loading teams. Check your connection.</div>;

    return (
        <div className="p-4 container">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Teams</h2>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            if (!supabase) return;
                            const { data } = await supabase.from('matches').select('*, teams(number)');
                            if (!data) return alert('No data to export');

                            // Flatten
                            const csvRows = [];
                            // Header
                            csvRows.push(['Team', 'Match Type', 'Scout', 'Data JSON']);

                            data.forEach(row => {
                                csvRows.push([
                                    row.teams?.number || 'Unknown',
                                    row.match_type,
                                    row.scout_name,
                                    JSON.stringify(row.data).replace(/,/g, ';') // Simple escape
                                ]);
                            });

                            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'scout_data.csv';
                            a.click();
                        }}
                        className="p-2 border border-glass-border rounded-xl hover:bg-white/5 active:scale-95"
                        title="Export CSV"
                    >
                        <Download size={20} />
                    </button>
                    <button
                        onClick={() => setIsAddTeamModalOpen(true)}
                        className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform"
                    >
                        <Plus />
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Search teams..."
                    className="w-full bg-card border border-glass-border rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="text-center text-muted mt-10">Loading teams...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredTeams.map(team => (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => navigate(`/teams/${team.id}`)}
                            className="bg-card border border-glass-border rounded-2xl p-4 relative overflow-hidden group active:scale-95 transition-transform cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-50"><ChevronRight size={16} /></div>
                            <div className="text-3xl font-black text-white/90 mb-1">{team.number}</div>
                            <div className="text-sm text-primary font-medium truncate">{team.name || 'Unnamed'}</div>

                            {/* Decorative Glow */}
                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-colors" />
                        </motion.div>
                    ))}
                </div>
            )}

            {filteredTeams.length === 0 && !isLoading && (
                <div className="text-center text-muted mt-10">
                    <p>No teams found.</p>
                    <button onClick={() => setIsAddTeamModalOpen(true)} className="text-primary mt-2">Add your first team</button>
                </div>
            )}

            {/* Modal Handled Globally in Layout */}
        </div>
    );
};


