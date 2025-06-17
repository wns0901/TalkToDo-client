FROM node:22-alpine as build

ARG VITE_BASE_URL

ENV VITE_BASE_URL=${VITE_BASE_URL}

WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules/
RUN npm ci
COPY . .
COPY public ./public

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# SSL 인증서 디렉토리 생성
RUN mkdir -p /etc/nginx/ssl

# GitHub Secrets에서 SSL 인증서 생성
RUN --mount=type=secret,id=ssl_cert \
    --mount=type=secret,id=ssl_key \
    --mount=type=secret,id=ssl_ca \
    echo "SSL 인증서 복사 시작..." && \
    cp /run/secrets/ssl_cert /etc/nginx/ssl/certificate.crt && \
    cp /run/secrets/ssl_key /etc/nginx/ssl/private.key && \
    cp /run/secrets/ssl_ca /etc/nginx/ssl/ca_bundle.crt && \
    chmod 600 /etc/nginx/ssl/private.key && \
    chmod 644 /etc/nginx/ssl/*.crt && \
    echo "SSL 인증서 복사 완료" && \
    ls -la /etc/nginx/ssl/ && \
    echo "인증서 내용 확인:" && \
    head -5 /etc/nginx/ssl/certificate.crt

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]