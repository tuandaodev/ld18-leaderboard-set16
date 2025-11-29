// libraries
import { QuestionCircleOutlined } from "@ant-design/icons";
import useAxiosSWR, { fetcher } from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import { Card, Form, Modal, Select, Tooltip, message } from "antd";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

// types
import { ContentItem, GetAllContentConfig, UpdateContentResponse } from "types/endpoints/current-week";

// manual
import Layout from "@components/common/Admin/Layout";

import PageLoader from "@components/common/PageLoader";
import { COLORS, FRONTEND_LANGUAGES } from "@lib/constants";
import TextControl from "./TextControl";
import ImageControl from "./ImageControl";

// styles
import { t } from "i18next";
import { HomeWrapper } from "./style";
import TextInputControl from "./TextInputControl";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface LayoutType {
  labelCol: { span: number };
  wrapperCol: { span: number };
}

export default function Dashboard() {
  //  api
  const [messageApi, contextHolder] = message.useMessage();

  //state
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const [langCode, setLangCode] = useState<string>("vi");
  const isMedium = useMediaQuery("(max-width: 1194px)");

  // Get Current Week
  const { data, error, isLoading, mutate } = useAxiosSWR<GetAllContentConfig>(
    ENDPOINTS.findAllContentConfigsForAdmin
  );

  const [modal2Open, setModal2Open] = useState(false);
  const [modalData, setModalData] = useState<JSX.Element | null>(null);
  const [modalFunction, setModalFunction] = useState<JSX.Element | null>(null);

  const [f1Description, setF1Description] = useState<ContentItem | undefined>(undefined);
  const [f2ProgramInfo, setF2ProgramInfo] = useState<ContentItem | undefined>(undefined);
  const [f2AvatarImage, setF2AvatarImage] = useState<ContentItem | undefined>(undefined);
  const [f4Description, setF4Description] = useState<ContentItem | undefined>(undefined);
  const [f4CtaUrl, setF4CtaUrl] = useState<ContentItem | undefined>(undefined);

  // Call the function with the current state value
  useEffect(() => {
    if (!isLoading && !error && data) {
      setF1Description(data?.data?.find((item) => item.contentId === 'f1_description'));
      setF2ProgramInfo(data?.data?.find((item) => item.contentId === 'f2_program_info'));
      setF2AvatarImage(data?.data?.find((item) => item.contentId === 'f2_avatar_image'));
      setF4Description(data?.data?.find((item) => item.contentId === 'f4_description'));
      setF4CtaUrl(data?.data?.find((item) => item.contentId === 'f4_cta_url'));
    }
  }, [data, error, isLoading]);

  // Handling Loading and Error
  if (isLoading) return <PageLoader />;
  if (error) return <div>Error occurred</div>;

  const modifyContentConfig = async (
    contentId: string,
    langCode: string,
    value: string | null,
    image: File | null
  ) => {
    try {
      const formData = new FormData();
      formData.append("contentId", contentId);
      formData.append("langCode", langCode);
      formData.append("value", value || "");
      if (image) {
        formData.append("contentFile", image);
      }
      const response: UpdateContentResponse = await fetcher.post(
        ENDPOINTS.updateContentConfigForAdmin,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.success === true) {
        messageApi.success("Content is updated successfully");
        mutate();
      }
    } catch (error) {
      messageApi.error("Error occurred");
    }
  };

  const handleLangCodeChange = (value: string) => {
    setLangCode(value)
    mutate()
  }

  return (
    <Layout>
      {contextHolder}
      <Modal
        centered
        width={400}
        onOk={() => {}}
        onCancel={() => {
          setModalData(null);
          setModal2Open(false);
          setModalFunction(null);
        }}
        footer={
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: "2rem",
              display: "flex",
              justifyContent: "end",
            }}
          >
            {modalFunction}
          </div>
        }
        title={
          <span
            style={{
              fontSize: "20px",
              color: COLORS.VALORANT.BLACK,
              marginRight: "0.5rem",
            }}
          >
            Thay đổi nội dung
          </span>
        }
        open={modal2Open}
      >
        {modalData}
      </Modal>

      <HomeWrapper>
        <Card
          title="Nội dung"
          bordered={true}
          extra={
            <Tooltip placement="top" title={"Chỉnh nội dung ở đây"}>
              <QuestionCircleOutlined />
            </Tooltip>
          }
          style={{ boxShadow: "0 0 20px 5px #37383315" }}
        >

          <Form
              colon={false}
              {...layout}
              name="langControl"
              onFinish={() => {
              }}
              style={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '1rem' }}
          >
            <Form.Item
              label={t("Ngôn ngữ")}
              style={{ width: '100%', justifyContent: 'space-between', }}
            >
              <Select
                placeholder="Filter by language"
                onChange={handleLangCodeChange}
                style={{ width: 150, marginLeft: 10 }}
                allowClear
                defaultValue={langCode}
                options={[
                  // { label: 'Default', value: 'df' },
                  ...FRONTEND_LANGUAGES.map(lang => ({ label: lang.label, value: lang.code }))
                ]}
              >
              </Select>
            </Form.Item>
          </Form>

          <TextInputControl
            isMedium={isMedium}
            setModalData={setModalData}
            setModalFunction={setModalFunction}
            setModal2Open={setModal2Open}
            modifyContentConfig={modifyContentConfig}
            data={f1Description}
            langCode={langCode}
          />

          <TextControl
            isMedium={isMedium}
            setModalData={setModalData}
            setModalFunction={setModalFunction}
            setModal2Open={setModal2Open}
            modifyContentConfig={modifyContentConfig}
            data={f2ProgramInfo}
            langCode={langCode}
          />

          <ImageControl
            isMedium={isMedium}
            setModalData={setModalData}
            setModalFunction={setModalFunction}
            setModal2Open={setModal2Open}
            modifyContentConfig={modifyContentConfig}
            data={f2AvatarImage}
            langCode={langCode}
          />

          <TextInputControl
            isMedium={isMedium}
            setModalData={setModalData}
            setModalFunction={setModalFunction}
            setModal2Open={setModal2Open}
            modifyContentConfig={modifyContentConfig}
            data={f4Description}
            langCode={langCode}
          />

          <TextInputControl
            isMedium={isMedium}
            setModalData={setModalData}
            setModalFunction={setModalFunction}
            setModal2Open={setModal2Open}
            modifyContentConfig={modifyContentConfig}
            data={f4CtaUrl}
            langCode={langCode}
          />
          
        </Card>
      </HomeWrapper>
    </Layout>
  );
}
