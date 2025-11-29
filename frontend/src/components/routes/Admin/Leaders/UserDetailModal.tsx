// libraries
import {
    Modal,
    Descriptions,
    Image,
    Tag,
} from "antd";
import { format, parseISO } from "date-fns";

const domain = import.meta.env.DEV
    ? import.meta.env.VITE_DEV_DOMAIN! || ""
    : import.meta.env.VITE_PRO_DOMAIN! || "";

interface UserResult {
    id: number;
    fullname: string;
    username: string;
    email: string | null;
    profilePhoto: string | null;
    role: number;
    source: number;
    sourceId: string | null;
    roleId: string | null;
    uid: string | null;
    socialUrl: string | null;
    createdAt: string;
    updatedAt: string;
    termsAgreedAt: string | null;
}

interface UserDetailModalProps {
    visible: boolean;
    user: UserResult | null;
    onClose: () => void;
}

export default function UserDetailModal({ visible, user, onClose }: UserDetailModalProps) {
    if (!user) return null;

    const getRoleText = (role: number) => {
        switch (role) {
            case 1:
                return "NGƯỜI DÙNG";
            case 2:
                return "QUẢN TRỊ VIÊN";
            default:
                return "Không xác định";
        }
    };

    const getRoleColor = (role: number) => {
        switch (role) {
            case 1:
                return "blue";
            case 2:
                return "red";
            default:
                return "default";
        }
    };

    const getSourceText = (source: number) => {
        switch (source) {
            case 1:
                return "CỤC BỘ";
            case 2:
                return "GOOGLE";
            case 3:
                return "FACEBOOK";
            case 4:
                return "TIKTOK";
            default:
                return "Không xác định";
        }
    };

    const getSourceColor = (source: number) => {
        switch (source) {
            case 1:
                return "default";
            case 2:
                return "orange";
            case 3:
                return "blue";
            case 4:
                return "purple";
            default:
                return "default";
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = parseISO(dateString);
            return format(date, 'dd/MM/yyyy HH:mm:ss');
        } catch {
            return dateString;
        }
    };

    return (
        <Modal
            title="Chi tiết User"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label="ID">
                    {user.id}
                </Descriptions.Item>
                <Descriptions.Item label="Username">
                    {user.username}
                </Descriptions.Item>
                <Descriptions.Item label="Họ tên">
                    {user.fullname}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {user.email || "-"}
                </Descriptions.Item>
                {user.uid && (
                    <Descriptions.Item label="Tên nhân vật trong game">
                        {user.uid}
                    </Descriptions.Item>
                )}
                {user.socialUrl && (
                    <Descriptions.Item label="Mạng xã hội">
                        <a href={user.socialUrl} target="_blank" rel="noopener noreferrer">
                            {user.socialUrl}
                        </a>
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="Role ID">
                    {user.roleId ?? "-"}
                </Descriptions.Item>
                {user.termsAgreedAt && (
                    <Descriptions.Item label="Đồng ý điều khoản lúc">
                        {formatDate(user.termsAgreedAt)}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="Tạo lúc">
                    {formatDate(user.createdAt)}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}

