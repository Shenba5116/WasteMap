import React, { useEffect, useMemo } from 'react';
import { useMapStore, getCategoryCounts } from '../store/useMapStore';
import { FileWarning, CheckCircle, Clock, BarChart3, AlertTriangle } from 'lucide-react';
import styles from './AnalyticsPage.module.css';

const CATEGORY_COLORS: Record<string, string> = {
  'Overflowing bins': '#ef4444',
  'Illegal dumping': '#dc2626',
  'Litter spots': '#d97706',
  'Recycle centers': '#10b981',
  'Collection points': '#3b82f6',
  'Hazardous waste': '#f59e0b',
};

const SEVERITY_COLORS: Record<string, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#dc2626',
};

const AnalyticsPage: React.FC = () => {
  const { reports, fetchReports } = useMapStore();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const categoryCounts = useMemo(() => getCategoryCounts(reports), [reports]);

  const totalReports = reports.length;
  const cleanedCount = reports.filter(r => r.status === 'cleaned' || r.status === 'verified').length;
  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const criticalCount = reports.filter(r => r.severity === 'high' || r.severity === 'critical').length;

  // Severity breakdown
  const severityCounts = useMemo(() => {
    const s: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    for (const r of reports) {
      if (r.severity in s) s[r.severity]++;
    }
    return s;
  }, [reports]);

  const maxSeverity = Math.max(...Object.values(severityCounts), 1);

  // Donut chart conic-gradient
  const donutGradient = useMemo(() => {
    const entries = Object.entries(categoryCounts).filter(([, v]) => v > 0);
    if (entries.length === 0) return 'conic-gradient(var(--surface-hover) 0deg 360deg)';
    let angle = 0;
    const stops: string[] = [];
    for (const [cat, count] of entries) {
      const slice = (count / totalReports) * 360;
      stops.push(`${CATEGORY_COLORS[cat] || '#94a3b8'} ${angle}deg ${angle + slice}deg`);
      angle += slice;
    }
    return `conic-gradient(${stops.join(', ')})`;
  }, [categoryCounts, totalReports]);

  // Recent reports (last 10)
  const recentReports = useMemo(() => {
    return [...reports]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  }, [reports]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const statusClass = (status: string) => {
    if (status === 'in_progress') return styles.inProgress;
    return styles[status as keyof typeof styles] || '';
  };

  return (
    <div className={styles.analyticsPage}>
      <div className={styles.header}>
        <h2>Waste Management Analytics</h2>
        <p>Real-time insights into waste reports and cleanup operations</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}>
            <BarChart3 size={22} />
          </div>
          <span className={styles.statValue}>{totalReports}</span>
          <span className={styles.statLabel}>Total Reports</span>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.red}`}>
            <AlertTriangle size={22} />
          </div>
          <span className={styles.statValue}>{criticalCount}</span>
          <span className={styles.statLabel}>Critical / High</span>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.amber}`}>
            <Clock size={22} />
          </div>
          <span className={styles.statValue}>{pendingCount}</span>
          <span className={styles.statLabel}>Yet to Clean</span>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.blue}`}>
            <CheckCircle size={22} />
          </div>
          <span className={styles.statValue}>{cleanedCount}</span>
          <span className={styles.statLabel}>Cleaned / Resolved</span>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className={styles.chartsGrid}>
        {/* Category Donut */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Reports by Category</h3>
          <div className={styles.donutWrapper}>
            <div className={styles.donut} style={{ background: donutGradient }}>
              <div className={styles.donutCenter}>
                <span className={styles.donutTotal}>{totalReports}</span>
                <span className={styles.donutSubtext}>Reports</span>
              </div>
            </div>
            <div className={styles.donutLegend}>
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: CATEGORY_COLORS[cat] }}></span>
                  <span>{cat}</span>
                  <span className={styles.legendValue}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Severity Bar Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Reports by Severity</h3>
          <div className={styles.barChart}>
            {Object.entries(severityCounts).map(([sev, count]) => (
              <div key={sev} className={styles.barRow}>
                <span className={styles.barLabel}>{sev.charAt(0).toUpperCase() + sev.slice(1)}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${Math.max((count / maxSeverity) * 100, count > 0 ? 12 : 0)}%`,
                      backgroundColor: SEVERITY_COLORS[sev],
                    }}
                  >
                    {count > 0 && count}
                  </div>
                </div>
                <span className={styles.barCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Reports Table ── */}
      <div className={styles.tableCard}>
        <h3 className={styles.chartTitle}>Recent Reports</h3>
        {recentReports.length === 0 ? (
          <div className={styles.emptyState}>
            <FileWarning size={48} />
            <p>No reports submitted yet. Be the first to report waste on the map!</p>
          </div>
        ) : (
          <table className={styles.reportsTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((r) => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.category}</td>
                  <td><span className={`${styles.badge} ${styles[r.severity] || ''}`}>{r.severity}</span></td>
                  <td><span className={`${styles.badge} ${statusClass(r.status)}`}>{r.status.replace('_', ' ')}</span></td>
                  <td>{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
