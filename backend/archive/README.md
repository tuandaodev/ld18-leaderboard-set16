1. Chuẩn bị file `.env`
2. Cập nhật thông tin
- Section: # SQL Database
- FRONTEND_URL
- BACKEND_URL
- RIOT_TOKEN - Token developer.riotgames.com để tính bảng xếp hạng

```
# Server
PORT=8098
TZ="Asia/Ho_Chi_Minh"
NODE_ENV="production"

# JWT 
JWT_SECRET="ljsdkf9328z0f8908f0fj2j2jf2jjzzzjkzjksjdlvm0svfasdvsa87r29fh2f92fijdksojvj2jf02jv2oi"
RF_PRIVATE_KEY="djkx471029384z71023984710297f827f8d878dfdhsjvnjvznvdnjanvldjanvdsavasdv4w=4gwvbwv3ivovbownvowiddf"

# Cryptography
BCRYPT_SALT_ROUNDS=12

# SQL Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=4(Hjy*s^r@rAFN^9
DB_NAME=tft_set16
DB_TEST_NAME=tft_set16_test

FRONTEND_URL="https://set16.freelancerhcm.com"
BACKEND_URL="https://set16.freelancerhcm.com/api"

# API Key
API_KEY=XJcPVnEIbStjVlhYyodq2atgmhjey1tr9BXOKvAsmYGuzNmy0JSjfH639xnJinFyJFIgSRA3uFPJ0d80PCTf7UqmGCEAzZxw8AiMWBwOwewv9jNFon9Puwuu9uOROaVW

# Riot API
RIOT_TOKEN=RGAPI-10e6d4d3-5a7c-4f4d-a415-39562f2aa39a
```
3. Chạy migration database
- yarn
- yarn build
- yarn run typeorm-migration

4. Cài đặt PM2 để monitor và tự động start api khi server restart (Bỏ qua nếu đã cài)
- npm install -g pm2
- pm2 startup

5. Chạy backend bằng pm2
- pm2 delete tft-set16-api (Không cần chạy nếu như lần đầu cài đặt app)
- yarn
- yarn build
- pm2 start "yarn serve" --name tft-set16-api
- pm2 save

6. Cài đặt pm2-watchdog để health check nếu chưa cài
- pm2 install ma-zal/pm2-watchdog   (Bỏ qua nếu đã cài)
- pm2 set pm2-watchdog:checking_interval 10     (Bỏ qua nếu đã cài)
- pm2 set pm2-watchdog:url-tft-set16-api http://localhost:8098/health