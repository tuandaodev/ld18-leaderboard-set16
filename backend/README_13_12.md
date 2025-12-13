1. Giữ nguyên file `.env`

2. Chạy migration database
- yarn
- yarn build
- yarn run typeorm-migration

3. Chạy backend bằng pm2
- pm2 delete tft-set16-api (Không cần chạy nếu như lần đầu cài đặt app)
- yarn
- yarn build
- pm2 start "yarn serve" --name tft-set16-api
- pm2 save