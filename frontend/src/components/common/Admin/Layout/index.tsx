import { Suspense, lazy, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";

import PageLoader from "../../PageLoader";
import { Wrapper } from "./style";
import "../../../../styles/admin.css";

const Navbar = lazy(() => import("../Navbar"));

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <Wrapper>
      <Helmet>
        <title>Nghịch Thuỷ Hàn - Kỳ Hiệp Đồng Hành - Admin Area</title>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      </Helmet>
      <Suspense fallback={<PageLoader />}>
        <Navbar />
      </Suspense>
      <main>{children}</main>
    </Wrapper>
  );
}
