// libraries
import {
    Modal,
    Descriptions,
    Image,
    Tag,
} from "antd";
import { format, parseISO } from "date-fns";

// types
import { t } from "i18next";
import DOMPurify from "dompurify";

const domain = import.meta.env.DEV
    ? import.meta.env.VITE_DEV_DOMAIN! || ""
    : import.meta.env.VITE_PRO_DOMAIN! || "";

interface CommunityEventResult {
    id: number;
    userId: number;
    eventName: string;
    city: string;
    district: string;
    registrationDeadline: string;
    eventStartTime: string;
    eventEndTime: string;
    venueAddress: string;
    venueName: string;
    eventType: string;
    deviceType: string;
    eventDescription: string;
    eventScale: string;
    supportLevel: string;
    bannerFile: string;
    status: number;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
}

interface EventDetailModalProps {
    visible: boolean;
    event: CommunityEventResult | null;
    onClose: () => void;
}

export default function EventDetailModal({ visible, event, onClose }: EventDetailModalProps) {
    if (!event) return null;

    const sanitizedDescription = DOMPurify.sanitize(event.eventDescription || "");

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
            return format(date, 'dd/MM/yyyy HH:mm');
        } catch {
            return dateString;
        }
    };

    return (
        <Modal
            title={t("Chi tiết sự kiện")}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label={t("ID")}>
                    {event.id}
                </Descriptions.Item>
                {/* <Descriptions.Item label={t("User ID")}>
                    {event.userId}
                </Descriptions.Item> */}
                <Descriptions.Item label={t("Tên sự kiện")} span={2}>
                    {event.eventName}
                </Descriptions.Item>
                <Descriptions.Item label={t("Tỉnh/TP")}>
                    {event.city}
                </Descriptions.Item>
                <Descriptions.Item label={t("Phường/Xã")}>
                    {event.district}
                </Descriptions.Item>
                <Descriptions.Item label={t("Tên địa điểm")}>
                    {event.venueName}
                </Descriptions.Item>
                <Descriptions.Item label={t("Địa chỉ")}>
                    {event.venueAddress}
                </Descriptions.Item>
                <Descriptions.Item label={t("Loại sự kiện")}>
                    {event.eventType}
                </Descriptions.Item>
                <Descriptions.Item label={t("Loại thiết bị")}>
                    {event.deviceType || "-"}
                </Descriptions.Item>
                <Descriptions.Item label={t("Quy mô")}>
                    {event.eventScale}
                </Descriptions.Item>
                <Descriptions.Item label={t("Mức hỗ trợ")}>
                    {event.supportLevel}
                </Descriptions.Item>
                <Descriptions.Item label={t("Hạn đăng ký")}>
                    {formatDate(event.registrationDeadline)}
                </Descriptions.Item>
                <Descriptions.Item label={t("Thời gian bắt đầu")}>
                    {formatDate(event.eventStartTime)}
                </Descriptions.Item>
                <Descriptions.Item label={t("Thời gian kết thúc")}>
                    {formatDate(event.eventEndTime)}
                </Descriptions.Item>
                <Descriptions.Item label={t("Banner")}>
                    {event.bannerFile ? (
                        <Image
                            src={`${domain}${event.bannerFile}`}
                            alt="Event Banner"
                            width={200}
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        "-"
                    )}
                </Descriptions.Item>
                <Descriptions.Item label={t("Trạng thái")}>
                    <Tag color={getStatusColor(event.status)}>
                        {getStatusText(event.status)}
                    </Tag>
                </Descriptions.Item>
                {event.status === -1 && event.rejectionReason ? (
                    <Descriptions.Item label={t("Lý do từ chối")}>
                        {event.rejectionReason}
                    </Descriptions.Item>
                ) : <Descriptions.Item> </Descriptions.Item>}
                <Descriptions.Item label={t("Ngày tạo")}>
                    {formatDate(event.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label={t("Ngày cập nhật")}>
                    {formatDate(event.updatedAt)}
                </Descriptions.Item>
                <Descriptions.Item label={t("Mô tả")} span={2}>
                    <div 
                        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                        style={{
                            wordWrap: 'break-word',
                            maxWidth: '100%',
                            whiteSpace: 'pre-wrap',
                        }}
                    />
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}

