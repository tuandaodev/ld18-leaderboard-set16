// libraries
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  GetProp,
  Input,
  Select,
  Upload,
  UploadProps,
  message
} from "antd";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// manual
import useAxiosSWR, { fetcher } from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import { ProvinceDistrictResponse } from "types/endpoints/location";
import Layout from "@components/common/Admin/Layout";
import PageLoader from "@components/common/PageLoader";
import { useAuth } from "@store/useAuth";
import { UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import { t } from "i18next";
import { RICH_TEXT_MODULES, RICH_TEXT_FORMATS } from "@lib/constants";
import 'react-quill/dist/quill.snow.css';

const ReactQuill = lazy(() => import('react-quill'));
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const domain = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_DOMAIN! || ""
  : import.meta.env.VITE_PRO_DOMAIN! || "";

interface EventResult {
  id: number;
  eventName: string;
  city: string;
  eventStartTime: string;
  eventEndTime: string;
  eventType: string;
  eventDescription: string;
  bannerFile: string;
  eventUrl: string;
  totalPrize: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EventForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [existingBannerUrl, setExistingBannerUrl] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const userRoleNum = useAuth(({ data }) => data.role);

  // Fetch province and districts data
  const { data: provinceData, isLoading: isLoadingProvinces } = useAxiosSWR<ProvinceDistrictResponse>(
    ENDPOINTS.getProvinceDistricts
  );

  // Get list of provinces for the city dropdown
  const provinces = useMemo(() => {
    return provinceData?.data || [];
  }, [provinceData]);

  useEffect(() => {
    if (isEditMode && id) {
      setIsLoadingData(true);
      const fetchData = async () => {
        try {
          form.resetFields();
          const response: { success: boolean, data: EventResult } = await fetcher.get(
            ENDPOINTS.getEventDetail + "/" + id + "/detail",
          );
          if (response.success) {
            form.setFieldsValue({
              eventName: response.data.eventName,
              city: response.data.city,
              eventStartTime: dayjs(response.data.eventStartTime),
              eventEndTime: dayjs(response.data.eventEndTime),
              eventType: response.data.eventType,
              eventUrl: response.data.eventUrl || "",
              totalPrize: response.data.totalPrize || "",
              isPublic: response.data.isPublic,
            });
            setEventDescription(response.data.eventDescription || "");
            setExistingBannerUrl(response.data.bannerFile);
          }
        } catch (error: any) {
          message.error(error?.response?.data?.error || t("Đã xảy lỗi"));
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchData();
    }
  }, [isEditMode, id, form]);

  const handleFileChange = (info: UploadChangeParam<any>) => {
    if (info.file) {
      const file = info.file.originFileObj || info.file;
      if (file instanceof File) {
        setBannerFile(file);
      }
    }
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error('Image must smaller than 20MB!');
      return Upload.LIST_IGNORE;
    }
    // Store the file immediately when valid
    setBannerFile(file as File);
    return false;
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setIsLoading(true);
      const { eventName, city, eventStartTime, eventEndTime, eventType, eventUrl, totalPrize, isPublic } = values;
      
      if (!eventName || !city || !eventStartTime || !eventEndTime || !eventType || !eventDescription) {
        message.error("Please fill in all required fields");
        return;
      }

      if (!isEditMode && !bannerFile) {
        message.error("Please upload a banner image");
        return;
      }

      const formData = new FormData();
      formData.append("eventName", eventName);
      formData.append("city", city);
      formData.append("eventStartTime", dayjs(eventStartTime).toISOString());
      formData.append("eventEndTime", dayjs(eventEndTime).toISOString());
      formData.append("eventType", eventType);
      formData.append("eventDescription", eventDescription);
      formData.append("eventUrl", eventUrl || "");
      formData.append("totalPrize", totalPrize || "");
      formData.append("isPublic", isPublic ? "true" : "false");
      
      if (bannerFile) {
        formData.append("bannerFile", bannerFile);
      }

      let response: { success: boolean, data: EventResult };
      
      if (isEditMode && id) {
        response = await fetcher.post(
          ENDPOINTS.updateEvent + "/" + id + "/update",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await fetcher.post(
          ENDPOINTS.createEvent,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      
      if (response.success === true) {
        message.success(isEditMode ? "Event updated successfully" : "Event created successfully");
        navigate("/cp/events");
      }
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.error || t("Đã xảy lỗi"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) return <PageLoader />;

  return (
    <Layout>
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "2rem" }}>
          {isEditMode ? "Edit Event" : "Add Event"}
        </h1>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Event Name"
            name="eventName"
            rules={[{ required: true, message: "Event Name is required" }]}
          >
            <Input placeholder="Enter Event Name" />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "City is required" }]}
          >
            <Select
              placeholder="Select City"
              showSearch
              loading={isLoadingProvinces}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={provinces.map(province => ({
                label: province.province,
                value: province.province
              }))}
            />
          </Form.Item>

          <Form.Item
            name="eventStartTime"
            label="Start Time"
            rules={[
              { required: true, message: "Start Time is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('eventEndTime')) {
                    return Promise.resolve();
                  }
                  if (dayjs(value).isAfter(dayjs(getFieldValue('eventEndTime')))) {
                    return Promise.reject(new Error('Start time must be before end time'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              format='DD/MM/YYYY'
              placeholder='DD/MM/YYYY'
              allowClear={false}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="eventEndTime"
            label="End Time"
            rules={[
              { required: true, message: "End Time is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('eventStartTime')) {
                    return Promise.resolve();
                  }
                  if (dayjs(value).isBefore(dayjs(getFieldValue('eventStartTime')))) {
                    return Promise.reject(new Error('End time must be after start time'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              format='DD/MM/YYYY'
              placeholder='DD/MM/YYYY'
              allowClear={false}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Event Type"
            name="eventType"
            rules={[{ required: true, message: "Event Type is required" }]}
          >
            <Select placeholder="Select Event Type">
              <Select.Option value="online">Online</Select.Option>
              <Select.Option value="offline">Offline</Select.Option>
              <Select.Option value="tournament">Tournament</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Event Description"
            rules={[{ required: true, message: "Event Description is required" }]}
          >
            <Suspense fallback={<div>Loading editor...</div>}>
              <div 
                style={{ 
                  height: '400px', 
                  marginBottom: '42px' 
                }}
                className="richTextWrapper"
              >
                <style>{`
                  .richTextWrapper .ql-container {
                    height: 350px;
                  }
                  .richTextWrapper .ql-editor {
                    min-height: 350px;
                  }
                `}</style>
                <ReactQuill
                  theme="snow"
                  modules={RICH_TEXT_MODULES}
                  formats={RICH_TEXT_FORMATS}
                  value={eventDescription}
                  onChange={setEventDescription}
                />
              </div>
            </Suspense>
          </Form.Item>

          <Form.Item
            label="Banner Image"
            rules={isEditMode ? [] : [{ required: true, message: "Banner Image is required" }]}
          >
            {existingBannerUrl && (
              <div style={{ marginBottom: 10 }}>
                <img
                  src={`${domain}${existingBannerUrl}`}
                  alt="Current Banner"
                  style={{ width: '200px', height: 'auto', marginBottom: 10 }}
                />
              </div>
            )}
            <Upload
              beforeUpload={beforeUpload}
              onChange={handleFileChange}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>
                {isEditMode ? "Change Banner Image" : "Select Banner Image"}
              </Button>
            </Upload>
            {isEditMode && (
              <p style={{ marginTop: 8, color: '#999' }}>Leave empty to keep current banner</p>
            )}
          </Form.Item>

          <Form.Item
            label="Event URL"
            name="eventUrl"
            rules={[
              { required: true, message: "Event URL is required" },
              { type: "url", message: "Please enter a valid URL" }
            ]}
          >
            <Input placeholder="Enter Event URL" />
          </Form.Item>

          <Form.Item
            label="Total Prize"
            name="totalPrize"
          >
            <Input placeholder="Enter Total Prize (optional)" />
          </Form.Item>

          <Form.Item
            name="isPublic"
            label="Is Public"
            valuePropName="checked"
          >
            <Checkbox>Is Public</Checkbox>
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <Button onClick={() => navigate("/cp/events")}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading} disabled={userRoleNum === 1}>
                {isEditMode ? "Update" : "Create"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}

