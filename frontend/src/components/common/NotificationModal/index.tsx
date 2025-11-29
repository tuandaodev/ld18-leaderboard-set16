import { ReactNode } from "react";
import BaseModal from "../BaseModal";
import PopupTitle from "../../routes/LandingPage/PopupTitle";
import PrimaryPopupButton from "../../routes/LandingPage/PrimaryPopupButton";
import { NotificationContent, NotificationMessage } from "./NotificationModal.styles";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  width?: number;
}

export default function NotificationModal({ 
  isOpen, 
  onClose, 
  title = "THÔNG BÁO",
  message,
  confirmText,
  width = 600
}: NotificationModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      width={width}
      title={<PopupTitle>{title}</PopupTitle>}
    >
      <NotificationContent>
        <NotificationMessage>
          {message}
        </NotificationMessage>
        {confirmText && (
          <PrimaryPopupButton onClick={onClose}>
            {confirmText}
          </PrimaryPopupButton>
        )}
      </NotificationContent>
    </BaseModal>
  );
}

