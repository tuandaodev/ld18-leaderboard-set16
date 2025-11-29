import { ReactNode } from "react";
import { StyledModal } from "./BaseModal.styles";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  width?: number | { xs?: string | number; sm?: string | number; md?: string | number; lg?: string | number; xl?: string | number; xxl?: string | number; };
  centered?: boolean;
  destroyOnHidden?: boolean;
  size?: 'small' | 'large';
  rootClassName?: string;
}

export default function BaseModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = 550,
  centered = true,
  destroyOnHidden = true,
  size = 'small',
  rootClassName
}: BaseModalProps) {
  return (
    <StyledModal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={width}
      centered={centered}
      title={title}
      destroyOnHidden={destroyOnHidden}
      $size={size}
      rootClassName={rootClassName}
    >
      {children}
    </StyledModal>
  );
}

