import { useState, useRef } from 'react';
import { Frame1Wrapper, ContentContainer, Column1, Column2, VideoPlayerContainer, VideoButtonContainer, VideoButton, CTAButton, TitleImage, DescImage } from "./Frame1.styles";
import titleImg from '../../../../img/f1/title.png';
import descImg from '../../../../img/f1/desc.png';
import ctaImg from '../../../../img/f1/cta.png';

interface Frame1Props {
  description?: string;
}

type VideoType = 'tong-quan' | 'ngoai-trang' | 'bang-tin';

interface VideoConfig {
  id: VideoType;
  label: string;
  url?: string;
  thumbnail?: string;
  externalUrl?: string;
}

const videoConfigs: VideoConfig[] = [
  { 
    id: 'tong-quan', 
    label: 'Tổng quan mùa 16', 
    url: 'https://set16.freelancerhcm.com/video/f1_1.mp4',
    thumbnail: 'https://set16.freelancerhcm.com/video/f1_1.png'
  },
  { 
    id: 'ngoai-trang', 
    label: 'Ngoại trang mới', 
    url: 'https://set16.freelancerhcm.com/video/f1_2.mp4',
    thumbnail: 'https://set16.freelancerhcm.com/video/f1_2.png'
  },
  { 
    id: 'bang-tin', 
    label: 'Bảng tin ĐTCL', 
    externalUrl: 'https://dtcl.vnggames.com/vi-vn/news/'
  },
];

export default function Frame1({ description }: Frame1Props) {
  const [activeVideo, setActiveVideo] = useState<VideoType>('tong-quan');
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videoConfigs.find(v => v.id === activeVideo) || videoConfigs[0];

  const handleVideoChange = (videoId: VideoType) => {
    const video = videoConfigs.find(v => v.id === videoId);
    
    // If this video has an external URL, open it in a new tab
    if (video?.externalUrl) {
      window.open(video.externalUrl, '_blank');
      return;
    }
    
    setActiveVideo(videoId);
    // Play the video when switching
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {
          // Autoplay was prevented, user will need to click
        });
      }
    }, 100);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <Frame1Wrapper id="home">
      <ContentContainer>
        <Column1>
          <VideoPlayerContainer>
            {currentVideo.url ? (
              <video 
                ref={videoRef}
                controls={false} 
                loop 
                muted 
                playsInline
                preload="none"
                poster={currentVideo.thumbnail}
                onClick={handleVideoClick}
                style={{ cursor: 'pointer' }}
              >
                <source src={currentVideo.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                fontSize: '1.2rem'
              }}>
                Video sẽ được cập nhật sớm
              </div>
            )}
          </VideoPlayerContainer>
          
          <VideoButtonContainer>
            {videoConfigs.map((video) => (
              <VideoButton
                key={video.id}
                active={activeVideo === video.id}
                onClick={() => handleVideoChange(video.id)}
              >
                {video.label}
              </VideoButton>
            ))}
          </VideoButtonContainer>
          
          <CTAButton onClick={() => {
            window.open('https://dtcl.vnggames.com/en-us/', '_blank');
          }}>
            <img src={ctaImg} alt="Vào Game Ngay" />
          </CTAButton>
        </Column1>

        <Column2>
          <TitleImage src={titleImg} alt="Title" />
          <DescImage src={descImg} alt="Description" />
        </Column2>
      </ContentContainer>
    </Frame1Wrapper>
  );
}