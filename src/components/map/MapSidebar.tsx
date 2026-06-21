import React from 'react';
import styles from './MapSidebar.module.css';
import { useMapStore, getCategoryCounts } from '../../store/useMapStore';

const MapSidebar: React.FC = () => {
  const { reports, activeFilters, toggleFilter } = useMapStore();
  const counts = getCategoryCounts(reports);

  const totalReports = reports.length;
  const criticalHotspots = reports.filter(r => r.severity === 'critical' || r.severity === 'high').length;
  const resolvedToday = reports.filter(r => {
    if (r.status !== 'cleaned' && r.status !== 'verified') return false;
    const today = new Date().toISOString().slice(0, 10);
    return r.created_at?.slice(0, 10) === today;
  }).length;
  const recycleCenters = reports.filter(r => r.category === 'Recycle centers').length;

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>{criticalHotspots}</h3>
          <p>Critical hotspots</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.textGreen}>{resolvedToday}</h3>
          <p>Resolved today</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.textBlue}>{recycleCenters}</h3>
          <p>Recycle centers</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.textOrange}>{totalReports}</h3>
          <p>Total reports</p>
        </div>
      </div>

      <div className={styles.divider}>
        <span>WASTE STREAMS</span>
      </div>

      <div className={styles.togglesList}>
        <ToggleItem 
          label="Overflowing bins" 
          count={counts['Overflowing bins']} 
          color="#ef4444" 
          checked={activeFilters['Overflowing bins']} 
          onChange={() => toggleFilter('Overflowing bins')} 
        />
        <ToggleItem 
          label="Illegal dumping" 
          count={counts['Illegal dumping']} 
          color="#ef4444" 
          checked={activeFilters['Illegal dumping']} 
          onChange={() => toggleFilter('Illegal dumping')} 
        />
        <ToggleItem 
          label="Litter spots" 
          count={counts['Litter spots']} 
          color="#d97706" 
          checked={activeFilters['Litter spots']} 
          onChange={() => toggleFilter('Litter spots')} 
        />
        <ToggleItem 
          label="Recycle centers" 
          count={counts['Recycle centers']} 
          color="#10b981" 
          checked={activeFilters['Recycle centers']} 
          onChange={() => toggleFilter('Recycle centers')} 
        />
        <ToggleItem 
          label="Collection points" 
          count={counts['Collection points']} 
          color="#3b82f6" 
          checked={activeFilters['Collection points']} 
          onChange={() => toggleFilter('Collection points')} 
        />
        <ToggleItem 
          label="Hazardous waste" 
          count={counts['Hazardous waste']} 
          color="#d97706" 
          checked={activeFilters['Hazardous waste']} 
          onChange={() => toggleFilter('Hazardous waste')} 
        />
      </div>
    </div>
  );
};

const ToggleItem = ({ label, count, color, checked, onChange }: any) => (
  <div className={styles.toggleItem}>
    <div className={styles.toggleLeft}>
      <span className={styles.dot} style={{ backgroundColor: color }}></span>
      <span className={styles.label}>{label}</span>
    </div>
    <div className={styles.toggleRight}>
      <span className={styles.count}>{count}</span>
      <label className={styles.switch}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className={styles.slider}></span>
      </label>
    </div>
  </div>
);

export default MapSidebar;
