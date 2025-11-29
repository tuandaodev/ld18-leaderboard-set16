import { LoadingOutlined } from "@ant-design/icons";
import { ENDPOINTS } from "@components/api/endpoints";
import useAxiosSWR, { fetcher } from "@components/api/useAxiosSWR";
import uploadSmall from "@images/page/upload_small.png";
import uploadSmallMb from "@images/mobile/upload_small_mb.png";
import { notification } from "@store/useNotification";
import type { UploadFile } from "antd";
import { DatePicker, Form, Input, Select, Upload, message } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ProvinceDistrictResponse } from "types/endpoints/location";
import PageTitle from "../../CommunityLeaderRegisterPage/PageTitle";
import PrimaryButton from "../../LandingPage/PrimaryButton";
import {
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
  UploadContainer,
} from "./RegistrationFormSection.styles";

const { TextArea } = Input;

interface EventFormValues {
  eventName: string;
  city: string;
  district: string;
  registrationDeadline: dayjs.Dayjs;
  eventStartTime: dayjs.Dayjs;
  eventEndTime: dayjs.Dayjs;
  venueAddress: string;
  venueName: string;
  eventType: string;
  deviceType: string;
  eventDescription: string;
  eventScale: string;
  supportLevel: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

const disallowHtmlPattern = /^[^<>]*$/;
const disallowHtmlMessage = 'Nội dung không được chứa ký tự < hoặc >!';

export default function RegistrationFormSection() {
  const [form] = Form.useForm<EventFormValues>();
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

  const handleFinish = async (values: EventFormValues) => {
    if (fileList.length === 0) {
      message.error('Vui lòng tải lên banner sự kiện!');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new FormData();

      // Append form values
      formDataToSend.append('eventName', values.eventName);
      formDataToSend.append('city', values.city);
      formDataToSend.append('district', values.district);
      formDataToSend.append('registrationDeadline', values.registrationDeadline.format('YYYY-MM-DD HH:mm:ss'));
      formDataToSend.append('eventStartTime', values.eventStartTime.format('YYYY-MM-DD HH:mm:ss'));
      formDataToSend.append('eventEndTime', values.eventEndTime.format('YYYY-MM-DD HH:mm:ss'));
      formDataToSend.append('venueAddress', values.venueAddress);
      formDataToSend.append('venueName', values.venueName);
      formDataToSend.append('eventType', values.eventType);
      if (values.deviceType) formDataToSend.append('deviceType', values.deviceType);
      formDataToSend.append('eventDescription', values.eventDescription);
      formDataToSend.append('eventScale', values.eventScale);
      formDataToSend.append('supportLevel', values.supportLevel);

      // Append banner file
      formDataToSend.append('bannerFile', fileList[0].originFileObj as File);

      // Call the API
      const response = await fetcher.post(ENDPOINTS.registerEvent, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }) as ApiResponse;

      if (response.success) {
        setSubmitStatus('success');
        notification.show({
          message: 'Chúc mừng bạn đã đăng ký sự kiện thành công, Ban Tổ Chức sẽ cập nhật trạng thái đăng ký của bạn trong vòng 24 giờ.',
          title: 'HOÀN TẤT ĐĂNG KÝ'
        });

        // Reset form
        form.resetFields();
        setFileList([]);
        setSelectedProvince("");
      } else {
        throw new Error(response.message || 'Đăng ký sự kiện thất bại');
      }
    } catch (error: any) {
      setSubmitStatus('error');
      const errorMessage = error?.response?.data?.error || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      notification.show({
        message: errorMessage
      });
      console.error('Event registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper>
      <PageTitle>ĐĂNG KÝ SỰ KIỆN OFFLINE/GIẢI ĐẤU</PageTitle>

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
                name="eventName"
                label="Tên sự kiện"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên sự kiện!' },
                  { min: 5, message: 'Tên sự kiện phải có ít nhất 5 ký tự!' },
                  { max: 200, message: 'Tên sự kiện không được quá 200 ký tự!' },
                  { pattern: disallowHtmlPattern, message: disallowHtmlMessage }
                ]}
              >
                <Input placeholder="" />
              </StyledFormItem>

              <StyledFormItem
                name="registrationDeadline"
                label="Thời gian đăng ký tham gia đến"
                rules={[
                  { required: true, message: 'Vui lòng chọn thời gian đăng ký!' },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      if (value.isBefore(dayjs())) {
                        return Promise.reject(new Error('Thời gian đăng ký phải sau thời điểm hiện tại!'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn thời gian"
                  style={{ width: '100%' }}
                />
              </StyledFormItem>

              <StyledFormItem
                name="venueAddress"
                label="Địa chỉ diễn ra"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ diễn ra!' },
                  { max: 500, message: 'Địa chỉ không được quá 500 ký tự!' },
                  { pattern: disallowHtmlPattern, message: disallowHtmlMessage }
                ]}
              >
                <Input placeholder="" />
              </StyledFormItem>



              <StyledFormItem
                name="eventType"
                label="Loại sự kiện (Offline/ Giải Đấu)"
                rules={[
                  { required: true, message: 'Vui lòng chọn loại sự kiện!' }
                ]}
              >
                <Select
                  placeholder="Chọn loại sự kiện"
                  options={[
                    { label: 'Offline', value: 'offline' },
                    { label: 'Giải Đấu', value: 'tournament' }
                  ]}
                />
              </StyledFormItem>

              <StyledFormItem
                name="eventDescription"
                label="Thể lệ và giới thiệu sự kiện"
                rules={[
                  { required: true, message: 'Vui lòng nhập thể lệ và giới thiệu!' },
                  { min: 50, message: 'Nội dung phải có ít nhất 50 ký tự!' },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      if (/<|>/.test(value)) {
                        return Promise.reject(new Error(disallowHtmlMessage));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder=""
                  maxLength={2000}
                  showCount
                />
              </StyledFormItem>

              <StyledFormItem
                label="Upload banner truyền thống"
                required
                // tooltip="Kích thước tối đa 10MB, chỉ chấp nhận file ảnh"
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


              <FormRow style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <FormGroup>
                  <StyledFormItem
                    name="eventStartTime"
                    label="Thời gian diễn ra từ"
                    rules={[
                      { required: true, message: 'Vui lòng chọn thời gian bắt đầu!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const registrationDeadline = getFieldValue('registrationDeadline');
                          if (!value || !registrationDeadline) return Promise.resolve();
                          if (value.isBefore(registrationDeadline)) {
                            return Promise.reject(new Error('Thời gian diễn ra phải sau thời gian đăng ký!'));
                          }
                          return Promise.resolve();
                        }
                      })
                    ]}
                  >
                    <DatePicker
                      showTime
                      format="DD/MM/YYYY HH:mm"
                      placeholder="Chọn thời gian"
                      style={{ width: '100%' }}
                    />
                  </StyledFormItem>
                </FormGroup>
                <FormGroup>
                  <StyledFormItem
                    name="eventEndTime"
                    label="Thời gian kết thúc"
                    rules={[
                      { required: true, message: 'Vui lòng chọn thời gian kết thúc!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const eventStartTime = getFieldValue('eventStartTime');
                          if (!value || !eventStartTime) return Promise.resolve();
                          if (value.isBefore(eventStartTime)) {
                            return Promise.reject(new Error('Thời gian kết thúc phải sau thời gian bắt đầu!'));
                          }
                          return Promise.resolve();
                        }
                      })
                    ]}
                  >
                    <DatePicker
                      showTime
                      format="DD/MM/YYYY HH:mm"
                      placeholder="Chọn thời gian"
                      style={{ width: '100%' }}
                    />
                  </StyledFormItem>

                </FormGroup>
              </FormRow>



              <StyledFormItem
                name="venueName"
                label="Tên địa điểm (dựa trên địa chỉ)"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên địa điểm!' },
                  { max: 200, message: 'Tên địa điểm không được quá 200 ký tự!' },
                  { pattern: disallowHtmlPattern, message: disallowHtmlMessage }
                ]}
              >
                <Input placeholder="" />
              </StyledFormItem>

              <StyledFormItem
                name="deviceType"
                label="Loại thiết bị (PC/Mobile)"
                // rules={[
                //   { required: true, message: 'Vui lòng chọn loại thiết bị!' }
                // ]}
              >
                <Select
                  placeholder="Chọn loại thiết bị"
                  options={[
                    { label: 'PC', value: 'pc' },
                    { label: 'Mobile', value: 'mobile' }
                  ]}
                />
              </StyledFormItem>

              <StyledFormItem
                name="eventScale"
                label="Quy mô sự kiện (số lượng người tham gia)"
                rules={[
                  { required: true, message: 'Vui lòng nhập quy mô sự kiện!' },
                  {
                    pattern: /^[0-9]+$/,
                    message: 'Vui lòng nhập số hợp lệ!'
                  }
                ]}
              >
                <Input placeholder="" />
              </StyledFormItem>

              <StyledFormItem
                name="supportLevel"
                label="Mức hỗ trợ"
                rules={[
                  { required: true, message: 'Vui lòng nhập mức hỗ trợ!' },
                  { max: 500, message: 'Mức hỗ trợ không được quá 500 ký tự!' },
                  { pattern: disallowHtmlPattern, message: disallowHtmlMessage }
                ]}
              >
                <Input
                  placeholder=""
                  // maxLength={500}
                  // showCount
                />
              </StyledFormItem>
            </RightColumn>
          </FormGrid>

          {submitStatus === 'success' && (
            <SuccessMessage style={{ marginTop: '2rem' }}>
              Đăng ký sự kiện thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
            </SuccessMessage>
          )}

          {submitStatus === 'error' && (
            <ErrorMessage style={{ marginTop: '2rem' }}>
              Có lỗi xảy ra. Vui lòng thử lại sau.
            </ErrorMessage>
          )}

          <SubmitButtonWrapper>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoadingOutlined style={{ marginRight: '8px' }} spin />}
              ĐĂNG KÝ
            </PrimaryButton>
          </SubmitButtonWrapper>
        </Form>
      </FormContainer>
    </FormWrapper>
  );
}

