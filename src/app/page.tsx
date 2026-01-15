'use client'

import FeatureItem from "@/components/FeatureItem";
import { ArrowRight, LayoutDashboard, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const slide_images = [
  '/public_sports1.jpg',
  '/public_sports2.jpg',
  '/public_sports3.jpg',
  '/public_sports4.jpg'
];

export default function LandingPage() {

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slide_images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-16 py-8 animate-in fade-in duration-700">
      <section className="flex flex-col lg:flex-row items-start gap-12">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold border border-blue-100">
            <Sparkles size={16} /> 전국 공공체육시설 통합 플랫폼
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
            대한민국 모든 <br />
            <span className="text-blue-600">공공체육의 시작</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-lg">
            전국 17,000여 개의 공공체육시설 정보를 한곳에 모았습니다. <br />
            내 주변의 시설을 찾고, AI 분석을 통해 더 안전하게 이용하세요.
          </p>
          <Link href={"/dashboard"}
            className="flex flex-wrap gap-4 w-54">
            <div
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-2 text-lg"
            >
              지금 시작하기 <ArrowRight size={22} />
            </div>
          </Link>
        </div>

        <div className="flex-1 w-full max-w-2xl relative">
          <div className="aspect-video bg-gray-100 rounded-[40px] shadow-2xl overflow-hidden relative group">
            {slide_images.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="absolute inset-0 bg-black/20 z-10"></div>
                <img
                  src={img}
                  alt={`Slide ${idx}`}
                  className="w-full h-full object-cover transform scale-105"
                />
              </div>
            ))}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slide_images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
            <div className="absolute top-6 left-6 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white z-20">
              <p className="text-[10px] font-bold opacity-70 mb-1 uppercase tracking-widest">Live Updates</p>
              <p className="text-xs font-bold">전국 17,248개 시설 연동 완료</p>
            </div>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <FeatureItem
          icon={<LayoutDashboard size={24} />}
          title="직관적인 대시보드"
          desc="전국 지역별 시설 분포와 통계를 한눈에 시각화하여 보여줍니다."
        />
        <FeatureItem
          icon={<Sparkles size={24} />}
          title="AI 안전 분석"
          desc="내진 설계 및 노후도를 분석하여 신뢰할 수 있는 이용 가이드를 제공합니다."
        />
        <FeatureItem
          icon={<Search size={24} />}
          title="정밀 시설 탐색"
          desc="종목, 지역, 편의시설별로 당신에게 꼭 맞는 시설을 빠르게 찾아보세요."
        />
      </section>
    </div>
  );
}
