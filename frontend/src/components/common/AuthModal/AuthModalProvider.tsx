import { useAuthModal } from "../../../store/useAuthModal";

export default function AuthModalProvider() {
  const {
    isLoginModalOpen,
    isRegisterModalOpen,
    closeLoginModal,
    closeRegisterModal,
    switchToRegister,
    switchToLogin,
  } = useAuthModal();

  return (
    <>
    </>
  );
}

