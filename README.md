
* 2026-01-15 업데이트
 1. OAuth2 로그인 추가
   - 구글 로그인 추가
 2. "/search/detail" page 수정
   - review 조회, 추가, 삭제 로그인 인가 필요
 3. "/index" landing page 추가
   - 간략 이미지 및 내용 설명
 4. 로그인 인가 설정
   - 사용자 정보 사용을 위한 AuthContext.tsx 생성

* 2026-01-14 업데이트
 1. 로그인 여부 확인
   - cookies data 확인하여, 로그인 여부 판단
 2. "/search/detail" page 수정
   - review 작성 div 추가
   - 로그인 시 review 작성 가능. 로그인 되어있지않으면 input 블러 처리.
   - 리뷰 추가, 리뷰 삭제 구현 (작성한 사용자만 삭제 가능)
 3. "/dashboard" page 수정
   - 시설 검색 input 이벤트 추가.
 4. "/search" page 수정
   - detail page 이동 및 reload 시 filter 조건 유지
   - 시설명 검색 input event 추가
 5. "/signin" page 수정
   - 로그인 input event 추가

* 2026-01-12 업데이트
 1. backend 연동
   - "/signup" page post 작업 후, /signin 페이지 이동
   - "/signin" page post 작업 후, /index 페이지 이동
 2. "/signup" page 수정
   - username, password, alias의 패턴 입력 추가. 패턴 틀릴 시 바로 error문 출력
   - 회원가입 server action 추가
 3. "/signin" page 수정
   - server action => client fetch로 변경

* 2026-01-08 업데이트
 1. backend 연동
   - "/dashboard" page Card List
   - "/search" page Card List, Pagable

* 2026-01-05 업데이트
 1. backend 연동
   - "/dashboard" page 지도 색상(행정구역별 시설 count)
   - "/dashboard" page 행정 구역 간략정보(관할구역 갯수, 내진설계율 등)
   - "/dashboard" page 행정 구역 Chart 내역
   - "/dashboard" page 행정 구역 시설 노후도 Count
 2. "/dashboard" page 수정
   - 파이 차트 오류 수정 (높이 고정 값으로 설정)
   - gemini API 시설 안전 진단 Report 작성 컴포넌트 height 고정. (화면 흔들림 방지)
 3. "/dashboard" page Server Component 변경작업
   - 프로젝트 파일 따로 빼서 진행 중.


* 2025-12-31 업데이트
 1. backend 연동
   - "/dashboard" page 시설 점유율, 행정구역 조회 API 연결
 2. "/search" page 수정
   - 상세 검색 select box option 삽입


* 2025-12-30 업데이트
 1. "/dashboard" page 수정
    - 행정구역 (지도) 클릭 시 gemini 시설 통합 안전 진단, 시설 목록 List 이름 변경
    - 지도 provinces 수정 (지방자치단체 16개 -> 17개 최신화)

 2. "/search" page 수정
    - 검색 버튼 클릭 시, 시설 목록 List 띄우기
    - 상세검색 행정구역, 시설종목 option 추가
    - 검색 결과 Count 표기
