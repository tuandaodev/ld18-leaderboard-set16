import { create } from "zustand";

type RouteTracker = {
  clickedMainRouteOrder: number;
  isCreateAdminClicked: boolean;
};

interface useRoute {
  data: RouteTracker;
  updateClickedMainRouteOrder: (newOrder: number) => void;
  saveIsCreateAdminClicked: (toggle: boolean) => void;
}

const INIT_DATA = {
  clickedMainRouteOrder: -1,
  isCreateAdminClicked: false,
};

export const useRoute = create<useRoute>((set) => ({
  data: INIT_DATA,
  updateClickedMainRouteOrder: (newOrder: number) => {
    return set((state) => ({
      data: { ...state.data, clickedMainRouteOrder: newOrder },
    }));
  },
  saveIsCreateAdminClicked: (toggle: boolean) => {
    return set((state) => ({
      data: { ...state.data, isCreateAdminClicked: toggle },
    }));
  },
}));
