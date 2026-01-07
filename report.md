# 대시보드 코드 피드백 보고서

안녕하세요. 요청하신 대시보드 관련 소스 코드에 대한 피드백을 정리했습니다. 특히 무한 로딩 문제와 `useCallback` 사용에 초점을 맞추어 분석하고, Next.js App Router 환경에 맞는 최적의 해결책을 제안합니다.

## 요약 (TL;DR)

- **문제 원인**: 각 대시보드 컴포넌트(`ProvinceCnt` 등)가 개별적으로 Client Component(`'use client'`)로 동작하며, `useEffect` 내에서 직접 데이터를 fetching하고 있습니다. 이 구조는 여러 개의 API 요청을 순차적으로 발생시켜 로딩을 지연시키고, 의존성 배열 관리가 복잡해지면 무한 루프와 유사한 현상을 유발할 수 있습니다.
- **`useCallback`에 대한 피드백**: `useCallback`을 사용하여 함수 재생성을 방지하려는 시도는 좋습니다. 하지만 현재 구조에서는 근본적인 해결책이 아닙니다. 문제의 핵심은 '언제, 어디서' 데이터를 가져오느냐에 있기 때문입니다.
- **핵심 해결책**: 데이터 조회를 부모인 **Server Component (`/dashboard/page.tsx`)**에서 중앙 집중적으로 처리하고, 조회된 데이터를 자식 컴포넌트에 `props`로 전달하는 방식으로 변경해야 합니다. 이를 통해 클라이언트 측의 복잡성과 네트워크 부하를 획기적으로 줄일 수 있습니다.

---

## 1. 현재 구조의 문제점 상세 분석: 무한 로딩은 왜 발생했나?

현재 `ProvinceCnt.tsx`와 같은 컴포넌트는 다음과 같은 로직으로 동작합니다.

1.  컴포넌트가 렌더링됩니다.
2.  `useEffect`가 실행됩니다.
3.  `useEffect` 내부에서 `handleProvinceLoad` 함수를 호출합니다.
4.  `handleProvinceLoad` 함수는 백엔드 API에 데이터를 요청(`fetch`)합니다.
5.  데이터 수신 후 `useState`로 상태를 변경(`setTData`)합니다.
6.  상태가 변경되었으므로 컴포넌트가 다시 렌더링됩니다.

이 패턴 자체는 일반적인 React 패턴이지만, Next.js App Router 환경에서는 몇 가지 비효율을 초래합니다.

- **Request Waterfall**: 만약 대시보드에 4개의 컴포넌트가 있다면, 페이지 로딩 시 **최소 4번의 개별적인 API 요청**이 클라이언트에서 서버로 발생합니다. 이는 전체 페이지 로딩 시간을 늘리는 주범입니다.
- **복잡한 상태 관리**: 각 컴포넌트는 자신만의 로딩 및 데이터 상태를 가집니다. 이는 불필요한 코드 중복이며, 전체 대시보드의 로딩 상태를 통합적으로 관리하기 어렵게 만듭니다.
- **`useCallback`의 한계**: `useCallback(..., [city, onDataLoad])`을 사용하셨습니다. 만약 `onDataLoad` 함수가 부모 컴포넌트에서 매번 새로 생성되어 내려온다면, `useCallback`은 의도대로 동작하지 않고 `handleProvinceLoad` 함수는 계속 재생성되어 `useEffect`를 다시 트리거할 수 있습니다. 이처럼 의존성 관리가 조금만 잘못되어도 쉽게 무한 루프에 빠질 수 있습니다.

요약하자면, **`useCallback`은 증상을 완화하는 도구일 뿐, 클라이언트 측에서 각자 데이터를 조회하는 현재 아키텍처 자체가 문제의 근본 원인**입니다.

## 2. 제안: Next.js App Router에 최적화된 아키텍처

Next.js App Router의 가장 큰 장점 중 하나는 **Server Component**입니다. 서버에서 데이터를 모두 가져온 후, 렌더링 준비가 된 HTML만 클라이언트에 보내주어 초기 로딩 성능을 극대화할 수 있습니다.

아래와 같이 코드를 리팩토링하는 것을 강력히 권장합니다.

### Step 1: `page.tsx`를 `async` Server Component로 변경

부모 페이지 컴포넌트에서 모든 데이터 fetching을 담당합니다. `Promise.all`을 사용하면 여러 API 요청을 병렬로 처리하여 시간을 더욱 단축할 수 있습니다.

**`src/app/dashboard/page.tsx` (수정 후 예시)**
```typescriptreact
import { Suspense } from "react";
import ProvinceCnt from "./components/ProvinceCnt";
import KoreaMap from "./components/KoreaMap";
import FacilityChart from "./components/FacilityChart";
import SafetyPeriod from "./components/SafetyPeriod";
import Loading from "../loading";

// 여러 데이터를 불러오는 함수들을 actions.ts나 별도의 api.ts 파일에 정의
// 예시: export const getProvinceData = async (city) => { ... }
// 여기서는 가상의 함수를 사용합니다.
async function getProvinceData(city: string) {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/count/erdsgn?city=${encodeURIComponent(city)}`;
    const resp = await fetch(url, { cache: 'no-store' }); // Next.js의 fetch 사용
    if (!resp.ok) throw new Error('Failed to fetch province data');
    return resp.json();
}

// 다른 컴포넌트들을 위한 데이터 fetching 함수들...
// async function getMapData() { ... }
// async function getChartData() { ... }

export default async function Page() {
    // 1. 서버에서 모든 데이터를 병렬로 미리 조회합니다.
    // 기본 도시를 'seoul' 또는 다른 값으로 설정
    const defaultCity = 'seoul'; 
    const provinceData = await getProvinceData(defaultCity);
    // const [provinceData, mapData, chartData] = await Promise.all([
    //     getProvinceData(defaultCity),
    //     getMapData(),
    //     getChartData(),
    // ]);

    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* 2. 조회된 데이터를 props로 자식 컴포넌트에 전달합니다. */}
                <ProvinceCnt initialData={provinceData} />
                <Suspense fallback={<Loading />}>
                    {/* KoreaMap도 동일한 방식으로 데이터를 받아야 합니다. */}
                    <KoreaMap />
                </Suspense>
            </div>

            <div className="grid grid-cols-1">
                 <Suspense fallback={<Loading />}>
                    {/* FacilityChart도 데이터를 props로 받도록 수정합니다. */}
                    <FacilityChart />
                </Suspense>
            </div>
            <div className="grid grid-cols-1">
                 <Suspense fallback={<Loading />}>
                    <SafetyPeriod />
                </Suspense>
            </div>
        </div>
    );
}
```

### Step 2: 자식 컴포넌트를 'Dumb Component'로 변경

자식 컴포넌트는 더 이상 데이터 조회 로직을 가질 필요가 없습니다. 부모로부터 받은 `props`를 화면에 그리는 역할만 수행하는 간단한 컴포넌트가 됩니다. `useEffect`, `useState`, `useCallback`이 모두 사라져 코드가 매우 간결하고 예측 가능해집니다.

**`src/app/dashboard/components/ProvinceCnt.tsx` (수정 후 예시)**
```typescriptreact
'use client'; // 만약 클릭 등 상호작용이 필요하다면 유지, 아니면 삭제 가능

import React from "react";
import { Dumbbell, History, MapIcon, ShieldCheck } from 'lucide-react';

// StatBox 컴포넌트는 그대로 유지

type dataType = {
    number_of_guguns: number,
    city: string,
    city_count_total: number,
    erdsgn: number,
    avg_old: number,
};

interface ProvinceCntProps {
    initialData: dataType; // 서버에서 받은 초기 데이터를 props로 받음
}

// 이제 이 컴포넌트는 데이터를 직접 fetch하지 않습니다.
export default function ProvinceCnt({ initialData }: ProvinceCntProps) {
    // props로 받은 데이터를 기반으로 바로 계산
    const erdPercent = ((initialData.erdsgn / initialData.city_count_total) * 100).toFixed(1);

    return (
        <div className="flex flex-wrap gap-4">
            <StatBox icon={<Dumbbell />} label="총 시설수" value={`${initialData?.city_count_total.toLocaleString() ?? 0} 개`} color="blue" />
            <StatBox icon={<MapIcon />} label="관할 구역" value={`${initialData?.number_of_guguns.toLocaleString() ?? 0} 개 구역`} color="indigo" />
            <StatBox icon={<ShieldCheck />} label="내진설계율" value={`${erdPercent ?? "0"} %`} color="green" />
            <StatBox icon={<History />} label="평균 준공 연차" value={`${initialData?.avg_old ?? 0} 년`} color="orange" />
        </div>
    );
}
```

## 3. 기대 효과

- **성능 향상**: 모든 데이터 조회가 서버에서 최적화되어 한 번에 완료됩니다. 클라이언트는 완성된 페이지를 받기만 하므로 초기 로딩 속도(LCP)가 크게 개선됩니다.
- **안정성 증가**: `useEffect`의 복잡한 의존성 관리에서 벗어나므로 무한 루프의 위험이 원천적으로 사라집니다.
- **코드 단순화 및 유지보수 용이성**: 각 컴포넌트의 역할이 명확해지고(데이터 조회 vs. 렌더링), 중복 코드가 제거되어 관리가 편해집니다.
- **향상된 사용자 경험(UX)**: `Suspense`와 함께 사용하면, 전체 페이지가 아닌 준비된 컴포넌트부터 먼저 보여줄 수 있어 사용자가 느끼는 로딩 시간이 줄어듭니다.

## 결론 및 권장 사항

현재 겪고 계신 문제는 컴포넌트 분할 자체가 아니라, **Next.js App Router의 핵심 철학인 서버 중심의 데이터 조회를 따르지 않았기 때문에 발생한 아키텍처 문제입니다.**

아래 단계를 따라 리팩토링을 진행해 보시는 것을 추천합니다.

1.  대시보드에 필요한 모든 데이터 API를 정리합니다.
2.  `dashboard/page.tsx`를 `async` 함수로 변경하고, 1번에서 정리한 모든 API를 `Promise.all`로 호출하여 데이터를 가져옵니다.
3.  각 자식 컴포넌트(`ProvinceCnt` 등)에서 `useEffect`, `useState`, `useCallback` 등 데이터 조회 관련 코드를 모두 제거합니다.
4.  자식 컴포넌트들이 2번에서 조회한 데이터를 `props`로 받도록 수정합니다.

이 과정을 통해 더 빠르고 안정적이며 유지보수가 용이한 대시보드를 만드실 수 있을 것입니다.
