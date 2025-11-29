import { useNotification } from "../../../store/useNotification";
import NotificationModal from "./index";

export default function NotificationProvider() {
  const { isOpen, config, hide } = useNotification();

  if (!config) return null;

  return (
    <NotificationModal
      isOpen={isOpen}
      onClose={hide}
      title={config.title || "THÔNG BÁO"}
      message={config.message}
      confirmText={config.confirmText}
      width={config.width}
    />
  );
}

