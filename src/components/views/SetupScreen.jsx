
import React, { useState } from 'react';
import { saveSupabaseConfig } from '../../lib/supabaseClient';
import { Shield, Key, Database } from 'lucide-react';

const SetupScreen = () => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!url || !key) return alert('Please enter both URL and Key');
    setLoading(true);
    saveSupabaseConfig(url, key);
  };

  // Inline styles for speed, or move to index.css
  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e1b4b, #000)',
      padding: '20px'
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      padding: '40px 30px',
      borderRadius: '24px',
      textAlign: 'center'
    },
    iconWrapper: {
      width: '80px',
      height: '80px',
      background: 'rgba(99, 102, 241, 0.1)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)'
    },
    inputGroup: { marginBottom: '20px', textAlign: 'left' },
    label: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' },
    input: {
      width: '100%',
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid var(--glass-border)',
      padding: '14px',
      borderRadius: '12px',
      color: 'white',
      fontSize: '1rem',
      outline: 'none',
      transition: '0.2s',
      boxSizing: 'border-box'
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        <div style={styles.iconWrapper}>
          <Database size={48} className="text-primary" />
        </div>
        <h1 style={{ margin: '0 0 10px', fontWeight: 700 }}>Connect to Cloud</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.95rem', lineHeight: 1.5 }}>
          To sync data with your team, please enter your Supabase project details.
        </p>

        <div style={styles.inputGroup}>
          <label style={styles.label}><Shield size={16} /> Project URL</label>
          <input
            type="text"
            placeholder="https://xyz.supabase.co"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
            className="focus-glow"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}><Key size={16} /> Anon Key</label>
          <input
            type="password"
            placeholder="eyJh..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={styles.input}
            className="focus-glow"
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--primary), #4f46e5)',
            color: 'white',
            padding: '16px',
            borderRadius: '14px',
            fontWeight: 600,
            fontSize: '1.05rem',
            marginTop: '10px'
          }}
        >
          {loading ? 'Connecting...' : 'Connect & Start'}
        </button>

        <p style={{ marginTop: '24px', fontSize: '0.8rem' }}>
          Don't have a project? <a href="https://supabase.com" target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Create one for free</a>.
        </p>
      </div>
    </div>
  );
};

export default SetupScreen;
