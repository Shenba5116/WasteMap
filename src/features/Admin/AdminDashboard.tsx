import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../services/supabase';
import { useMapStore } from '../../store/useMapStore';
import { FileWarning, ListChecks, Users, Trash2, CheckCircle, XCircle } from 'lucide-react';
import styles from './AdminDashboard.module.css';

type TabKey = 'reports' | 'users';

const AdminDashboard: React.FC = () => {
  const { reports, fetchReports } = useMapStore();
  const [tab, setTab] = useState<TabKey>('reports');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('profiles').select('*');
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  const sorted = useMemo(() => {
    return [...reports].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [reports]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('reports').update({ status }).eq('id', id);
    fetchReports();
  };

  const deleteReport = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    await supabase.from('reports').delete().eq('id', id);
    fetchReports();
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className={styles.adminDash}>
      <h2>Admin Dashboard</h2>
      <p>Manage reports, verify cleanups, and moderate users.</p>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'reports' ? styles.tabActive : ''}`}
          onClick={() => setTab('reports')}
        >
          <ListChecks size={16} /> Reports ({reports.length})
        </button>
        <button
          className={`${styles.tab} ${tab === 'users' ? styles.tabActive : ''}`}
          onClick={() => setTab('users')}
        >
          <Users size={16} /> Users ({users.length})
        </button>
      </div>

      {tab === 'reports' && (
        <div className={styles.reportList}>
          {sorted.length === 0 ? (
            <div className={styles.empty}>
              <FileWarning size={48} />
              <p>No reports to moderate.</p>
            </div>
          ) : (
            sorted.map((r) => (
              <div key={r.id} className={styles.reportRow}>
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
                <span className={`${styles.badge} ${styles[r.status as keyof typeof styles] || ''}`}>
                  {r.status.replace('_', ' ')}
                </span>
                <div className={styles.actions}>
                  {r.status === 'cleaned' && (
                    <button className={`${styles.actionBtn} ${styles.verifyBtn}`} onClick={() => updateStatus(r.id, 'verified')}>
                      <CheckCircle size={14} /> Verify
                    </button>
                  )}
                  {r.status === 'pending' && (
                    <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => updateStatus(r.id, 'rejected')}>
                      <XCircle size={14} /> Reject
                    </button>
                  )}
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => deleteReport(r.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className={styles.reportList}>
          {users.length === 0 ? (
            <div className={styles.empty}>
              <Users size={48} />
              <p>No registered users yet.</p>
            </div>
          ) : (
            users.map((u) => (
              <div key={u.id} className={styles.reportRow}>
                <div className={styles.reportInfo}>
                  <div className={styles.reportTitle}>{u.full_name || 'Anonymous'}</div>
                  <div className={styles.reportMeta}>
                    <span>ID: {u.id.slice(0, 8)}…</span>
                    <span>•</span>
                    <span>Points: {u.points ?? 0}</span>
                  </div>
                </div>
                <span className={`${styles.badge} ${styles.verified}`}>
                  {u.role}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
