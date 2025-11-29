import { create } from "zustand";

interface AuthModalState {
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  switchToRegister: () => void;
  switchToLogin: () => void;
}

export const useAuthModal = create<AuthModalState>((set) => ({
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  openLoginModal: () => {
    set({ 
      isLoginModalOpen: true, 
      isRegisterModalOpen: false
    });
  },
  closeLoginModal: () => {
    set({ 
      isLoginModalOpen: false
    });
  },
  openRegisterModal: () => {
    set({ 
      isRegisterModalOpen: true, 
      isLoginModalOpen: false 
    });
  },
  closeRegisterModal: () => {
    set({ isRegisterModalOpen: false });
  },
  switchToRegister: () => {
    set({ 
      isRegisterModalOpen: true, 
      isLoginModalOpen: false 
    });
  },
  switchToLogin: () => {
    set({ 
      isLoginModalOpen: true, 
      isRegisterModalOpen: false 
    });
  },
}));

// Convenience functions for easy imports
export const authModal = {
  openLogin: () => useAuthModal.getState().openLoginModal(),
  closeLogin: () => useAuthModal.getState().closeLoginModal(),
  openRegister: () => useAuthModal.getState().openRegisterModal(),
  closeRegister: () => useAuthModal.getState().closeRegisterModal(),
  switchToRegister: () => useAuthModal.getState().switchToRegister(),
  switchToLogin: () => useAuthModal.getState().switchToLogin(),
};

