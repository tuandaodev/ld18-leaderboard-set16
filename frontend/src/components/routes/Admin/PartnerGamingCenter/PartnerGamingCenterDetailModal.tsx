// libraries
import {
    Modal,
    Descriptions,
    Image,
    Tag,
} from "antd";
import { format, parseISO } from "date-fns";

// types

const domain = import.meta.env.DEV
    ? import.meta.env.VITE_DEV_DOMAIN! || ""
    : import.meta.env.VITE_PRO_DOMAIN! || "";

interface PartnerGamingCenterResult {
    id: number;
    userId: number;
    gamingCenterName: string;
    gamingCenterAddress: string;
    managerName: string;
    openingHour: string;
    closingHour: string;
    machineConfiguration: string | null;
    city: string;
    district: string;
    fanpage: string | null;
    contactPhone: string;
    email: string;
    gamingCenterScale: string;
    averagePlayPrice: string | null;
    logoFile: string;
    status: number;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
}

interface PartnerGamingCenterDetailModalProps {
    visible: boolean;
    gamingCenter: PartnerGamingCenterResult | null;
    onClose: () => void;
}

export default function PartnerGamingCenterDetailModal({ visible, gamingCenter, onClose }: PartnerGamingCenterDetailModalProps) {
    if (!gamingCenter) return null;

    const getStatusText = (status: number) => {
        switch (status) {
            case -1:
                return "Từ chối";
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
            title="Chi tiết Phòng máy Đối tác"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Mã số">
                    {gamingCenter.id}
                </Descriptions.Item>
                <Descriptions.Item label="Mã người dùng">
                    {gamingCenter.userId}
                </Descriptions.Item>
                <Descriptions.Item label="Tên phòng máy">
                    {gamingCenter.gamingCenterName}
                </Descriptions.Item>
                <Descriptions.Item label="Họ và tên Quản lý">
                    {gamingCenter.managerName}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ phòng máy" span={2}>
                    {gamingCenter.gamingCenterAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Tỉnh/Thành phố">
                    {gamingCenter.city}
                </Descriptions.Item>
                <Descriptions.Item label="Phường/Xã">
                    {gamingCenter.district}
                </Descriptions.Item>
                <Descriptions.Item label="Giờ mở cửa">
                    {gamingCenter.openingHour}
                </Descriptions.Item>
                <Descriptions.Item label="Giờ đóng cửa">
                    {gamingCenter.closingHour}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại liên hệ">
                    {gamingCenter.contactPhone}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {gamingCenter.email}
                </Descriptions.Item>
                <Descriptions.Item label="Quy mô phòng máy (số lượng máy)">
                    {gamingCenter.gamingCenterScale}
                </Descriptions.Item>
                <Descriptions.Item label="Giá chơi trung bình (VNĐ/giờ)">
                    {gamingCenter.averagePlayPrice || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng Quan Cấu hình máy" span={2}>
                    {gamingCenter.machineConfiguration || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Fanpage (nếu có)" span={2}>
                    {gamingCenter.fanpage ? (
                        <a href={gamingCenter.fanpage} target="_blank" rel="noopener noreferrer">
                            {gamingCenter.fanpage}
                        </a>
                    ) : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Logo">
                    {gamingCenter.logoFile ? (
                        <Image
                            src={`${domain}${gamingCenter.logoFile}`}
                            alt="Gaming Center Logo"
                            width={100}
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        "-"
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(gamingCenter.status)}>
                        {getStatusText(gamingCenter.status)}
                    </Tag>
                </Descriptions.Item>
                {gamingCenter.status === -1 && gamingCenter.rejectionReason && (
                    <Descriptions.Item label="Lý do từ chối" span={2}>
                        {gamingCenter.rejectionReason}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="Ngày tạo">
                    {formatDate(gamingCenter.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                    {formatDate(gamingCenter.updatedAt)}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}

