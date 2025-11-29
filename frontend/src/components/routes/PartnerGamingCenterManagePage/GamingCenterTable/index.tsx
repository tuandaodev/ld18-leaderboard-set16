import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import useAxiosSWR from "../../../api/useAxiosSWR";
import { ENDPOINTS } from "../../../api/endpoints";
import PageTitle from "../../CommunityLeaderRegisterPage/PageTitle";
import GamingCenterDetailModal from "../GamingCenterDetailModal";
import {
  ActionButton,
  ActionButtonWrapper,
  ActionButtonWrapperMobile,
  InfoButton,
  PaginationWrapper,
  StatusText,
  TableCell,
  TableContainer,
  TableContent,
  TableContentContainer,
  TableHeader,
  TableRow,
  TableWrapper
} from "./GamingCenterTable.styles";

interface GamingCenter {
  id: number;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ApiGamingCenter {
  id: number;
  gamingCenterName: string;
  status: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    total: number;
    page: number;
    pageSize: number;
    result: ApiGamingCenter[];
    hasNext: boolean;
  };
}

export default function GamingCenterTable() {
  const navigate = useNavigate();
  const pageSize = 6;
  const [currPage, setCurrPage] = useState<number>(1);
  const [selectedGamingCenterId, setSelectedGamingCenterId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, error, isLoading, mutate } = useAxiosSWR<ApiResponse>(
    ENDPOINTS.getPagingCurrentUserPartnerGamingCenter,
    {
      params: {
        page: currPage,
        limit: pageSize,
        sortField: "id",
        sortDesc: true,
      },
    }
  );

  const handleRegisterClick = () => {
    navigate('/register-partner-gaming-center');
  };

  const handleViewInfo = (id: number) => {
    setSelectedGamingCenterId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGamingCenterId(null);
  };

  const handleUpdateSuccess = () => {
    // Refresh the table data
    mutate();
  };

  const getStatusText = (status: GamingCenter['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ duyệt';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      default:
        return '';
    }
  };

  const getStatusColor = (status: GamingCenter['status']) => {
    switch (status) {
      case 'pending':
        return '#50483d'; // Brown/black
      case 'approved':
        return '#52c41a'; // Green
      case 'rejected':
        return '#ff4d4f'; // Red
      default:
        return '#50483d';
    }
  };

  // Map API status number to component status string
  const mapApiStatusToComponentStatus = (status: number): GamingCenter['status'] => {
    switch (status) {
      case -1:
        return 'rejected';
      case 0:
        return 'pending';
      case 1:
        return 'approved';
      default:
        return 'pending';
    }
  };

  // Transform API data to component data
  const gamingCenters: GamingCenter[] = data?.data?.result?.map((item) => ({
    id: item.id,
    name: item.gamingCenterName,
    status: mapApiStatusToComponentStatus(item.status),
  })) || [];

  if (isLoading) {
    return (
      <TableWrapper>
        <TableContentContainer>
          <PageTitle>DANH SÁCH PHÒNG MÁY CỦA BẠN</PageTitle>
          <div>Đang tải...</div>
        </TableContentContainer>
      </TableWrapper>
    );
  }

  if (error) {
    return (
      <TableWrapper>
        <TableContentContainer>
          <PageTitle>DANH SÁCH PHÒNG MÁY CỦA BẠN</PageTitle>
          <div>Đã xảy ra lỗi khi tải dữ liệu</div>
        </TableContentContainer>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <TableContentContainer>
        <PageTitle>DANH SÁCH PHÒNG MÁY CỦA BẠN</PageTitle>
        
        <ActionButtonWrapper>
          <ActionButton onClick={handleRegisterClick}>
            ĐĂNG KÝ THÊM <br/> PHÒNG MÁY ĐỐI TÁC
          </ActionButton>
        </ActionButtonWrapper>

        <TableContainer>
          <TableHeader>
            <TableCell style={{ color: '#fff' }}>STT</TableCell>
            <TableCell style={{ color: '#fff' }}>TÊN</TableCell>
            <TableCell style={{ color: '#fff' }}>THÔNG TIN</TableCell>
            <TableCell style={{ color: '#fff' }}>TRẠNG THÁI</TableCell>
          </TableHeader>
          <TableContent>
            {gamingCenters.length === 0 ? (
              <TableRow>
                <TableCell style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              gamingCenters.map((center, index) => (
                <TableRow key={center.id}>
                  <TableCell className="index-col" data-label="STT">{(currPage - 1) * 5 + index + 1}</TableCell>
                  <TableCell data-label="TÊN">{center.name}</TableCell>
                  <TableCell data-label="THÔNG TIN">
                    <InfoButton onClick={() => handleViewInfo(center.id)}>
                      XEM/ CẬP NHẬT THÔNG TIN
                    </InfoButton>
                  </TableCell>
                  <TableCell data-label="TRẠNG THÁI" style={{ justifyContent: 'center' }}>
                    <StatusText $color={getStatusColor(center.status)}>
                      {getStatusText(center.status)}
                    </StatusText>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableContent>
        </TableContainer>

        {data?.data?.total && data.data.total > 0 && (
          <PaginationWrapper>
            <Pagination
              current={currPage}
              total={data.data.total}
              pageSize={pageSize}
              showSizeChanger={false}
              showQuickJumper={false}
              onChange={(page) => setCurrPage(page)}
            />
          </PaginationWrapper>
        )}

        <ActionButtonWrapperMobile>
          <ActionButton onClick={handleRegisterClick}>
            ĐĂNG KÝ THÊM <br/> PHÒNG MÁY ĐỐI TÁC
          </ActionButton>
        </ActionButtonWrapperMobile>

        <GamingCenterDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          gamingCenterId={selectedGamingCenterId}
          onUpdateSuccess={handleUpdateSuccess}
        />
      </TableContentContainer>
    </TableWrapper>
  );
}

