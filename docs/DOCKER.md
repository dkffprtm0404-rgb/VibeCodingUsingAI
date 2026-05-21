# DOCKER.md — Docker 배포 가이드

## 구성 파일
```
Dockerfile          # 프로덕션 빌드
docker-compose.yml  # 로컬 Docker 실행
.dockerignore       # Docker 빌드 제외 파일
```

## 로컬 Docker 실행
```bash
# 빌드 + 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 중지
docker-compose down
```

## 프로덕션 빌드
```bash
# 이미지 빌드
docker build -t my-shop .

# 컨테이너 실행
docker run -p 3000:3000 my-shop
```

## 환경변수 주입
```bash
# docker-compose.yml에서 env_file로 주입
# 직접 실행 시
docker run -p 3000:3000 --env-file .env.production my-shop
```

## 포트
| 환경 | 포트 |
|------|------|
| 개발 (npm run dev) | 3000 |
| Docker 로컬 | 3000 |
| 프로덕션 | 80 / 443 |

## TODO (추후 추가 예정)
- [ ] Dockerfile 작성
- [ ] docker-compose.yml 작성
- [ ] .dockerignore 작성
- [ ] GitHub Actions CI/CD 연동
- [ ] Vercel 배포 연동
