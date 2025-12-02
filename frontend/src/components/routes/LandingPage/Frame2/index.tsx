import { useEffect, useRef } from 'react';
import titleImg from '../../../../img/f2/title.png';
import titleDescImg from '../../../../img/f2/title_desc.png';
import col1Img from '../../../../img/f2/col1.png';
import btnCtaImg from '../../../../img/f2/btn_cta.png';
import btnThongTinImg from '../../../../img/f2/btn_thongtin.png';
import col2TextImg from '../../../../img/f2/col2_text.png';
import col3Img from '../../../../img/f2/col3.png';
import {
  Frame2Wrapper,
  FirstRow,
  SecondRow,
  TitleImage,
  TitleDescImage,
  Column1,
  Column2,
  Column3,
  Col1Image,
  Col1Button,
  Col2TextImage,
  VideoPlayerContainer,
  ThongTinButton,
  Col3Image,
} from './Frame2.styles';

export default function Frame2() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (!videoRef.current) return;

        if (entry.isIntersecting) {
          // Try to play when video comes into view
          videoRef.current.play().catch(() => {
            // Autoplay can be blocked; ignore the error
          });
        } else {
          // Pause when video leaves view
          videoRef.current.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.4,
    });

    observer.observe(videoEl);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Frame2Wrapper id="information">
      <FirstRow>
        <TitleImage src={titleImg} alt="Title" />
        <TitleDescImage src={titleDescImg} alt="Title Description" />
      </FirstRow>

      <SecondRow>
        <Column1>
          <Col1Image src={col1Img} alt="Column 1" />
          <Col1Button onClick={() => {
            window.open('https://dtcl.vnggames.com/vi-vn/', '_blank');
          }}>
            <img src={btnCtaImg} alt="Vào Nhận Ngay" />
          </Col1Button>
        </Column1>

        <Column2>
          <Col2TextImage src={col2TextImg} alt="Column 2 Text" />
          <VideoPlayerContainer>
            <video 
              ref={videoRef}
              controls={false} 
              playsInline
              preload="none"
              poster={'video/f2.png'}
              onClick={handleVideoClick}
              style={{ cursor: 'pointer' }}
            >
              <source src="video/f2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </VideoPlayerContainer>
          <ThongTinButton onClick={() => {
            window.open('https://dtcl.vnggames.com/vi-vn/news/game-updates/lore-and-legends-overview/', '_blank');
          }}>
            <img src={btnThongTinImg} alt="Thông tin cơ chế Mở Khoá" />
          </ThongTinButton>
        </Column2>

        <Column3>
          <Col3Image src={col3Img} alt="Column 3" />
        </Column3>
      </SecondRow>
    </Frame2Wrapper>
  );
}
