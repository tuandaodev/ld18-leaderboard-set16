// libraries
import { QuestionCircleOutlined } from "@ant-design/icons";
import useAxiosSWR, { fetcher } from "@components/api/useAxiosSWR";
import { Card, Form, Modal, Select, Tooltip, message } from "antd";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

// manual

import PageLoader from "@components/common/PageLoader";
import { COLORS, FRONTEND_LANGUAGES } from "@lib/constants";
import SelectControl from "./SelectControl";
import TextInputControl from "./TextInputControl";
import TextAreaControl from "./TextAreaControl";

// styles
import { ENDPOINTS } from "@components/api/endpoints";
import Layout from "@components/common/Admin/Layout";
import { t } from "i18next";
import { GetAllContentConfig, UpdateContentResponse } from "types/endpoints/content";
import { HomeWrapper } from "./style";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface LayoutType {
  labelCol: { span: number };
  wrapperCol: { span: number };
}

export interface CurrentWeekData {
  isAllowedToBook: boolean;
  weekDayGameFormat: string;
  weekendGameFormat: string;
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

  // Get Content
  const { data, error, isLoading, mutate } = useAxiosSWR<GetAllContentConfig>(
    ENDPOINTS.findAllContentConfigsForAdmin
  );

  const [modal2Open, setModal2Open] = useState(false);
  const [modalData, setModalData] = useState<JSX.Element | null>(null);
  const [modalFunction, setModalFunction] = useState<JSX.Element | null>(null);

  // Handling Loading and Error
  if (isLoading) return <PageLoader />;
  if (error) return <div>Error occurred</div>;

  // Sort all items by order to render them in the correct order, mixing all control types
  const allItemsSorted = data?.data
    ?.sort((a, b) => a.order - b.order) || [];

  // Group items by contentGroup
  const groupedItems = allItemsSorted.reduce((acc, item) => {
    const groupKey = item.contentGroup || "Ungrouped";
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, typeof allItemsSorted>);

  // Get group keys sorted by the first item's order in each group
  const groupKeys = Object.keys(groupedItems).sort((a, b) => {
    const aFirstOrder = groupedItems[a][0]?.order ?? 0;
    const bFirstOrder = groupedItems[b][0]?.order ?? 0;
    return aFirstOrder - bFirstOrder;
  });

  // Helper function to render a control based on its type
  const renderControl = (item: typeof allItemsSorted[0]) => {
    let controlComponent = null;

    if (item.controlType === "textinput") {
      controlComponent = (
        <TextInputControl
          isMedium={isMedium}
          setModalData={setModalData}
          setModalFunction={setModalFunction}
          setModal2Open={setModal2Open}
          modifyContentConfig={modifyContentConfig}
          data={item}
          langCode={langCode}
        />
      );
    } else if (item.controlType === "select") {
      controlComponent = (
        <SelectControl
          isMedium={isMedium}
          setModalData={setModalData}
          setModalFunction={setModalFunction}
          setModal2Open={setModal2Open}
          modifyContentConfig={modifyContentConfig}
          data={item}
          langCode={langCode}
        />
      );
    } else if (item.controlType === "textarea") {
      controlComponent = (
        <TextAreaControl
          isMedium={isMedium}
          setModalData={setModalData}
          setModalFunction={setModalFunction}
          setModal2Open={setModal2Open}
          modifyContentConfig={modifyContentConfig}
          data={item}
          langCode={langCode}
        />
      );
    }

    if (!controlComponent) return null;

    return (
      <div key={item.contentId} style={{ width: '100%', marginBottom: '1rem' }}>
        {controlComponent}
      </div>
    );
  };

  const modifyContentConfig = async (
    contentId: string,
    langCode: string,
    value: string | null,
    image: File | null
  ) => {
    console.log(image);
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

          {/* Render controls grouped by contentGroup */}
          {groupKeys.map((groupKey) => (
            <div key={groupKey} style={{ marginBottom: '2rem', width: '100%' }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '20px', fontWeight: 'bold' }}>
                {groupKey}
              </h2>
              {groupedItems[groupKey].map((item) => renderControl(item))}
            </div>
          ))}

        </Card>
      </HomeWrapper>
    </Layout>
  );
}
