1. Chuẩn bị file `.env`
2. Cập nhật thông tin
- Section: # SQL Database
- Section: # SMTP Mail Cfg
- FRONTEND_URL
- BACKEND_URL

```
# Server
PORT=8096
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
DB_NAME=kyhiepdonghanh
DB_TEST_NAME=kyhiepdonghanh_test

# SMTP Mail Cfg
MAIL_ENDPOINT=smtp.gmail.com
MAIL_PORT=465
MAIL_SENDER=sample@gmail.com
MAIL_USERNAME=sample@gmail.com
MAIL_PASSWORD=passwordsample

FRONTEND_URL="https://khdh.freelancerhcm.com"
BACKEND_URL="https://khdh.freelancerhcm.com/api"
```
3. Chạy migration database
- yarn
- yarn build
- yarn run typeorm-migration

4. Cài đặt PM2 để monitor và tự động start api khi server restart (Bỏ qua nếu đã cài)
- npm install -g pm2
- pm2 startup

5. Chạy backend bằng pm2
- pm2 delete khdhapi (Không cần chạy nếu như lần đầu cài đặt app)
- yarn
- yarn build
- pm2 start "yarn serve" --name khdhapi
- pm2 save

6. Cài đặt pm2-watchdog để health check nếu chưa cài
- pm2 install ma-zal/pm2-watchdog   (Bỏ qua nếu đã cài)
- pm2 set pm2-watchdog:checking_interval 10     (Bỏ qua nếu đã cài)
- pm2 set pm2-watchdog:url-hlkapi http://localhost:8096/health