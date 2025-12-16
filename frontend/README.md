Hướng dẫn deploy:
- Giữ nguyên .env hiện tại
- RUN: yarn
- RUN: yarn build (lúc này source code sẽ được build ra thư mục /dist)
- Upload toàn bộ thư mục `dist` vào thư mục `public_html`
- (Bỏ qua nếu còn folder video) Download video zip: https://set16.freelancerhcm.com/tft_set_16_videos.zip, upload các files và videos vào thư mục `/public_html/video`. Ví dụ: `/public_html/video/f1_1.mp4`