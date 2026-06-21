import { create } from 'zustand';
import { supabase } from '../services/supabase';

export type WasteCategory = 'Overflowing bins' | 'Illegal dumping' | 'Litter spots' | 'Recycle centers' | 'Collection points' | 'Hazardous waste';

export interface Report {
  id: string;
  reporter_id: string;
  title: string;
  description?: string;
  category: string;
  severity: string;
  lat: number;
  lng: number;
  status: string;
  created_at: string;
}

interface MapState {
  reports: Report[];
  activeFilters: Record<WasteCategory, boolean>;
  toggleFilter: (category: WasteCategory) => void;
  fetchReports: () => Promise<void>;
  subscribeRealtime: () => () => void;
}

const ALL_CATEGORIES: WasteCategory[] = [
  'Overflowing bins',
  'Illegal dumping',
  'Litter spots',
  'Recycle centers',
  'Collection points',
  'Hazardous waste',
];

const initialFilters: Record<WasteCategory, boolean> = {
  'Overflowing bins': true,
  'Illegal dumping': true,
  'Litter spots': true,
  'Recycle centers': true,
  'Collection points': true,
  'Hazardous waste': true,
};

export const useMapStore = create<MapState>((set, get) => ({
  reports: [],
  activeFilters: initialFilters,

  toggleFilter: (category) =>
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        [category]: !state.activeFilters[category],
      },
    })),

  fetchReports: async () => {
    const { data } = await supabase.from('reports').select('*');
    if (data) set({ reports: data });
  },

  subscribeRealtime: () => {
    const channel = supabase
      .channel('public:reports')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, (payload) => {
        const state = get();
        if (payload.eventType === 'INSERT') {
          set({ reports: [...state.reports, payload.new as Report] });
        } else if (payload.eventType === 'UPDATE') {
          set({ reports: state.reports.map((r) => (r.id === (payload.new as Report).id ? (payload.new as Report) : r)) });
        } else if (payload.eventType === 'DELETE') {
          set({ reports: state.reports.filter((r) => r.id !== (payload.old as any).id) });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));

// Derived helper – counts per category
export function getCategoryCounts(reports: Report[]): Record<WasteCategory, number> {
  const counts: Record<string, number> = {};
  for (const cat of ALL_CATEGORIES) counts[cat] = 0;
  for (const r of reports) {
    if (r.category in counts) counts[r.category]++;
  }
  return counts as Record<WasteCategory, number>;
}
