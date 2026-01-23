
import React, { useState } from 'react';
import { supabase } from './lib/supabaseClient';
import SetupScreen from './components/views/SetupScreen';
import Layout from './components/Layout';
import { TeamList } from './components/views/TeamList';
import { TeamDetail } from './components/views/TeamDetail';
import { QuestionForm } from './components/views/QuestionForm';
import { AIChat } from './components/views/AIChat';
import { OurRobotWrapper } from './components/views/OurRobotWrapper';
import { AppProvider } from './lib/AppProvider';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
    // We use a key to force re-render if config changes
    const [isConfigured, setIsConfigured] = useState(!!supabase);

    // If supabase is null (no keys), we stay on SetupScreen
    if (!isConfigured) {
        return <SetupScreen />;
    }

    return (
        <AppProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/teams" replace />} />
                        <Route path="teams" element={<TeamList />} />
                        <Route path="teams/:teamId" element={<TeamDetail />} />
                        <Route path="teams/:teamId/analysis/:cardId" element={<QuestionForm />} />
                        <Route path="our-robot" element={<OurRobotWrapper />} />
                        <Route path="ai" element={<AIChat />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;
