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

interface LeaderResult {
    id: number;
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    city: string;
    district: string;
    facebookLink: string;
    gameCharacterName: string | null;
    gameUID: string | null;
    communityGroups: string | null;
    isGuildMaster: boolean;
    guildName: string | null;
    managementExperience: string | null;
    eventExperience: string | null;
    avatar: string | null;
    status: number;
    totalPoint: number | null;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
}

interface LeaderDetailModalProps {
    visible: boolean;
    leader: LeaderResult | null;
    onClose: () => void;
}

export default function LeaderDetailModal({ visible, leader, onClose }: LeaderDetailModalProps) {
    if (!leader) return null;

    const getStatusText = (status: number) => {
        switch (status) {
            case -1:
                return "Đã từ chối";
            case 0:
                return "Mới";
            case 1:
                return "Đã duyệt";
            default:
                return "Không xác định";
        }
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case -1:
                return "red";
            case 0:
                return "orange";
            case 1:
                return "green";
            default:
                return "default";
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = parseISO(dateString);
            return format(date, 'dd/MM/yyyy');
        } catch {
            return dateString;
        }
    };

    return (
        <Modal
            title="Chi tiết thủ lĩnh"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label="ID">
                    {leader.id}
                </Descriptions.Item>
                <Descriptions.Item label="ID Người dùng">
                    {leader.userId}
                </Descriptions.Item>
                <Descriptions.Item label="Họ và tên">
                    {leader.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {leader.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {leader.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày/tháng/năm sinh">
                    {formatDate(leader.dateOfBirth)}
                </Descriptions.Item>
                <Descriptions.Item label="Tỉnh/Thành phố">
                    {leader.city}
                </Descriptions.Item>
                <Descriptions.Item label="Phường/Xã">
                    {leader.district}
                </Descriptions.Item>
                <Descriptions.Item label="Link Facebook">
                    <a href={leader.facebookLink} target="_blank" rel="noopener noreferrer">
                        {leader.facebookLink}
                    </a>
                </Descriptions.Item>
                <Descriptions.Item label="Tên nhân vật">
                    {leader.gameCharacterName || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="UID Game">
                    {leader.gameUID || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Là bang chủ">
                    {leader.isGuildMaster ? "Có" : "Không"}
                </Descriptions.Item>
                <Descriptions.Item label="Tên bang hội">
                    {leader.guildName || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Nhóm cộng đồng">
                    {leader.communityGroups || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Kinh nghiệm quản lý">
                    {leader.managementExperience || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Kinh nghiệm sự kiện">
                    {leader.eventExperience || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Ảnh đại diện">
                    {leader.avatar ? (
                        <Image
                            src={`${domain}${leader.avatar}`}
                            alt="Ảnh đại diện thủ lĩnh"
                            width={100}
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        "-"
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(leader.status)}>
                        {getStatusText(leader.status)}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng điểm">
                    {leader.totalPoint ?? 0}
                </Descriptions.Item>
                {leader.status === -1 && leader.rejectionReason && (
                    <Descriptions.Item label="Lý do từ chối" span={2}>
                        {leader.rejectionReason}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="Ngày tạo">
                    {formatDate(leader.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                    {formatDate(leader.updatedAt)}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}

