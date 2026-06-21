import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import styles from './WasteMap.module.css';
import { useAuthStore } from '../../store/useAuthStore';
import { Plus } from 'lucide-react';
import ReportModal from '../report/ReportModal';
import MapSidebar from './MapSidebar';
import { supabase } from '../../services/supabase';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import { useMapStore } from '../../store/useMapStore';

const WasteMap: React.FC = () => {
  const { user, profile } = useAuthStore();
  const { reports, activeFilters, fetchReports, subscribeRealtime } = useMapStore();
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch existing reports on mount
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Setup Realtime Subscription
  useEffect(() => {
    const unsub = subscribeRealtime();
    return unsub;
  }, [subscribeRealtime]);

  // Try to get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.warn('Geolocation blocked or failed:', err.message)
      );
    }
  }, []);

  const handleReportSubmit = async (data: any) => {
    if (!user) {
      alert("Please login first to report waste");
      return;
    }
    
    const { error } = await supabase.from('reports').insert([{
      reporter_id: user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      severity: data.severity.toLowerCase(),
      address: data.address,
      lat: position[0] + (Math.random() - 0.5) * 0.005,
      lng: position[1] + (Math.random() - 0.5) * 0.005,
      status: 'pending'
    }]);

    if (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report: ' + error.message + '\n\n(Did you forget to run the SQL schema in the new project? Or did you sign up before running the schema?)');
    }
  };

  // Filter reports based on sidebar toggles
  const visibleReports = reports.filter(r => activeFilters[r.category as keyof typeof activeFilters] !== false);

  return (
    <div className={styles.mapContainer}>
      <MapContainer center={position} zoom={13} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render mock reports */}
        {visibleReports.map(report => (
          <Marker key={report.id} position={[report.lat, report.lng]}>
            <Popup>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minWidth: '180px' }}>
                <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>{report.title}</strong>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 600, padding: '1px 8px',
                    borderRadius: '999px', textTransform: 'uppercase',
                    background: report.severity === 'critical' || report.severity === 'high' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                    color: report.severity === 'critical' || report.severity === 'high' ? '#dc2626' : '#d97706',
                  }}>{report.severity}</span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 600, padding: '1px 8px',
                    borderRadius: '999px', textTransform: 'capitalize',
                    background: report.status === 'cleaned' || report.status === 'verified' ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.1)',
                    color: report.status === 'cleaned' || report.status === 'verified' ? '#059669' : '#64748b',
                  }}>{report.status}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {report.category} • {new Date(report.created_at).toLocaleDateString()}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Recenter Map Component */}
        <RecenterMap position={position} />
      </MapContainer>
      
      {/* Floating Action Button for reporting - always visible */}
      <button className={styles.fabBtn} onClick={() => {
        if (!user) {
          alert("Please login first to report waste!");
        } else {
          setIsModalOpen(true);
        }
      }}>
        <Plus size={24} />
        <span>Report Waste</span>
      </button>

      <ReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleReportSubmit}
        defaultPosition={position}
      />
    </div>
  );
};

// Component to recenter map when position changes
const RecenterMap: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
};

export default WasteMap;
