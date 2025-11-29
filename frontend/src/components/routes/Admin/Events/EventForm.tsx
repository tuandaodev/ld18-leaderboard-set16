// libraries
import {
  Button,
  Checkbox,
  Form,
  GetProp,
  Input,
  InputNumber,
  Upload,
  UploadProps,
  message
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// manual
import { fetcher } from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import Layout from "@components/common/Admin/Layout";
import PageLoader from "@components/common/PageLoader";
import { useAuth } from "@store/useAuth";
import { UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import { t } from "i18next";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const domain = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_DOMAIN! || ""
  : import.meta.env.VITE_PRO_DOMAIN! || "";

interface EventResult {
  id: number;
  eventName: string;
  bannerFile: string;
  eventUrl: string;
  isPublic: boolean;
  priority: number;
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
  const userRoleNum = useAuth(({ data }) => data.role);

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
              eventUrl: response.data.eventUrl || "",
              isPublic: response.data.isPublic,
              priority: response.data.priority || 0,
            });
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
      const { eventName, eventUrl, isPublic, priority } = values;
      
      if (!eventName) {
        message.error("Please fill in all required fields");
        return;
      }

      if (!isEditMode && !bannerFile) {
        message.error("Please upload a banner image");
        return;
      }

      const formData = new FormData();
      formData.append("eventName", eventName);
      formData.append("eventUrl", eventUrl || "");
      formData.append("isPublic", isPublic ? "true" : "false");
      formData.append("priority", priority ? priority.toString() : "0");
      
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
            name="isPublic"
            label="Is Public"
            valuePropName="checked"
          >
            <Checkbox>Is Public</Checkbox>
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: false }]}
          >
            <InputNumber 
              placeholder="Enter Priority (default: 0)" 
              min={0}
              style={{ width: "100%" }}
            />
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

