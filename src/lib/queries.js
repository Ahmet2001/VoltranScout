
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';

/* --- TEAMS --- */

export const useTeams = () => {
    return useQuery({
        queryKey: ['teams'],
        queryFn: async () => {
            if (!supabase) return [];
            const { data, error } = await supabase
                .from('teams')
                .select('*')
                .order('number', { ascending: true });

            if (error) throw error;
            return data;
        }
    });
};

export const useAddTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (team) => {
            // team = { number: '1234A', name: '...' }
            if (!supabase) throw new Error("No database connection");
            const { data, error } = await supabase
                .from('teams')
                .insert([team])
                .select();

            if (error) throw error;
            return data[0];
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['teams']);
        }
    });
};

/* --- MATCHES / CARDS --- */

export const useTeamMatches = (teamId) => {
    return useQuery({
        queryKey: ['matches', teamId],
        queryFn: async () => {
            if (!supabase || !teamId) return [];
            const { data, error } = await supabase
                .from('matches')
                .select('*')
                .eq('team_id', teamId);

            if (error) throw error;
            return data;
        },
        enabled: !!teamId
    });
};

export const useSaveMatchData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ teamId, matchType, data, scoutName }) => {
            // Check if exists to update, or insert? 
            // We'll use 'upsert' based on a unique constraint or just insert a new log?
            // For this app, let's assume one record per match_type per team for simplicity OR multiple logs.
            // User requested "cards", usually Q1, Q2 are distinct slots.

            // First check if record exists for this slot
            const { data: existing } = await supabase
                .from('matches')
                .select('id')
                .eq('team_id', teamId)
                .eq('match_type', matchType)
                .single();

            let result;
            if (existing) {
                // Update
                result = await supabase
                    .from('matches')
                    .update({ data, scout_name: scoutName })
                    .eq('id', existing.id);
            } else {
                // Insert
                result = await supabase
                    .from('matches')
                    .insert([{ team_id: teamId, match_type: matchType, data, scout_name: scoutName }]);
            }

            if (result.error) throw result.error;
            return result.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['matches', variables.teamId]);
        }
    });

};

/* --- AI / GLOBAL DATA --- */

export const useAllScoutingData = () => {
    return useQuery({
        queryKey: ['allData'],
        queryFn: async () => {
            if (!supabase) return { teams: [], matches: [] };

            // Fetch Teams
            const { data: teams } = await supabase.from('teams').select('*');
            // Fetch All Matches with Team Info
            const { data: matches } = await supabase.from('matches').select('*, teams(number, name)');

            return { teams: teams || [], matches: matches || [] };
        }
    });
};
