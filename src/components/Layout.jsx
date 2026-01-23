
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Users, UserPlus, Sparkles, Activity } from 'lucide-react';
import { useUI } from '../lib/AppProvider';
import { AddTeamModal } from './views/AddTeamModal';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAddTeamModalOpen, setIsAddTeamModalOpen } = useUI();

    // Styles
    const styles = {
        appShell: {
            display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-app)', overflow: 'hidden'
        },
        topNav: {
            height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 10
        },
        logo: {
            display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.5px'
        },
        mainContent: {
            flex: 1, overflowY: 'auto', paddingBottom: '80px'
        },
        bottomBar: {
            position: 'absolute', bottom: '20px', left: '20px', right: '20px', height: '65px', borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'spaceAround', zIndex: 20
        },
        navItem: {
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.7rem', padding: '8px'
        },
        fabMain: {
            width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px var(--primary-glow)',
            marginBottom: '25px', border: '4px solid var(--bg-app)'
        }
    };

    return (
        <div style={styles.appShell}>
            {/* Top Navigation Bar */}
            <header className="glass-panel" style={styles.topNav}>
                <div style={{ ...styles.logo }}>
                    <Activity size={24} color="var(--accent)" />
                    <span>Scout<span className="text-primary" style={{ color: 'var(--primary)' }}>V5</span></span>
                </div>
                <div>
                    <button title="AI Assistant" onClick={() => navigate('/ai')}>
                        <Sparkles size={20} color="var(--accent)" />
                    </button>
                </div>
            </header>

            {/* Main scrollable content area */}
            <main style={styles.mainContent}>
                <Outlet />
            </main>

            {/* Global Add Team Modal */}
            <AddTeamModal isOpen={isAddTeamModalOpen} onClose={() => setIsAddTeamModalOpen(false)} />

            {/* Bottom Bar */}
            <div className="glass-panel" style={{ ...styles.bottomBar, justifyContent: 'space-around' }}>
                <button
                    style={{ ...styles.navItem, color: location.pathname.includes('teams') ? 'var(--text-main)' : 'var(--text-muted)' }}
                    onClick={() => navigate('/teams')}
                >
                    <Users size={20} />
                    <span>Teams</span>
                </button>
                <button
                    style={{ ...styles.navItem, color: location.pathname.includes('our-robot') ? 'var(--text-main)' : 'var(--text-muted)' }}
                    onClick={() => navigate('/our-robot')}
                >
                    <Activity size={20} />
                    <span>My Bot</span>
                </button>

                <button
                    style={{ ...styles.navItem, color: location.pathname.includes('ai') ? 'var(--text-main)' : 'var(--text-muted)' }}
                    onClick={() => navigate('/ai')}
                >
                    <Sparkles size={20} />
                    <span>AI Chat</span>
                </button>
            </div>
        </div>
    );
};

export default Layout;
