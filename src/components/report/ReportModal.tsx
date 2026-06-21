import React, { useState } from 'react';
import { X, Upload, MapPin } from 'lucide-react';
import styles from './ReportModal.module.css';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultPosition?: [number, number];
}

const WasteCategories = [
  'Overflowing bins',
  'Illegal dumping',
  'Litter spots',
  'Recycle centers',
  'Collection points',
  'Hazardous waste',
];

const Severities = ['Low', 'Medium', 'High', 'Critical'];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, defaultPosition }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'Medium',
    address: '',
    images: [] as File[],
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, location: defaultPosition });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={`glass-panel ${styles.modal}`}>
        <div className={styles.header}>
          <h2>Report Waste</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {step === 1 && (
            <div className={styles.step}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="e.g. Broken trash bin spilling over" 
                  value={formData.title} 
                  onChange={handleChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <select name="category" required value={formData.category} onChange={handleChange}>
                  <option value="" disabled>Select a category</option>
                  {WasteCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Severity</label>
                <select name="severity" required value={formData.severity} onChange={handleChange}>
                  {Severities.map(sev => <option key={sev} value={sev}>{sev}</option>)}
                </select>
              </div>
              <button type="button" className={styles.nextBtn} onClick={() => setStep(2)}>Next</button>
            </div>
          )}

          {step === 2 && (
            <div className={styles.step}>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  name="description" 
                  rows={3} 
                  placeholder="Provide more details..." 
                  value={formData.description} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Location / Landmark</label>
                <input 
                  type="text" 
                  name="address" 
                  placeholder="e.g. Near Central Park entrance" 
                  value={formData.address} 
                  onChange={handleChange} 
                />
                <div className={styles.locationInfo} style={{ marginTop: '0.5rem' }}>
                  <MapPin size={16} /> 
                  <span>{defaultPosition ? `${defaultPosition[0].toFixed(4)}, ${defaultPosition[1].toFixed(4)}` : 'Detecting...'}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Upload Photo</label>
                <div className={styles.uploadArea}>
                  <Upload size={24} color="var(--text-secondary)" />
                  <p>Click to upload or drag & drop</p>
                  {/* Mock file input */}
                  <input type="file" multiple accept="image/*" style={{ display: 'none' }} />
                </div>
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>Back</button>
                <button type="submit" className={styles.submitBtn}>Submit Report</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
