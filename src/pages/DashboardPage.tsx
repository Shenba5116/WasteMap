import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import CleanerDashboard from '../features/Cleaner/CleanerDashboard';
import AdminDashboard from '../features/Admin/AdminDashboard';
import { Leaf, Award, MapPin, CheckCircle, Clock } from 'lucide-react';
import styles from '../features/Admin/AdminDashboard.module.css'; // Reusing some styles

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();
  const [myReports, setMyReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyReports = async () => {
      if (!user || profile?.role !== 'citizen') return;
      const { data } = await supabase
        .from('reports')
        .select('*')
        .eq('reporter_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) setMyReports(data);
    };
    fetchMyReports();
  }, [user, profile]);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (profile?.role === 'admin') {
    return <div style={{ flex: 1, overflowY: 'auto' }}><AdminDashboard /></div>;
  }

  if (profile?.role === 'cleaner') {
    return <div style={{ flex: 1, overflowY: 'auto' }}><CleanerDashboard /></div>;
  }

  // Citizen Dashboard
  const pendingCount = myReports.filter(r => r.status === 'pending').length;
  const cleanedCount = myReports.filter(r => r.status === 'cleaned' || r.status === 'verified').length;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Citizen Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome, {profile?.full_name || 'Citizen'}! Track your contributions to a cleaner environment.</p>
      </header>

      {/* EcoStats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{profile?.points || 0}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Eco Points</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{myReports.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Reports</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{pendingCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pending Cleanup</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{cleanedCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Resolved</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>My Recent Reports</h3>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}
        >
          <MapPin size={16} /> New Report
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {myReports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
            <Leaf size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No reports yet!</p>
            <p>Start reporting waste in your neighborhood to earn Eco Points.</p>
          </div>
        ) : (
          <div className={styles.reportList} style={{ padding: '1rem' }}>
            {myReports.map((r) => (
              <div key={r.id} className={styles.reportRow} style={{ boxShadow: 'none', borderBottom: '1px solid var(--glass-border)', borderRadius: 0, padding: '1rem' }}>
                <div className={styles.reportInfo}>
                  <div className={styles.reportTitle}>{r.title}</div>
                  <div className={styles.reportMeta}>
                    <span>{r.category}</span>
                    <span>•</span>
                    <span>{r.severity}</span>
                    <span>•</span>
                    <span>{formatDate(r.created_at)}</span>
                  </div>
                </div>
                <span className={`${styles.badge} ${styles[r.status] || ''}`}>
                  {r.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
