import { LoadingOutlined } from "@ant-design/icons";
import uploadIconBig from "@images/page/upload_icon_big.png";
import { notification } from "@store/useNotification";
import { DatePicker, Form, Input, Radio, Select, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { ProvinceDistrictResponse } from "types/endpoints/location";
import { AuthMeResponse } from "types/endpoints/auth-me";
import { ENDPOINTS } from "../../../api/endpoints";
import useAxiosSWR, { fetcher } from "../../../api/useAxiosSWR";
import PrimaryButton from "../../LandingPage/PrimaryButton";
import PageTitle from "../PageTitle";
import { useAuth } from "@store/useAuth";
import {
  AvatarBox,
  AvatarLabel,
  AvatarPreview,
  AvatarUploadSection,
  FormContainer,
  FormGrid,
  FormGroup,
  FormRow,
  FormWrapper,
  LeftColumn,
  RightColumn,
  SectionNumber,
  SectionTitle,
  StyledFormItem,
  StyledRadioGroup,
  SubmitButtonWrapper,
  SuccessMessage,
  UploadIcon
} from "./RegistrationFormSection.styles";

const { TextArea } = Input;

interface CommunityLeaderFormValues {
  fullName: string;
  dateOfBirth: dayjs.Dayjs;
  phone: string;
  email: string;
  city: string;
  district: string;
  facebookLink: string;
  gameCharacterName?: string;
  gameUID?: string;
  communityGroups?: string;
  isGuildMaster: boolean;
  guildName?: string;
  managementExperience?: string;
  eventExperience?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export default function RegistrationFormSection() {
  const [form] = Form.useForm<CommunityLeaderFormValues>();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isGuildMaster, setIsGuildMaster] = useState<'not_selected' | 'yes' | 'no'>('not_selected');
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [hasPrefilledUserData, setHasPrefilledUserData] = useState(false);

  // Fetch province and districts data
  const { data: provinceData, isLoading: isLoadingProvinces } = useAxiosSWR<ProvinceDistrictResponse>(
    ENDPOINTS.getProvinceDistricts
  );

  const isAuthenticated = useAuth(({ data }) => data.isAuthenticated);
  const { data: userProfile } = useAxiosSWR<AuthMeResponse>(
    isAuthenticated ? ENDPOINTS.getMe : null
  );

  useEffect(() => {
    if (!hasPrefilledUserData && userProfile?.data) {
      form.setFieldsValue({
        email: userProfile.data.email || "",
        facebookLink: userProfile.data.socialUrl || "",
        gameCharacterName: userProfile.data.uid || "",
        gameUID: userProfile.data.roleId || "",
      });
      setHasPrefilledUserData(true);
    }
  }, [form, hasPrefilledUserData, userProfile]);

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        message.error('Vui lòng chọn file hình ảnh!');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        message.error('Kích thước file không được vượt quá 5MB!');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = async (values: CommunityLeaderFormValues) => {
    if (!avatarFile) {
      message.error('Vui lòng tải lên ảnh đại diện!');
      return;
    }

    if (isGuildMaster === 'not_selected') {
      message.error('Vui lòng chọn có đang là bang chủ của bang hội nào không!');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new FormData();
      
      // Append form values
      formDataToSend.append('fullName', values.fullName);
      formDataToSend.append('dateOfBirth', values.dateOfBirth.format('YYYY-MM-DD'));
      formDataToSend.append('phone', values.phone);
      formDataToSend.append('email', values.email);
      formDataToSend.append('city', values.city);
      if (values.district) formDataToSend.append('district', values.district);
      formDataToSend.append('facebookLink', values.facebookLink);
      
      if (values.gameCharacterName) formDataToSend.append('gameCharacterName', values.gameCharacterName);
      if (values.gameUID) formDataToSend.append('gameUID', values.gameUID);
      if (values.communityGroups) formDataToSend.append('communityGroups', values.communityGroups);
      
      if (isGuildMaster === 'yes') {
        formDataToSend.append('isGuildMaster', 'true');
      } else {
        formDataToSend.append('isGuildMaster', 'false');
      }
      if (values.guildName) formDataToSend.append('guildName', values.guildName);
      if (values.managementExperience) formDataToSend.append('managementExperience', values.managementExperience);
      if (values.eventExperience) formDataToSend.append('eventExperience', values.eventExperience);
      
      // Append avatar file with the correct field name expected by backend
      formDataToSend.append('avatarFile', avatarFile);
      
      // Call the API
      const response = await fetcher.post(ENDPOINTS.registerLeader, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }) as ApiResponse;

      if (response.success) {
        setSubmitStatus('success');
        // message.success('Đăng ký thành công!');
        notification.show({
          message: 'Chúc mừng bạn đã đăng ký thành công, Ban Tổ Chức sẽ cập nhật trạng thái đăng ký của bạn trong vòng 24 giờ.',
          title: 'HOÀN TẤT ĐĂNG KÝ'
        });
        
        // Reset form
        form.resetFields();
        setAvatarFile(null);
        setAvatarPreview("");
        setIsGuildMaster('not_selected');
        setSelectedProvince("");
      } else {
        throw new Error(response.message || 'Đăng ký thất bại');
      }
    } catch (error: any) {
      setSubmitStatus('error');
      const errorMessage = error?.response?.data?.error || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      notification.show({
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper>
      <PageTitle>ĐĂNG KÝ TRỞ THÀNH THỦ LĨNH CỘNG ĐỒNG</PageTitle>
      
      <FormContainer>
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          initialValues={{
            isGuildMaster: 'not_selected'
          }}
        >
          {/* Section 1: Leader Information */}
          <SectionTitle>
            <SectionNumber>1.</SectionNumber> THÔNG TIN THỦ LĨNH
          </SectionTitle>
          
          <FormGrid>
            <LeftColumn>
              <AvatarUploadSection>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="avatar-upload">
                  <AvatarBox>
                    {avatarPreview ? (
                      <AvatarPreview src={avatarPreview} alt="Avatar" />
                    ) : (
                      <UploadIcon style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={uploadIconBig} alt="Upload" />
                        <AvatarLabel>TẢI ẢNH ĐẠI DIỆN</AvatarLabel>
                      </UploadIcon>
                    )
                  }
                </AvatarBox>
              </label>
            </AvatarUploadSection>
          </LeftColumn>

          <RightColumn>
            <FormRow>
              <FormGroup>
                <StyledFormItem
                  name="fullName"
                  label="Họ và tên"
                  rules={[
                      { required: true, message: 'Vui lòng nhập họ và tên!' },
                      { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' },
                      { max: 100, message: 'Họ và tên không được quá 100 ký tự!' }
                    ]}
                  >
                    <Input placeholder="" />
                  </StyledFormItem>
                </FormGroup>

                <FormGroup>
                  <StyledFormItem
                    name="dateOfBirth"
                    label="Ngày tháng năm sinh"
                    rules={[
                      { required: true, message: 'Vui lòng chọn ngày sinh!' },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          const age = dayjs().diff(value, 'year');
                          if (age < 18) {
                            return Promise.reject(new Error('Bạn phải từ 18 tuổi trở lên!'));
                          }
                          if (age > 100) {
                            return Promise.reject(new Error('Vui lòng nhập ngày sinh hợp lệ!'));
                          }
                          return Promise.resolve();
                        }
                      }
                    ]}
                  >
                    <DatePicker 
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày sinh"
                      style={{ width: '100%' }}
                    />
                  </StyledFormItem>
                </FormGroup>

                <FormGroup>
                  <StyledFormItem
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại!' },
                      { 
                        pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
                        message: 'Số điện thoại không hợp lệ!' 
                      }
                    ]}
                  >
                    <Input placeholder="" />
                  </StyledFormItem>
                </FormGroup>
              </FormRow>

              <FormRow>
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

                <FormGroup>
                  <StyledFormItem
                    name="city"
                    label="Tỉnh/Thành phố bạn muốn hoạt động"
                    rules={[
                      { required: true, message: 'Vui lòng chọn tỉnh/thành phố bạn muốn hoạt động!' }
                    ]}
                  >
                    <Select
                      placeholder="Chọn tỉnh/thành phố bạn muốn hoạt động"
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
                    // rules={[
                    //   { required: true, message: 'Vui lòng chọn phường/xã!' }
                    // ]}
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

              <FormRow>
                <FormGroup>
                  <StyledFormItem
                    name="facebookLink"
                    label="Link trang MXH Facebook cá nhân"
                    rules={[
                      { required: true, message: 'Vui lòng nhập link Facebook!' },
                      { 
                        type: 'url',
                        message: 'Link Facebook phải là một đường dẫn hợp lệ!'
                      },
                      { 
                        pattern: /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/.+/,
                        message: 'Link Facebook không hợp lệ!' 
                      }
                    ]}
                  >
                    <Input placeholder="" />
                  </StyledFormItem>
                </FormGroup>

                <FormGroup>
                  <StyledFormItem
                    name="gameCharacterName"
                    label="Tên Nhân Vật Ingame"
                  >
                    <Input placeholder="" />
                  </StyledFormItem>
                </FormGroup>

                <FormGroup>
                  <StyledFormItem
                    name="gameUID"
                    label="Role ID ingame của bạn"
                  >
                    <Input placeholder="" />
                  </StyledFormItem>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <StyledFormItem
                    name="communityGroups"
                    label="Hội nhóm Facebook/Group/Discord/Cộng Đồng mà Thiếu Hiệp đang quản lý (nếu có)"
                  >
                    <Input placeholder="" />
                  </StyledFormItem>
                </FormGroup>
              </FormRow>
            </RightColumn>
          </FormGrid>

          {/* Section 2: Other Information */}
          <SectionTitle style={{ marginTop: '1rem' }}>
            <SectionNumber>2.</SectionNumber> THÔNG TIN KHÁC
          </SectionTitle>

          <FormRow style={{ alignItems: 'flex-start' }}>
            <FormGroup>
              <StyledFormItem
                name="isGuildMaster"
                label="Bạn có đang là bang chủ của bang hội nào không?"
                rules={[
                  {
                    validator: (_, value) =>
                      value === 'yes' || value === 'no'
                        ? Promise.resolve()
                        : Promise.reject(new Error('Vui lòng chọn có đang là bang chủ của bang hội nào không?'))
                  }
                ]}
              >
                <StyledRadioGroup 
                  onChange={(e) => {
                    const value = e.target.value as 'not_selected' | 'yes' | 'no';
                    setIsGuildMaster(value);
                    if (value === 'no') {
                      form.setFieldsValue({
                        guildName: undefined,
                      });
                    }
                  }}
                >
                  <Radio value={'yes'}>Có</Radio>
                  <Radio value={'no'}>Không</Radio>
                </StyledRadioGroup>
              </StyledFormItem>
            </FormGroup>

            {isGuildMaster === 'yes' && (
              <FormGroup style={{ gridColumn: 'span 2' }}>
                <StyledFormItem
                  name="guildName"
                  label="Tên bang hội của bạn là"
                  dependencies={['isGuildMaster']}
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên bang hội của bạn!' },
                    { max: 255, message: 'Tên bang hội không được quá 255 ký tự!' }
                  ]}
                >
                  <Input placeholder="" />
                </StyledFormItem>
              </FormGroup>
            )}
          </FormRow>

          {(
            <FormRow style={{ alignItems: 'flex-start' }}>
              <FormGroup style={{ gridColumn: 'span 1' }}>
                <StyledFormItem
                  name="managementExperience"
                  label="Chia sẻ về kinh nghiệm quản lý cộng đồng hội nhóm"
                  rules={[
                    { required: true, message: 'Vui lòng nhập kinh nghiệm quản lý cộng đồng hội nhóm!' }
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder=""
                    maxLength={1000}
                    showCount
                  />
                </StyledFormItem>
              </FormGroup>

              <FormGroup style={{ gridColumn: 'span 2' }}>
                <StyledFormItem
                  name="eventExperience"
                  label="Chia sẻ về kinh nghiệm tổ chức sự kiện"
                  rules={[
                    { required: true, message: 'Vui lòng nhập kinh nghiệm tổ chức sự kiện!' }
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder=""
                    maxLength={1000}
                    showCount
                  />
                </StyledFormItem>
              </FormGroup>
            </FormRow>
          )}

          {submitStatus === 'success' && (
            <SuccessMessage style={{ marginTop: '2rem' }}>
              Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
            </SuccessMessage>
          )}

          {/* {submitStatus === 'error' && (
            <ErrorMessage style={{ marginTop: '2rem' }}>
              Có lỗi xảy ra. Vui lòng thử lại sau.
            </ErrorMessage>
          )} */}

          <SubmitButtonWrapper>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoadingOutlined style={{ marginRight: '8px' }} spin />}
              ĐĂNG KÝ TRỞ THÀNH <br/> THỦ LĨNH CỘNG ĐỒNG
            </PrimaryButton>
          </SubmitButtonWrapper>
        </Form>
      </FormContainer>
    </FormWrapper>
  );
}
