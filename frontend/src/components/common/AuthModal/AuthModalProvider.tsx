import { useAuthModal } from "../../../store/useAuthModal";
import LoginModal from "../../routes/LandingPage/LoginModal";
import RegisterModal from "../../routes/LandingPage/RegisterModal";

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
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onOpenRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        onOpenLogin={switchToLogin}
      />
    </>
  );
}

