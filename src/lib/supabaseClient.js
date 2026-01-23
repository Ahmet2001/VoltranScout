
import { createClient } from '@supabase/supabase-js';

// We will load these from LocalStorage so you can input them in the UI
// instead of hardcoding them in the code (easier for you to setup).
const getSupabaseConfig = () => {
    // Priority: Env Vars (Production) -> LocalStorage (Dev/Manual)
    const projectUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL || localStorage.getItem('supabase_project_url');
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabase_anon_key');
    return { projectUrl, anonKey };
}

const { projectUrl, anonKey } = getSupabaseConfig();

// If keys aren't set, we return a dummy client or handle it in the UI
export const supabase = (projectUrl && anonKey)
    ? createClient(projectUrl, anonKey)
    : null;

export const saveSupabaseConfig = (url, key) => {
    localStorage.setItem('supabase_project_url', url);
    localStorage.setItem('supabase_anon_key', key);
    window.location.reload(); // Reload to initialize client
};
