import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../services/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { MapPin, CheckCircle, Clock, AlertTriangle, Inbox, ClipboardList } from 'lucide-react';
import styles from './CleanerDashboard.module.css';

const CleanerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchTasks = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('reports')
      .select('*')
      .in('status', ['pending', 'assigned'])
      .order('created_at', { ascending: false });
    if (data) setTasks(data);
  };

  useEffect(() => {
    fetchTasks();

    const subscription = supabase
      .channel('cleaner_tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const handleMarkCleaned = async (reportId: string) => {
    const { error } = await supabase
      .from('reports')
      .update({ status: 'cleaned', cleaner_id: user?.id })
      .eq('id', reportId);
    if (error) alert('Error updating status: ' + error.message);
    else fetchTasks();
  };

  const pendingCount = useMemo(() => tasks.filter(t => t.status === 'pending').length, [tasks]);
  const assignedCount = useMemo(() => tasks.filter(t => t.status === 'assigned').length, [tasks]);
  const criticalCount = useMemo(() => tasks.filter(t => t.severity === 'high' || t.severity === 'critical').length, [tasks]);

  const severityClass = (severity: string) => {
    const map: Record<string, string> = {
      low: styles.severityLow,
      medium: styles.severityMedium,
      high: styles.severityHigh,
      critical: styles.severityCritical,
    };
    return map[severity] || '';
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h2>Cleaner Workspace</h2>
        <p>Active and pending cleanup requests in your area.</p>
      </header>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.miniStat}>
          <div className={`${styles.miniStatIcon} ${styles.amber}`}>
            <Clock size={20} />
          </div>
          <div>
            <div className={styles.miniStatValue}>{pendingCount}</div>
            <div className={styles.miniStatLabel}>Pending</div>
          </div>
        </div>
        <div className={styles.miniStat}>
          <div className={`${styles.miniStatIcon} ${styles.blue}`}>
            <ClipboardList size={20} />
          </div>
          <div>
            <div className={styles.miniStatValue}>{assignedCount}</div>
            <div className={styles.miniStatLabel}>Assigned</div>
          </div>
        </div>
        <div className={styles.miniStat}>
          <div className={`${styles.miniStatIcon} ${styles.green}`}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className={styles.miniStatValue}>{criticalCount}</div>
            <div className={styles.miniStatLabel}>Critical/High</div>
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div className={styles.taskList}>
        {tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <Inbox size={48} />
            <p>No pending tasks! Great job keeping the area clean. 🎉</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`${styles.taskCard} ${severityClass(task.severity)}`}>
              <div className={styles.taskHeader}>
                <h3>{task.title}</h3>
                <span className={`${styles.badge} ${styles[task.severity] || ''}`}>
                  {task.severity.toUpperCase()}
                </span>
              </div>
              
              <div className={styles.taskBody}>
                <p>{task.description || 'No description provided.'}</p>
                <div className={styles.meta}>
                  <span><MapPin size={14} /> {task.lat.toFixed(4)}, {task.lng.toFixed(4)}</span>
                  <span><Clock size={14} /> {new Date(task.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className={styles.taskFooter}>
                <div className={styles.status}>
                  Status: <strong>{task.status}</strong>
                </div>
                <button 
                  className={styles.completeBtn}
                  onClick={() => handleMarkCleaned(task.id)}
                >
                  <CheckCircle size={16} />
                  Mark as Cleaned
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CleanerDashboard;
