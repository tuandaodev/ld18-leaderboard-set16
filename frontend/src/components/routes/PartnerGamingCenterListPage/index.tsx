import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination, Select, Input } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import "../../../styles/landing.css";
import Footer from "../LandingPage/Footer";
import TopNavigation from "../LandingPage/TopNavigation";
import PageTitle from "../CommunityLeaderRegisterPage/PageTitle";
import {
  PartnerGamingCenterListContainer,
  ContentWrapper,
  SearchBar,
  SearchBarLeft,
  SearchBarRight,
  SearchInput,
  ActionButtons,
  ActionButton,
  ContentArea,
  LeftPanel,
  RightPanel,
  SelectedGamingCenterImage,
  SelectedGamingCenterInfo,
  SelectedGamingCenterName,
  SelectedGamingCenterAddress,
  SelectedGamingCenterHours,
  DetailsButton,
  TableContainer,
  TableContent,
  TableRow,
  TableCell,
  TableCellImageName,
  TableCellImage,
  TableCellName,
  GetDirectionsButton,
  PaginationWrapper,
  ProvinceSelectWrapper,
} from "./PartnerGamingCenterListPage.styles";
import useAxiosSWR from "@components/api/useAxiosSWR";
import { ENDPOINTS } from "@components/api/endpoints";
import { API_DOMAIN } from "@components/api/AxiosFetcher";
import { ProvinceDistrictResponse } from "types/endpoints/location";
import GamingCenterDetail from "./GamingCenterDetail";

interface GamingCenter {
  id: number;
  gamingCenterName: string;
  gamingCenterAddress: string;
  city: string;
  district: string;
  openingHour: string;
  closingHour: string;
  logoFile: string;
  contactPhone: string;
  email: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    total: number;
    page: number;
    pageSize: number;
    result: GamingCenter[];
    hasNext: boolean;
  };
}

export default function PartnerGamingCenterListPage() {
  const navigate = useNavigate();
  const [currPage, setCurrPage] = useState<number>(1);
  const [searchName, setSearchName] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined);
  const [selectedGamingCenter, setSelectedGamingCenter] = useState<GamingCenter | null>(null);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [debouncedSearchName, setDebouncedSearchName] = useState<string>("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Fetch province and districts data
  const { data: provinceData, isLoading: isLoadingProvinces } = useAxiosSWR<ProvinceDistrictResponse>(
    ENDPOINTS.getProvinceDistricts
  );

  // Fetch gaming centers
  const { data, error, isLoading, mutate } = useAxiosSWR<ApiResponse>(
    ENDPOINTS.getPagingAllPartnerGamingCenters,
    {
      params: {
        page: currPage,
        limit: 6,
        sortField: "createdAt",
        sortDesc: true,
        searchName: debouncedSearchName || undefined,
        province: selectedProvince || undefined,
      },
    }
  );

  // Extract provinces from data
  useEffect(() => {
    if (provinceData?.data) {
      const provinceList = provinceData.data.map(item => item.province);
      // Remove duplicates
      const uniqueProvinces = Array.from(new Set(provinceList));
      setProvinces(uniqueProvinces);
    }
  }, [provinceData]);

  // Debounce search name
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchName(searchName);
      setCurrPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchName]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set first gaming center as selected when data loads
  useEffect(() => {
    if (data?.data?.result && data.data.result.length > 0 && !selectedGamingCenter) {
      setSelectedGamingCenter(data.data.result[0]);
    }
  }, [data, selectedGamingCenter]);

  // Update selected gaming center when clicking on list item
  const handleSelectGamingCenter = (center: GamingCenter) => {
    setSelectedGamingCenter(center);
    // On mobile, open the detail modal instead of showing in left panel
    if (isMobile) {
      setIsDetailModalOpen(true);
    }
  };

  // Handle province change
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setCurrPage(1); // Reset to first page when filter changes
  };

  // Handle search name change
  const handleSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setCurrPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle get directions
  const handleGetDirections = (center: GamingCenter) => {
    const address = `${center.gamingCenterName}, ${center.gamingCenterAddress}, ${center.district}, ${center.city}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Handle details button
  const handleDetails = () => {
    if (selectedGamingCenter) {
      setIsDetailModalOpen(true);
    }
  };

  // Handle action buttons
  const handleGamingCenterEvents = () => {
    navigate('/events');
  };

  const handleRegisterPartner = () => {
    navigate('/register-partner-gaming-center');
  };

  // Get image URL
  const getImageUrl = (logoFile: string) => {
    if (!logoFile) return '';
    if (logoFile.startsWith('http')) return logoFile;
    return `${API_DOMAIN}${logoFile}`;
  };

  // Format time to HH:mm (remove seconds if present)
  const formatTime = (time: string) => {
    if (!time) return '';
    // If time is in HH:mm:ss format, extract HH:mm
    if (time.length >= 5) {
      return time.substring(0, 5);
    }
    return time;
  };

  const gamingCenters: GamingCenter[] = data?.data?.result || [];

  return (
    <PartnerGamingCenterListContainer style={{ minHeight: '80vh' }}>
      <TopNavigation />
      <ContentWrapper>
        <PageTitle>DANH SÁCH PHÒNG MÁY ĐỐI TÁC</PageTitle>

        <SearchBar>
          <SearchBarLeft>
            <ProvinceSelectWrapper>
              <Select
                placeholder="Tỉnh/Thành phố"
                suffixIcon={<DownOutlined />}
                value={selectedProvince}
                onChange={handleProvinceChange}
                allowClear
              >
                {provinces.map((province) => (
                  <Select.Option key={province} value={province}>
                    {province}
                  </Select.Option>
                ))}
              </Select>
            </ProvinceSelectWrapper>
            <SearchInput
              placeholder="Tìm kiếm theo tên"
              prefix={<SearchOutlined />}
              value={searchName}
              onChange={handleSearchNameChange}
              allowClear
            />
          </SearchBarLeft>
          <SearchBarRight>
            <ActionButtons>
              <ActionButton onClick={handleGamingCenterEvents}>
                SỰ KIỆN PHÒNG MÁY
              </ActionButton>
              <ActionButton onClick={handleRegisterPartner}>
                ĐĂNG KÝ TRỞ THÀNH ĐỐI TÁC
              </ActionButton>
            </ActionButtons>
          </SearchBarRight>
        </SearchBar>

        <ContentArea>
          <LeftPanel>
            {selectedGamingCenter ? (
              <>
                <SelectedGamingCenterImage
                  src={getImageUrl(selectedGamingCenter.logoFile)}
                  alt={selectedGamingCenter.gamingCenterName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
                  }}
                />
                <SelectedGamingCenterInfo>
                  <SelectedGamingCenterName>
                    {selectedGamingCenter.gamingCenterName}
                  </SelectedGamingCenterName>
                  <SelectedGamingCenterAddress>
                    Địa chỉ: {selectedGamingCenter.gamingCenterAddress}
                  </SelectedGamingCenterAddress>
                  <SelectedGamingCenterHours>
                    Giờ hoạt động: {formatTime(selectedGamingCenter.openingHour)} - {formatTime(selectedGamingCenter.closingHour)}
                  </SelectedGamingCenterHours>
                </SelectedGamingCenterInfo>
                <DetailsButton onClick={handleDetails}>
                  CHI TIẾT
                </DetailsButton>
              </>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#50483d' }}>
                Chọn một phòng máy để xem chi tiết
              </div>
            )}
          </LeftPanel>

          <RightPanel>
            {isLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#50483d', fontSize: 'clamp(1rem, 4.5vw, 1.5rem)' }}>
                Đang tải...
              </div>
            ) : error ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#ff4d4f', fontSize: 'clamp(1rem, 4.5vw, 1.5rem)' }}>
                Đã xảy ra lỗi khi tải dữ liệu
              </div>
            ) : gamingCenters.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#50483d', fontSize: 'clamp(1rem, 4.5vw, 1.5rem)' }}>
                Không có dữ liệu
              </div>
            ) : (
              <>
                <TableContainer>
                  <TableContent>
                    {gamingCenters.map((center) => (
                      <TableRow
                        key={center.id}
                        onClick={() => handleSelectGamingCenter(center)}
                        $isSelected={selectedGamingCenter?.id === center.id}
                      >
                        <TableCell>
                          <TableCellImageName>
                            <TableCellImage
                              src={getImageUrl(center.logoFile)}
                              alt={center.gamingCenterName}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/80x80?text=No+Image';
                              }}
                            />
                            <TableCellName>{center.gamingCenterName}</TableCellName>
                          </TableCellImageName>
                        </TableCell>
                        <TableCell>{center.city}</TableCell>
                        <TableCell style={{ justifyContent: 'end' }}>
                          <GetDirectionsButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGetDirections(center);
                            }}
                          >
                            DẪN ĐƯỜNG
                          </GetDirectionsButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableContent>
                </TableContainer>

                {data?.data?.total && data.data.total > 0 && (
                  <PaginationWrapper>
                    <Pagination
                      current={currPage}
                      total={data.data.total}
                      pageSize={6}
                      showSizeChanger={false}
                      showQuickJumper={false}
                      onChange={handlePageChange}
                    />
                  </PaginationWrapper>
                )}
              </>
            )}
          </RightPanel>
        </ContentArea>
      </ContentWrapper>
      <Footer />
      <GamingCenterDetail
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        gamingCenterId={selectedGamingCenter?.id || null}
      />
    </PartnerGamingCenterListContainer>
  );
}

