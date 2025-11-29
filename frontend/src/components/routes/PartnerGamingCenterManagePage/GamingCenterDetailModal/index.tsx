import { LoadingOutlined } from "@ant-design/icons";
import { API_DOMAIN } from "@components/api/AxiosFetcher";
import { ENDPOINTS } from "@components/api/endpoints";
import useAxiosSWR, { fetcher } from "@components/api/useAxiosSWR";
import PrimaryPopupButton from "@components/routes/LandingPage/PrimaryPopupButton";
import uploadSmall from "@images/page/upload_small.png";
import { notification } from "@store/useNotification";
import type { UploadFile } from "antd";
import { Form, Input, Select, TimePicker, Upload, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { ProvinceDistrictResponse } from "types/endpoints/location";
import BaseModal from "../../../common/BaseModal";
import { FormLabel, StyledForm, StyledFormItem } from "../../../common/BaseModal/form.styles";
import PopupTitle from "../../LandingPage/PopupTitle";
import {
    ButtonGroup,
    ErrorMessage,
    FormGrid,
    FormGroup,
    FormRow,
    LeftColumn,
    RightColumn,
    SubmitButtonWrapper,
    SuccessMessage
} from "../../PartnerGamingCenterRegisterPage/RegistrationFormSection/RegistrationFormSection.styles";
import { GamingCenterDetailModalStyles } from "./GamingCenterDetailModal.styles";

interface PartnerGamingCenterFormValues {
    gamingCenterAddress: string;
    gamingCenterName: string;
    managerName: string;
    openingHour: dayjs.Dayjs;
    machineConfiguration: string;
    city: string;
    district: string;
    fanpage: string;
    contactPhone: string;
    email: string;
    closingHour: dayjs.Dayjs;
    gamingCenterScale: string;
    averagePlayPrice: string;
}

interface GamingCenterDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    gamingCenterId: number | null;
    onUpdateSuccess?: () => void;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

interface GamingCenterDetail {
    id: number;
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
}

export default function GamingCenterDetailModal({
    isOpen,
    onClose,
    gamingCenterId,
    onUpdateSuccess
}: GamingCenterDetailModalProps) {
    const [form] = Form.useForm<PartnerGamingCenterFormValues>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [selectedProvince, setSelectedProvince] = useState<string>("");

    // Fetch gaming center detail
    const { data: detailData, isLoading: isLoadingDetail, mutate } = useAxiosSWR<ApiResponse>(
        gamingCenterId ? `${ENDPOINTS.getPartnerGamingCenterDetail}/${gamingCenterId}` : ""
    );

    // Fetch province and districts data
    const { data: provinceData, isLoading: isLoadingProvinces } = useAxiosSWR<ProvinceDistrictResponse>(
        ENDPOINTS.getProvinceDistricts
    );

    // Get list of provinces for the city dropdown
    const provinces = useMemo(() => {
        return provinceData?.data || [];
    }, [provinceData]);

    // Get list of wards based on selected province
    const wards = useMemo(() => {
        if (!selectedProvince) return [];
        const province = provinces.find(p => p.province === selectedProvince);
        return province?.wards || [];
    }, [selectedProvince, provinces]);

    // Load data into form when detail is fetched
    useEffect(() => {
        if (detailData?.success && detailData.data) {
            const detail: GamingCenterDetail = detailData.data;
            form.setFieldsValue({
                gamingCenterAddress: detail.gamingCenterAddress,
                gamingCenterName: detail.gamingCenterName,
                managerName: detail.managerName,
                openingHour: dayjs(detail.openingHour, 'HH:mm'),
                closingHour: dayjs(detail.closingHour, 'HH:mm'),
                machineConfiguration: detail.machineConfiguration || '',
                city: detail.city,
                district: detail.district,
                fanpage: detail.fanpage || '',
                contactPhone: detail.contactPhone,
                email: detail.email,
                gamingCenterScale: detail.gamingCenterScale,
                averagePlayPrice: detail.averagePlayPrice || '',
            });
            setSelectedProvince(detail.city);

            // Set logo file if exists
            if (detail.logoFile) {
                const logoUrl = `${API_DOMAIN}${detail.logoFile}`;
                setFileList([{
                    uid: '-1',
                    name: 'logo.png',
                    status: 'done',
                    url: logoUrl,
                }]);
            }
        }
    }, [detailData, form]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            form.resetFields();
            setFileList([]);
            setSelectedProvince("");
            setSubmitStatus('idle');
        }
    }, [isOpen, form]);

    // Add/remove className to document body for custom modal styling
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('gaming-center-detail-modal-open');
        } else {
            document.body.classList.remove('gaming-center-detail-modal-open');
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove('gaming-center-detail-modal-open');
        };
    }, [isOpen]);

    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
        form.setFieldValue('district', undefined);
    };

    const handleBeforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Vui lòng chọn file hình ảnh!');
            return Upload.LIST_IGNORE;
        }

        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Kích thước file không được vượt quá 10MB!');
            return Upload.LIST_IGNORE;
        }

        return false;
    };

    const handleFinish = async (values: PartnerGamingCenterFormValues) => {
        if (!gamingCenterId) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const formDataToSend = new FormData();

            // Append form values
            formDataToSend.append('gamingCenterAddress', values.gamingCenterAddress);
            formDataToSend.append('gamingCenterName', values.gamingCenterName);
            formDataToSend.append('managerName', values.managerName);
            formDataToSend.append('openingHour', values.openingHour.format('HH:mm'));
            formDataToSend.append('machineConfiguration', values.machineConfiguration || '');
            formDataToSend.append('city', values.city);
            formDataToSend.append('district', values.district);
            formDataToSend.append('fanpage', values.fanpage || '');
            formDataToSend.append('contactPhone', values.contactPhone);
            formDataToSend.append('email', values.email);
            formDataToSend.append('closingHour', values.closingHour.format('HH:mm'));
            formDataToSend.append('gamingCenterScale', values.gamingCenterScale);
            formDataToSend.append('averagePlayPrice', values.averagePlayPrice || '');

            // Append logo file only if a new file is uploaded
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formDataToSend.append('logoFile', fileList[0].originFileObj as File);
            }

            // Call the update API
            const response = await fetcher.put(
                `${ENDPOINTS.updatePartnerGamingCenter}/${gamingCenterId}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            ) as ApiResponse;

            if (response.success) {
                setSubmitStatus('success');
                notification.show({
                    message: 'Cập nhật thông tin phòng máy thành công!'
                });

                // Refresh the detail data
                await mutate();

                // Call success callback
                if (onUpdateSuccess) {
                    onUpdateSuccess();
                }

                // Close modal after a short delay
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                throw new Error(response.message || 'Cập nhật thông tin phòng máy thất bại');
            }
        } catch (error: any) {
            setSubmitStatus('error');
            const errorMessage = error?.response?.data?.error || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
            notification.show({
                message: errorMessage
            });
            console.error('Partner gaming center update error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setFileList([]);
        setSelectedProvince("");
        setSubmitStatus('idle');
        onClose();
    };

    return (
        <>
            <GamingCenterDetailModalStyles />
            <BaseModal
                isOpen={isOpen}
                onClose={handleClose}
                width={{
                    xs: '100%',
                    sm: '100%',
                    md: '85%',
                    lg: 1200,
                    xl: 1400,
                    xxl: 1400
                }}
                size="large"
                title={<PopupTitle size="large">XEM/ CẬP NHẬT THÔNG TIN PHÒNG MÁY</PopupTitle>}
            >
            {isLoadingDetail ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <LoadingOutlined spin style={{ fontSize: '2rem' }} />
                    <div style={{ marginTop: '1rem' }}>Đang tải thông tin...</div>
                </div>
            ) : (
                <StyledForm
                    form={form}
                    onFinish={handleFinish}
                    layout="vertical"
                >
                    <FormGrid>
                        {/* Left Column */}
                        <LeftColumn>
                            <StyledFormItem
                                name="gamingCenterAddress"
                                label={<FormLabel>Địa chỉ phòng máy</FormLabel>}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập địa chỉ phòng máy!' }
                                ]}
                            >
                                <Input placeholder="" />
                            </StyledFormItem>

                            <StyledFormItem
                                name="gamingCenterName"
                                label={<FormLabel>Tên phòng máy</FormLabel>}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên phòng máy!' },
                                    { min: 3, message: 'Tên phòng máy phải có ít nhất 3 ký tự!' },
                                    { max: 200, message: 'Tên phòng máy không được quá 200 ký tự!' }
                                ]}
                            >
                                <Input placeholder="" />
                            </StyledFormItem>

                            <StyledFormItem
                                name="managerName"
                                label={<FormLabel>Họ và tên Quản lý</FormLabel>}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập họ và tên quản lý!' },
                                    { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                                ]}
                            >
                                <Input placeholder="" />
                            </StyledFormItem>

                            <FormRow style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                <FormGroup>
                                    <StyledFormItem
                                        name="openingHour"
                                        label={<FormLabel>Giờ mở cửa</FormLabel>}
                                        rules={[
                                            { required: true, message: 'Vui lòng chọn giờ mở cửa!' }
                                        ]}
                                    >
                                        <TimePicker
                                            format="HH:mm"
                                            placeholder="Chọn giờ"
                                            style={{ width: '100%' }}
                                        />
                                    </StyledFormItem>
                                </FormGroup>
                                <FormGroup>
                                    <StyledFormItem
                                        name="closingHour"
                                        label={<FormLabel>Giờ đóng cửa</FormLabel>}
                                        rules={[
                                            { required: true, message: 'Vui lòng chọn giờ đóng cửa!' }
                                        ]}
                                    >
                                        <TimePicker
                                            format="HH:mm"
                                            placeholder="Chọn giờ"
                                            style={{ width: '100%' }}
                                        />
                                    </StyledFormItem>
                                </FormGroup>
                            </FormRow>

                            <StyledFormItem
                                name="machineConfiguration"
                                label={<FormLabel>Tổng Quan Cấu hình máy</FormLabel>}
                            >
                                <Input placeholder="" />
                            </StyledFormItem>

                            <StyledFormItem
                                label={<FormLabel>Upload logo phòng máy</FormLabel>}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    beforeUpload={handleBeforeUpload}
                                    onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                                    maxCount={1}
                                    accept="image/*"
                                    onPreview={(file) => {
                                        const url = file.url || URL.createObjectURL(file.originFileObj as File);
                                        window.open(url, '_blank');
                                    }}
                                >
                                    {fileList.length === 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '53px', width: '100%', padding: 0 }}>
                                            <img src={uploadSmall} alt="Upload" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
                                        </div>
                                    )}
                                </Upload>
                            </StyledFormItem>
                        </LeftColumn>

                        {/* Right Column */}
                        <RightColumn>
                            <FormRow style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                <FormGroup>
                                    <StyledFormItem
                                        name="city"
                                        label={<FormLabel>Tỉnh/Thành phố</FormLabel>}
                                        rules={[
                                            { required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }
                                        ]}
                                    >
                                        <Select
                                            placeholder="Chọn tỉnh/thành phố"
                                            showSearch
                                            loading={isLoadingProvinces}
                                            onChange={handleProvinceChange}
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            options={provinces.map(province => ({
                                                label: province.province,
                                                value: province.province
                                            }))}
                                        />
                                    </StyledFormItem>
                                </FormGroup>

                                <FormGroup>
                                    <StyledFormItem
                                        name="district"
                                        label={<FormLabel>Phường/Xã</FormLabel>}
                                        rules={[
                                            { required: true, message: 'Vui lòng chọn phường/xã!' }
                                        ]}
                                    >
                                        <Select
                                            placeholder="Chọn phường/xã"
                                            showSearch
                                            disabled={!selectedProvince}
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            options={wards.map(ward => ({
                                                label: ward.name,
                                                value: ward.name
                                            }))}
                                        />
                                    </StyledFormItem>
                                </FormGroup>
                            </FormRow>

                            <StyledFormItem
                                name="fanpage"
                                label={<FormLabel>Fanpage (nếu có)</FormLabel>}
                            >
                                <Input placeholder="" />
                            </StyledFormItem>

                            <FormRow style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                <FormGroup>
                                    <StyledFormItem
                                        name="contactPhone"
                                        label={<FormLabel>Số điện thoại liên hệ</FormLabel>}
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số điện thoại liên hệ!' },
                                            {
                                                pattern: /^[0-9]{10,11}$/,
                                                message: 'Số điện thoại phải có 10-11 chữ số!'
                                            }
                                        ]}
                                    >
                                        <Input placeholder="" />
                                    </StyledFormItem>
                                </FormGroup>
                                <FormGroup>
                                    <StyledFormItem
                                        name="email"
                                        label={<FormLabel>Email</FormLabel>}
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email!' },
                                            { type: 'email', message: 'Email không hợp lệ!' }
                                        ]}
                                    >
                                        <Input placeholder="" />
                                    </StyledFormItem>
                                </FormGroup>
                            </FormRow>

                            <StyledFormItem
                                name="gamingCenterScale"
                                label={<FormLabel>Quy mô phòng máy (số lượng máy)</FormLabel>}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập quy mô phòng máy!' },
                                    {
                                        pattern: /^[0-9]+$/,
                                        message: 'Vui lòng nhập số hợp lệ!'
                                    }
                                ]}
                            >
                                <Input placeholder="" />
                            </StyledFormItem>

                            <StyledFormItem
                                name="averagePlayPrice"
                                label={<FormLabel>Giá chơi trung bình (VNĐ/giờ)</FormLabel>}
                                rules={[
                                    {
                                        pattern: /^[0-9]+$/,
                                        message: 'Vui lòng nhập số hợp lệ!'
                                    }
                                ]}
                            >
                                <Input placeholder="" />
                            </StyledFormItem>
                        </RightColumn>
                    </FormGrid>

                    {submitStatus === 'success' && (
                        <SuccessMessage style={{ marginTop: '2rem' }}>
                            Cập nhật thông tin phòng máy thành công!
                        </SuccessMessage>
                    )}

                    {submitStatus === 'error' && (
                        <ErrorMessage style={{ marginTop: '2rem' }}>
                            Có lỗi xảy ra. Vui lòng thử lại sau.
                        </ErrorMessage>
                    )}

                    <SubmitButtonWrapper>
                        <ButtonGroup>
                            <PrimaryPopupButton variant="secondary" onClick={handleClose}>
                                QUAY LẠI
                            </PrimaryPopupButton>
                            <PrimaryPopupButton disabled={isSubmitting} type="submit">
                                {isSubmitting && <LoadingOutlined style={{ marginRight: '8px' }} spin />}
                                CẬP NHẬT
                            </PrimaryPopupButton>
                        </ButtonGroup>
                    </SubmitButtonWrapper>
                </StyledForm>
            )}
            </BaseModal>
        </>
    );
}

