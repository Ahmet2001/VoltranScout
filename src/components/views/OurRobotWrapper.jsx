
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { QuestionForm } from './QuestionForm';
import { useParams } from 'react-router-dom';

export const OurRobotWrapper = () => {
    const [teamId, setTeamId] = useState(null);

    useEffect(() => {
        const fetchOrCreateMyBot = async () => {
            if (!supabase) return;

            // Try to find "MY-BOT"
            let { data, error } = await supabase
                .from('teams')
                .select('id')
                .eq('number', 'MY-BOT')
                .single();

            if (data) {
                setTeamId(data.id);
            } else {
                // Create it
                const { data: newTeam, error: createError } = await supabase
                    .from('teams')
                    .insert([{ number: 'MY-BOT', name: 'Our Robot', notes: 'Top Secret' }])
                    .select()
                    .single();

                if (newTeam) setTeamId(newTeam.id);
            }
        };
        fetchOrCreateMyBot();
    }, []);

    if (!teamId) return <div className="p-10 text-center">Loading My Bot Profile...</div>;

    // We can't pass params via Route directly because QuestionForm uses useParams.
    // So we must render a modified version or context. 
    // Actually QuestionForm uses `useParams`. We can't override them easily without a Route.
    // Trick: We will just redirect? No, better to make QuestionForm accept props override.
    return <QuestionFormOverride teamId={teamId} cardId="OUR_TEAM" />;
};

// Small wrapper to inject props into a context or just modify QuestionForm to accept props
import { QuestionForm as OriginalQF } from './QuestionForm';

const QuestionFormOverride = ({ teamId, cardId }) => {
    // We need to allow QuestionForm to read props instead of useParams if provided.
    // I will modify QuestionForm to handle this.
    return <OriginalQF overrideIds={{ teamId, cardId }} />;
};
