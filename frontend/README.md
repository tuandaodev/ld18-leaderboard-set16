# Frontend (Landing Page + Admin CMS Page)

```
# Endpoint backend dev
VITE_DEV_DOMAIN=http://localhost:8096

# Endpoint backend production
VITE_PRO_DOMAIN=https://khdh.vnggames.com/api

# Random string for encryption
VITE_ENCRYPTION_KEY="ljsdkf9328z0f8908f0fj2j2jf2jjzzzjkzjksjdlvm0svfasdvsa87r29fh2f92fijdksojvj2jf02jv2oi"
VITE_SIGNATURES_KEY="djkx471029384z71023984710297f827f8d878dfdhsjvnjvznvdnjanvldjanvdsavasdv4w=4gwvbwv3ivovbownvowiddf"

# Random string for encryption
VITE_TITLE_PWD=root
VITE_ACCESS_TITLE="1NSaWe3BxrnRqiK5DQ+Kp8d0dxLVH1hYm9p174VWT3UU/i7Wf3JSSUWiE/dd+IurV9c49doUUm0AC96+7elQXeXVw03ar15OTUZUTBlAJqd7p5wz5HLApAWOqpC070an"
VITE_REFRESH_TITLE="Qn/vDAYpH487rfKmQ4wMWuVkp7LxndcFAPoJ212hlFgnsjHt1Mhk9lvyHF8s37Zl4Yv4dk22DMlEllWTGQAxSNPJVxBzdxmIvNe/J4wrfsb0bgYqU/xVvbYBRhE38ncs"
VITE_LOGIN_INFO_TITLE="VpN+vONMmPJkBB0tb+rTYMobMZU1K8od9Oc+VPP8tg/xdJCtwg+mzWqSZKNu1ed03vPakA5R7lb+5+YcMswDqum6B4Ida1njN8fK+3KpTTARc9g/b3ryrjfUHo8oEfmq"
VITE_AUTH_STAT_TITLE="KO/FEqJaTWou2ZmyyPFsAdT1+8eMIaME47GPLvsxMFUZjYLf9Nf2c6W3BmCcECJDa2vxKC3diHjCFSgR0uytrevipb7Fvlj6ZOtfZLQYuZJUIRJHbBXV6khh3uiEzPUd"
```

Hướng dẫn deploy:
- Tạo file .env với nội dung như file .env mẫu, cập nhật biến VITE_PRO_DOMAIN là domain của API
- RUN: yarn
- RUN: yarn build (lúc này source code sẽ được build ra thư mục /dist)
- Upload toàn bộ thư mục `dist` vào thư mục `public_html`
- Dùng nginx để config cho thư mục admin

```
# API route
location /api/ {
    proxy_pass http://127.0.0.1:8096/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Frontend route
location / {
    try_files $uri $uri/ /index.html;
}
```