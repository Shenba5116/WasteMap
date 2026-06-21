import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../services/supabase';
import { Leaf } from 'lucide-react';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'citizen' | 'cleaner' | 'admin'>('citizen');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    // Auto sign-up for demo purposes if invalid credentials
    if (error && error.message.includes('Invalid login credentials')) {
      const res = await supabase.auth.signUp({ email, password });
      data = res.data;
      error = res.error;
      
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          role: role,
          full_name: email.split('@')[0]
        });
        alert('Signup successful! Please check your email inbox to confirm your account before logging in.');
        setLoading(false);
        return;
      }
    }

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        alert('Please check your email and confirm your account before logging in! (Or disable Email Confirmation in your Supabase Auth Settings)');
      } else {
        alert(error.message);
      }
      setLoading(false);
      return;
    }

    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email });
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      
      setProfile({ 
        id: data.user.id, 
        role: profileData?.role || role, 
        full_name: profileData?.full_name 
      });
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logoRow}>
          <div className={styles.logoIcon}>
            <Leaf size={22} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>EcoMap</span>
        </div>
        <h2>Welcome Back</h2>
        <p>Sign in to your account or auto-register</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as any)}>
              <option value="citizen">Citizen</option>
              <option value="cleaner">Cleaner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </form>
        <p className={styles.helpText}>New accounts are created automatically on first login</p>
      </div>
    </div>
  );
};

export default LoginPage;
