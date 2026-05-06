# =====================================================================
# 🌍 GLOBAL AUTO EXPORT PLATFORM
# Korea's #1 Used Car Export Platform
# =====================================================================

## 📋 프로젝트 구조

```
Mind Weather/
├── frontend/          # Next.js 14 (App Router)
│   ├── app/
│   │   ├── page.tsx           # 홈 페이지
│   │   ├── cars/              # 차량 목록 & 상세
│   │   ├── auth/              # 로그인 & 회원가입
│   │   ├── shipping/          # 해상 운임 계산기
│   │   ├── sell/              # 차량 등록 (5단계)
│   │   ├── admin/             # 어드민 대시보드
│   │   └── components/        # Navbar, Footer
│   └── lib/api.ts             # Axios API 클라이언트
│
├── backend/           # FastAPI + SQLAlchemy Async
│   ├── app/
│   │   ├── main.py            # FastAPI 진입점
│   │   ├── core/              # config, database, security
│   │   ├── models/            # ORM 모델
│   │   └── api/v1/endpoints/  # auth, vehicles, shipping...
│   └── alembic/               # DB 마이그레이션
│
├── docker-compose.yml  # PostgreSQL + Redis
└── .env.example        # 환경변수 템플릿
```

## 🚀 빠른 시작

### 1. 환경변수 설정
```bash
cp .env.example .env
# .env 파일에서 APP_DOMAIN, APP_WHATSAPP, DB 정보 등 수정
```

### 2. DB & Redis 실행
```bash
docker-compose up -d
```

### 3. 백엔드 실행
```bash
cd backend
pip install -r requirements.txt
# DB 마이그레이션
alembic upgrade head
# 개발 서버
uvicorn app.main:app --reload --port 8000
```

### 4. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

## 🌍 타겟 수출 시장 (실제 KITA 데이터 기반)

| 순위 | 국가 | 특징 | 인기 차종 |
|------|------|------|-----------|
| 🥇 | 🇱🇾 Libya | 대수 기준 1위, 가성비/내구성 | 디젤 SUV, 픽업 |
| 🥈 | 🇰🇬 Kyrgyzstan | 금액 기준 1위, 중계무역 허브 | 고가 AWD, $20K+ |
| 🥉 | 🇦🇪 UAE | 중동 럭셔리 시장 | 흰색, 럭셔리 |
| 4위 | 🇰🇿 Kazakhstan | 빠르게 성장 | SUV, 4WD |
| 5위 | 🇯🇴 Jordan | 안정적 수요 | 중간급 패밀리카 |

## ⚙️ 도메인 변경 방법

도메인 변경 시 **`.env` 파일 한 곳만** 수정:
```env
APP_DOMAIN=https://newdomain.com
APP_NAME=My Car Export
APP_WHATSAPP=+821012345678
```
→ 모든 URL, 메타태그, CORS 설정이 자동으로 반영됩니다.

## 🔐 환경변수 목록

| 변수 | 설명 | 예시 |
|------|------|------|
| `APP_DOMAIN` | 메인 도메인 | `https://autoexport.com` |
| `APP_NAME` | 사이트명 | `Korea Auto Export` |
| `APP_WHATSAPP` | WhatsApp 번호 | `+821012345678` |
| `APP_TELEGRAM` | 텔레그램 핸들 | `@autoexport_kr` |
| `DATABASE_URL` | PostgreSQL 연결 | `postgresql+asyncpg://...` |
| `JWT_SECRET_KEY` | JWT 서명키 (반드시 변경!) | (랜덤 문자열) |
| `AWS_ACCESS_KEY_ID` | S3 이미지 업로드 | AWS 콘솔에서 발급 |

## 📱 주요 기능

- ✅ 차량 목록 (필터: 제조사/연료/구동방식/지역/가격)
- ✅ 차량 상세 (EN/AR/RU 다국어 설명)
- ✅ 해상 운임 계산기 (14개 항구)
- ✅ WhatsApp/Telegram 즉시 문의
- ✅ 차량 등록 5단계 폼
- ✅ 어드민 대시보드 (통계/승인/관리)
- ✅ JWT 인증 (회원가입/로그인)
- ✅ RTL(아랍어) 지원

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, TypeScript, Vanilla CSS
- **Backend**: FastAPI, SQLAlchemy Async, Alembic
- **DB**: PostgreSQL 16, Redis 7
- **Auth**: JWT (Access + Refresh Token)
- **Storage**: AWS S3 (이미지)
- **Infra**: Docker, Vercel(FE), AWS EC2(BE), Cloudflare
