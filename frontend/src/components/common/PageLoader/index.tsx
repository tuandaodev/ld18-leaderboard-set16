import { Spin } from "antd";
import { Wrapper } from "./style";

export default function PageLoader() {
  return (
    <Wrapper>
      <Spin spinning={true} fullscreen size="large" delay={0} />
    </Wrapper>
  );
}
