import { ReactNode } from "react";
import { create } from "zustand";

interface NotificationConfig {
  title?: string;
  message: string | ReactNode;
  confirmText?: string;
  width?: number;
}

interface NotificationState {
  isOpen: boolean;
  config: NotificationConfig | null;
  show: (config: NotificationConfig) => void;
  hide: () => void;
}

export const useNotification = create<NotificationState>((set) => ({
  isOpen: false,
  config: null,
  show: (config: NotificationConfig) => {
    set({ isOpen: true, config });
  },
  hide: () => {
    set({ isOpen: false, config: null });
  },
}));

// Convenience function for easy imports
export const notification = {
  show: (config: NotificationConfig) => useNotification.getState().show(config),
  hide: () => useNotification.getState().hide(),
};

