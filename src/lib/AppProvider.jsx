import React, { createContext, useContext, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// UI Context for global modals/state
const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const AppProvider = ({ children }) => {
    const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);

    return (
        <QueryClientProvider client={queryClient}>
            <UIContext.Provider value={{ isAddTeamModalOpen, setIsAddTeamModalOpen }}>
                {children}
            </UIContext.Provider>
        </QueryClientProvider>
    );
};
