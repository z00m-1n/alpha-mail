# AlphaMail

AlphaMail은 휴가, 출장, 교육 등으로 자리를 비운 뒤 복귀한 직장인이 쌓인 업무 이메일을 빠르게 파악하고, 우선순위를 정리하고, 회신까지 준비할 수 있도록 돕는 AI 이메일 어시스턴트 프로토타입입니다.

이번 구현은 실제 Outlook, Gmail 연동 없이 동작하는 데모용 SaaS 웹 앱이며, 샘플 이메일 묶음을 기반으로 AI 브리핑 결과를 시연할 수 있도록 구성되어 있습니다.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Mock data 기반 분석 로직 + OpenAI API 연결 포인트 분리 구조

## Screens

- Onboarding: 제품 가치 소개 + 대시보드 기준 기간 선택
- Dashboard: 선택한 기간 기준 전체 메일 상황 요약 허브
- Mail Analyzer: 여러 이메일 선택, 통합 브리핑 분석, 대응 초안 생성
- Inbox View: 메일 목록 중심의 받은편지함 화면
- Action Center: 메일에서 추출한 액션 아이템 작업 보드

## Flow

1. 온보딩에서 기준 기간을 선택합니다.
2. 대시보드에서 오늘 처리할 일, 긴급 메일, 프로젝트 변화 요약을 확인합니다.
3. 각 카드나 목록을 눌러 여러 이메일이 미리 선택된 분석 화면으로 이동합니다.
4. 분석 화면에서 여러 메일을 묶어 AI 브리핑과 대응 초안을 생성합니다.

## Run

```bash
npm install
npm run dev
```

기본 진입 화면은 온보딩 페이지이며, 대시보드와 분석 화면, 인박스, 액션센터가 하나의 서비스 흐름으로 연결됩니다.

## AI API

OpenAI 연결을 붙일 때는 아래처럼 환경 변수를 추가하면 됩니다.

```bash
cp .env.example .env.local
```

```bash
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4.1-mini
```

키가 없으면 로컬 fallback 분석 로직으로 동작하고, 키가 있으면 /api/analyze, /api/reply 라우트가 OpenAI를 우선 호출합니다.