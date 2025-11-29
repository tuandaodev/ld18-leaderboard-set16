import BaseModal from "../../../common/BaseModal";
import {
  TableHeader,
  TableCell,
  TableContent,
  TableRow,
} from "./Frame3.styles";
import { API_DOMAIN } from "@components/api/AxiosFetcher";
import { useMemo } from "react";

interface LeaderboardItem {
  id: number;
  fullName: string;
  avatar: string | null;
  totalPoint: number;
}

interface RankingTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LeaderboardItem[] | undefined;
}

export default function RankingTableModal({
  isOpen,
  onClose,
  data,
}: RankingTableModalProps) {
  // Ensure stable data to render
  const rows = useMemo(() => data ?? [], [data]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      width={{ xs: "100%", sm: "95%", md: 700, lg: 800 }}
    >
      <div style={{ width: "100%" }}>
        <TableHeader>
          <TableCell style={{ whiteSpace: "nowrap" }}>STT</TableCell>
          <TableCell style={{ whiteSpace: "nowrap" }}>THỦ LĨNH CỘNG ĐỒNG</TableCell>
          <TableCell style={{ whiteSpace: "nowrap" }}>ĐIỂM HOẠT ĐỘNG</TableCell>
        </TableHeader>
        <TableContent>
          {rows.map((leader, index) => {
            const rank = index + 1;
            return (
              <TableRow key={leader.id} $isEven={index % 2 === 0}>
                <TableCell>{rank}</TableCell>
                <TableCell>{leader.fullName}</TableCell>
                <TableCell>
                  {leader.totalPoint?.toLocaleString("vi-VN") || "0"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableContent>
      </div>
    </BaseModal>
  );
}






