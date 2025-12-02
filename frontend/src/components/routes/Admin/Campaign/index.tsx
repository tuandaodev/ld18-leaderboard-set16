// libraries
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  GetProp,
  Input,
  Modal,
  Select,
  Table,
  TableProps,
  message
} from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

// types
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";
// manual
import { ENDPOINTS } from "@components/api/endpoints";
import useAxiosSWR, { fetcher } from "@components/api/useAxiosSWR";
import Layout from "@components/common/Admin/Layout";
import PageLoader from "@components/common/PageLoader";
import { cn, debounce, throttle } from "@lib/utils";

// styles
import { useAuth } from "@store/useAuth";

import { UploadProps } from "antd/es/upload";
import { format, parseISO } from "date-fns";
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { t } from "i18next";
import { FindAllCampaignsResponse } from "types/endpoints/campaign-find-all";
import { UpdateContentResponse } from "types/endpoints/content";
import { FindAllResponse, Result } from "types/endpoints/gift-code-item-find-all";
import {
  AccountSearchRow,
  AccountTableRow,
  AccountsWrapper,
  SearchCol,
} from "./style";
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

export default function Campaign() {
  // hooks
  const [currPage, setCurrPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data, error, isLoading, mutate } = useAxiosSWR<FindAllResponse>(
    ENDPOINTS.searchCampaigns,
    {
      params: { 
        page: currPage,
        pageSize: 10,
        sortField: "id",
        sortDesc: true,
        searchContent: searchQuery,
        startDate: startDate,
        endDate: endDate,
      },
    }
  );

  const { data: campaignsData, error: errorData, isLoading: isLoadingData, mutate: mutateItems } = useAxiosSWR<FindAllCampaignsResponse>(
    ENDPOINTS.findAllCampaigns,
    {}
  );

  const isMedium = useMediaQuery("(max-width: 1194px)");
  const userRoleNum = useAuth(({ data }) => data.role);
  const userData = useAuth(({ data }) => data);

  const [addCampaignForm] = Form.useForm();
  const [exportTopCreatorsForm] = Form.useForm();

  // states
  const [isScroll, setIsScroll] = useState(false);
  const [showPagTop, setShowPagTop] = useState(true);
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Result>>({});
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});
  const [renderData, setRenderData] = useState<Result[]>([]);
  const [isAddCampaignModal, setIsAddCampaignModal] = useState(false);
  const [isExportCreators, setIsExportCreators] = useState(false);
  
  const [currentId, setCurrentId] = useState(0);
  const [isEditReward, setIsEditReward] = useState(false);
  const [isGettingData, setIsGettingData] = useState(false);
  const [editRewardForm] = Form.useForm();

  useEffect(() => {
    if (isGettingData) {
      const fetchData = async () => {
        editRewardForm.resetFields();
        const response: { success: boolean, data: any } = await fetcher.get(
          ENDPOINTS.getCampaignDetail + "/" + currentId + "/detail",
        );
        if (response.success) {
          editRewardForm.setFieldsValue({
            campaignName: response.data.campaignName,
            startDate: dayjs(response.data.startDate),
            endDate: dayjs(response.data.endDate),
            isActive: response.data.isActive,
            isAllowSubmit: response.data.isAllowSubmit,
          });
          setIsEditReward(true);
        }
        setIsGettingData(false);
      };
      fetchData();
    }
  }, [isGettingData]);

  // effects
  useEffect(() => {
    if (!isLoading && !error && data) {
      setRenderData(data?.data?.result);
    }
  }, [data, error, isLoading, userData]);

  // methods
  const onAddCampaign = () => {
    setIsAddCampaignModal(true);
  };

  const onTableRowScroll = throttle(() => {
    if (!isLoading) {
      const tableRowElement = document.getElementById("table-row");
      if (tableRowElement && tableRowElement?.scrollTop >= 90) {
        if (!isScroll) setIsScroll(true);
      } else {
        if (isScroll) setIsScroll(false);
      }
    }
  }, 20);
  const handleTableChange: TableProps<Result>["onChange"] = (
    _,
    filters,
    sorter
  ) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Result>);
  };
  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currVal = event.target.value;
    setSearchQuery(event.target.value.trim());
    if (!currVal && data) {
      setRenderData(data?.data?.result);
    }
  };
  const dbOnSearchChange = debounce(onSearchChange, 100);
  const onSearchGifts = (value: string) => {
    setSearchQuery(value);
  };

  const handleExportTopCreators = async (values: Record<string, any>) => {
    try {
      const { campaignId, top } = values;

      // const response: any = await fetcher.post(
      //   ENDPOINTS.exportTopCreators,
      //   {
      //     campaignId: campaignId,
      //     top: top
      //   }
      // );

      message.success(t(`Bạn đã export top creators thành công`));

      // const BOM = "\uFEFF"; 
      // const blob = new Blob([`${BOM}${response}`], { type: 'text/csv' });
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'exported_top_creators.csv';
      // a.click();
      // window.URL.revokeObjectURL(url);
    } catch (error: any) {
      message.error(error?.response?.data?.error || t("Đã xảy lỗi"));
    }
  };

  const handleAddCampaign = async (values: Record<string, any>) => {
    try {
      const { campaignName, isActive, isAllowSubmit } = values;
      if (!campaignName) {
        message.error("Campaign name cannot be nulled");
        return;
      }

      const response: UpdateContentResponse = await fetcher.post(
        ENDPOINTS.addCampaign,
        {
          ...values,
          isActive: isActive,
          isAllowSubmit: isAllowSubmit,
          startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
        }
      );
      if (response.success === true) {
        message.success("Campaign is created successfully");
        mutate();
        setIsAddCampaignModal(false);
        addCampaignForm.resetFields();
      }
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.error || t("Đã xảy lỗi"));
    }
  };

  const handleUpdateCampaign = async (values: Record<string, any>) => {
    try {
      const { campaignName, startDate, endDate, isActive, isAllowSubmit } = values;
      const response: UpdateContentResponse = await fetcher.post(
        ENDPOINTS.updateCampaign,
        {
          id: currentId,
          campaignName,
          startDate: dayjs(startDate).format('YYYY-MM-DD'),
          endDate: dayjs(endDate).format('YYYY-MM-DD'),
          isAllowSubmit,
          isActive,
        }
      );
      if (response.success === true) {
        message.success("Campaign is updated successfully");
        setIsEditReward(false);
        editRewardForm.resetFields();
        mutate();
      }
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.error || t("Đã xảy lỗi"));
    }
  };

  // columns
  const columns: ColumnsType<Result> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      className: "expand-row",
    },
    {
      title: t("Campaign Name"),
      key: "itemId",
      render: ({ campaignName }) => (
        <p>{ campaignName }</p>
      ),
    },
    {
      title: t("Start Date"),
      key: "startDate",
      render: ({ startDate }) => {
        if (!startDate) return "";
        const date = parseISO(startDate);
        return format(date, 'dd/MM/yyyy HH:mm:ss');
      },
    },
    {
      title: t("End Date"),
      key: "endDate",
      render: ({ endDate }) => {
        if (!endDate) return "";
        const date = parseISO(endDate);
        return format(date, 'dd/MM/yyyy HH:mm:ss');
      },
    },
    {
      title: t("Is Active"),
      key: "isActive",
      render: ({ isActive }) => {
        return isActive ? "Active" : "Inactive";
      },
    },
    {
      title: t("Allow Submit"),
      key: "isAllowSubmit",
      render: ({ isAllowSubmit }) => {
        return isAllowSubmit ? "Allow" : "Disallow";
      },
    },
    {
      title: <p className="text-center">Action</p>,
      key: "action",
      width: 100,
      render: ({ id }) => ((
        <Button onClick={() => {setCurrentId(id); setIsGettingData(true)}}>
            Edit
        </Button>
      )
      ),
    },
  ];

  if (isLoading) return <PageLoader />;
  if (error) return <div>{error.message}</div>;

  return (
    <Layout>
      <AccountsWrapper>
        <AccountSearchRow>
          <SearchCol>
            <div className="search-wrapper">
              <Input.Search
                placeholder={t("Search by Campaign Name")}
                onChange={dbOnSearchChange}
                onSearch={onSearchGifts}
                defaultValue={searchQuery}
                enterButton
              />
            </div>
            <Button
              onClick={() => {
                setIsExportCreators(true);
                exportTopCreatorsForm.setFieldsValue({
                  top: 16
                });
              }}
              type="primary"
              disabled={userRoleNum === 1}
              style={{ marginLeft: 10 }}
            >
              Export Top Creators
            </Button>

            <Button
              onClick={onAddCampaign}
              type="primary"
              disabled={userRoleNum === 1}
            >
              Add Campaign
            </Button>
          </SearchCol>
        </AccountSearchRow>
        <AccountTableRow
          id="table-row"
          onScroll={onTableRowScroll}
          className={cn(isScroll && "is-scroll")}
        >
          <Table
            loading={isLoading}
            onChange={handleTableChange}
            size={isMedium ? "middle" : "large"}
            rowKey="id"
            dataSource={renderData}
            columns={columns}
            scroll={{ x: "max-content" }}
            pagination={{
              current: currPage,
              total: data?.data?.total,
              defaultPageSize: 10,
              pageSizeOptions: [10],
              position: ["bottomCenter"],
              onShowSizeChange: (_, size) => {
                if (size < 20) setShowPagTop(true);
                else setShowPagTop(false);
              },
              onChange: (currPage) => {
                setCurrPage(currPage);
              },
            }}
          />
        </AccountTableRow>
      </AccountsWrapper>

      <Modal
        centered
        width={400}
        onOk={() => { }}
        onCancel={() => {
          setIsAddCampaignModal(false);
          addCampaignForm.resetFields();
        }}
        footer={null}
        title="Add Campaign"
        open={isAddCampaignModal}
      >
        <Form
          form={addCampaignForm}
          style={{ width: "100%", marginBlock: "1rem" }}
          autoComplete="off"
          colon={false}
          layout="vertical"
          onValuesChange={(_, allValues) => {}}
          onFinish={handleAddCampaign}
        >

          <Form.Item
            label="Campaign Name"
            name="campaignName"
            rules={[{ required: true, message: "Campaign Name is required" }]}
          >
            <Input placeholder="Enter Campaign Name" />
          </Form.Item>

          <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: "Start Date is required" }]}
          >
              <DatePicker
                  format='DD/MM/YYYY'
                  placeholder='DD/MM/YYYY'
                  allowClear={false}
              />
          </Form.Item>

          <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: "End Date is required" }]}
          >
              <DatePicker
                  format='DD/MM/YYYY'
                  placeholder='DD/MM/YYYY'
                  allowClear={false}
              />
          </Form.Item>

          <Form.Item
              name="isActive"
              label="Is Active"
              valuePropName="checked"
          >
              <Checkbox>Is Active</Checkbox>
          </Form.Item>

          <Form.Item
              name="isAllowSubmit"
              label="Allow Submit"
              valuePropName="checked"
          >
              <Checkbox>Allow Submit</Checkbox>
          </Form.Item>

        </Form>
        <div style={{ width: "100%", textAlign: "center", marginTop: "2rem" }}>
          <Button
            type="primary"
            onClick={() => addCampaignForm.submit()}
          >
            { t("Đồng ý") }
          </Button>
        </div>
      </Modal>

      <Modal
        centered
        width={400}
        onOk={() => { }}
        onCancel={() => {
          setIsEditReward(false);
          editRewardForm.resetFields();
        }}
        footer={null}
        title="Update Config"
        open={isEditReward}
      >
        <Form
          form={editRewardForm}
          style={{ width: "100%", marginBlock: "1rem" }}
          autoComplete="off"
          colon={false}
          layout="vertical"
          onValuesChange={(_, allValues) => {}}
          onFinish={handleUpdateCampaign}
        >

<Form.Item
            label="Campaign Name"
            name="campaignName"
            rules={[{ required: true, message: "Campaign Name is required" }]}
          >
            <Input placeholder="Enter Campaign Name" />
          </Form.Item>

          <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: "Start Date is required" }]}
          >
              <DatePicker
                  format='DD/MM/YYYY'
                  placeholder='DD/MM/YYYY'
                  allowClear={false}
              />
          </Form.Item>

          <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: "End Date is required" }]}
          >
              <DatePicker
                  format='DD/MM/YYYY'
                  placeholder='DD/MM/YYYY'
                  allowClear={false}
              />
          </Form.Item>

          <Form.Item
              name="isActive"
              label="Is Active"
              valuePropName="checked"
              extra="Vui lòng giữ Campaign Active tối thiểu 1 ngày sau EndDate để job chạy bảng xếp hạng"
          >
              <Checkbox>Is Active</Checkbox>
          </Form.Item>

          <Form.Item
              name="isAllowSubmit"
              label="Allow Submit"
              valuePropName="checked"
          >
              <Checkbox>Allow Submit</Checkbox>
          </Form.Item>

        </Form>
        <div style={{ width: "100%", textAlign: "center", marginTop: "2rem" }}>
          <Button
            type="primary"
            onClick={() => editRewardForm.submit()}
          >
            { t("Đồng ý") }
          </Button>
        </div>
      </Modal>

      <Modal
        centered
        width={400}
        onOk={() => { }}
        onCancel={() => {
          setIsExportCreators(false);
          exportTopCreatorsForm.resetFields();
        }}
        footer={null}
        title="Export Top Creators"
        open={isExportCreators}
      >
        <Form
          form={exportTopCreatorsForm}
          style={{ width: "100%", marginBlock: "1rem" }}
          autoComplete="off"
          colon={false}
          layout="vertical"
          onValuesChange={(_, allValues) => {}}
          onFinish={handleExportTopCreators}
        >
          {/* <Form.Item
            label={t("Thời gian")}
            name="date"
            rules={[
              { required: true, message: "" },
            ]}
          >
            <DatePicker picker="month" />
          </Form.Item> */}

          <Form.Item
            label="Campaign"
            name="campaignId"
            rules={[{ required: true, message: "Campaign is required" }]}
          >
            <Select placeholder="Select item"  showSearch>
              {campaignsData?.data?.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.campaignName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Top"
            name="top"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter Top" />
          </Form.Item>

        </Form>
        <div style={{ width: "100%", textAlign: "center", marginTop: "2rem" }}>
          <Button
            type="primary"
            onClick={() => exportTopCreatorsForm.submit()}
          >
            { t("Đồng ý") }
          </Button>
        </div>
      </Modal>

    </Layout>
  );
}
