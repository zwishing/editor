import { create } from "zustand";

interface ActiveColorState {
  activeId: string | null;
  activeColor: string | null;
  setActiveColor: (id: string, color: string) => void;
  updateColor: (color: string) => void;
  clearActiveColor: () => void;
}

export const useActiveColorStore = create<ActiveColorState>((set) => ({
  activeId: null,
  activeColor: null,
  setActiveColor: (id, color) => set({ activeId: id, activeColor: color }),
  updateColor: (color) => set({ activeColor: color }),
  clearActiveColor: () => set({ activeId: null, activeColor: null }),
}));
