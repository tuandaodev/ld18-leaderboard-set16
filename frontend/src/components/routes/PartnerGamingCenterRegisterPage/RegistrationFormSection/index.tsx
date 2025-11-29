import { LoadingOutlined } from "@ant-design/icons";
import { ENDPOINTS } from "@components/api/endpoints";
import useAxiosSWR, { fetcher } from "@components/api/useAxiosSWR";
import uploadSmall from "@images/page/upload_small.png";
import uploadSmallMb from "@images/mobile/upload_small_mb.png";
import { notification } from "@store/useNotification";
import type { UploadFile } from "antd";
import { Form, Input, Select, TimePicker, Upload, message } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import { ProvinceDistrictResponse } from "types/endpoints/location";
import PageTitle from "../../CommunityLeaderRegisterPage/PageTitle";
import styled from "styled-components";
import PrimaryButton from "../../LandingPage/PrimaryButton";
import {
    ButtonGroup,
    ErrorMessage,
    FormContainer,
    FormGrid,
    FormGroup,
    FormRow,
    FormWrapper,
    LeftColumn,
    RightColumn,
    StyledFormItem,
    SubmitButtonWrapper,
    SuccessMessage,
    UploadContainer
} from "./RegistrationFormSection.styles";

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

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export default function RegistrationFormSection() {
    const navigate = useNavigate();
    const [form] = Form.useForm<PartnerGamingCenterFormValues>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const isMobile = useMediaQuery("(max-width: 768px)");

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

    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
        // Clear district field when province changes
        form.setFieldValue('district', undefined);
    };

    const handleBeforeUpload = (file: File) => {
        // Validate file type
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Vui lòng chọn file hình ảnh!');
            return Upload.LIST_IGNORE;
        }

        // Validate file size (max 10MB)
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Kích thước file không được vượt quá 10MB!');
            return Upload.LIST_IGNORE;
        }

        return false; // Prevent auto upload
    };

    const handleFinish = async (values: PartnerGamingCenterFormValues) => {
        if (fileList.length === 0) {
            message.error('Vui lòng tải lên logo phòng máy!');
            return;
        }

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

            // Append logo file
            formDataToSend.append('logoFile', fileList[0].originFileObj as File);

            // Call the API
            const response = await fetcher.post(ENDPOINTS.registerPartnerGamingCenter, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }) as ApiResponse;

            if (response.success) {
                setSubmitStatus('success');
                notification.show({
                    message: 'Chúc mừng bạn đã đăng ký trở thành phòng máy đối tác thành công, Ban Tổ Chức sẽ cập nhật trạng thái đăng ký của bạn trong vòng 24 giờ.',
                    title: 'HOÀN TẤT ĐĂNG KÝ'
                });

                // Reset form
                form.resetFields();
                setFileList([]);
                setSelectedProvince("");
            } else {
                throw new Error(response.message || 'Đăng ký phòng máy đối tác thất bại');
            }
        } catch (error: any) {
            setSubmitStatus('error');
            const errorMessage = error?.response?.data?.error || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
            notification.show({
                message: errorMessage
            });
            console.error('Partner gaming center registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const MobilePageTitle = styled(PageTitle)`
        @media (max-width: 768px) {
            padding: 0 20px;
            font-size: 16px;
        }
    `;

    return (
        <FormWrapper>
            <MobilePageTitle>ĐĂNG KÝ TRỞ THÀNH PHÒNG MÁY ĐỐI TÁC</MobilePageTitle>

            <FormContainer>
                <Form
                    form={form}
                    onFinish={handleFinish}
                    layout="vertical"
                >
                    <FormGrid>
                        {/* Left Column */}
                        <LeftColumn>
                            <StyledFormItem
                                name="gamingCenterAddress"
                                label="Địa chỉ phòng máy"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập địa chỉ phòng máy!' }
                                ]}
                            >
                                <Input placeholder="" />
                            </StyledFormItem>

                            <StyledFormItem
                                name="gamingCenterName"
                                label="Tên phòng máy"
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
                                label="Họ và tên Quản lý"
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
                                        label="Giờ mở cửa"
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
                                        label="Giờ đóng cửa"
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
                                label="Tổng Quan Cấu hình máy"
                            >
                                <Input placeholder="" />
                            </StyledFormItem>

                            <StyledFormItem
                                label="Upload logo phòng máy"
                                required
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
                                        <UploadContainer>
                                            <img src={isMobile ? uploadSmallMb : uploadSmall} alt="Upload" />
                                        </UploadContainer>
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
                                        label="Tỉnh/Thành phố"
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
                                        label="Phường/Xã"
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
                                label="Fanpage (nếu có)"
                            >
                                <Input placeholder="" />
                            </StyledFormItem>

                            <FormRow style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                <FormGroup>
                                    <StyledFormItem
                                        name="contactPhone"
                                        label="Số điện thoại liên hệ"
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
                                        label="Email"
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
                                label="Quy mô phòng máy (số lượng máy)"
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
                                label="Giá chơi trung bình (VNĐ/giờ)"
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
                            Đăng ký phòng máy đối tác thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                        </SuccessMessage>
                    )}

                    {submitStatus === 'error' && (
                        <ErrorMessage style={{ marginTop: '2rem' }}>
                            Có lỗi xảy ra. Vui lòng thử lại sau.
                        </ErrorMessage>
                    )}

                    <SubmitButtonWrapper>
                        <ButtonGroup>
                            <PrimaryButton variant="secondary" onClick={handleGoBack}>
                                QUAY LẠI
                            </PrimaryButton>
                            <PrimaryButton disabled={isSubmitting}>
                                {isSubmitting && <LoadingOutlined style={{ marginRight: '8px' }} spin />}
                                ĐĂNG KÝ
                            </PrimaryButton>
                        </ButtonGroup>
                    </SubmitButtonWrapper>
                </Form>
            </FormContainer>
        </FormWrapper>
    );
}

