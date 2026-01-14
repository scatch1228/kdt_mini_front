
import { FacilityType } from "@/type/FacilityType";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, Info, Map, MapIcon, MapPin, MessageSquare, Phone, Send, ShieldCheck, Star, Trophy } from "lucide-react";
import Link from "next/link";
import Review from "./components/Review";
import BackToSearch from "./components/BackToSearch";

interface FacilityDetailProps {
    params: Promise<{ fid: string }>
    onBack: () => void
}

export async function getFacilityDetail(fid: string): Promise<FacilityType | null> {
    if (!fid) return null;

    try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/facility/detail?fid=${encodeURIComponent(fid)}`;
        const resp = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            credentials: 'include',
        });

        if (resp.ok) {
            return await resp.json();
        }
        //console.error(`Error fetching province stats: ${resp.statusText}`);
        return notFound();
    } catch (error) {
        //console.error('Error fetching province stats:', error);
        return notFound();
    }
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-center gap-3">
        <div className="p-3 bg-gray-50 rounded-xl">
            {icon}
        </div>
        <div>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default async function FacilityDetail({ params }: FacilityDetailProps) {

    const { fid } = await params;
    const facility = await getFacilityDetail(fid);

    const name = facility?.name.replace(',', '').replace(' ', '').replace('?', '');

    const kakaoMapUrl = `https://map.kakao.com/link/map/${name},${facility?.lat},${facility?.lon}`;
    const naverMapUrl = `https://map.naver.com/v5/search${name}?c=${facility?.lon},${facility?.lat},15,0,0,0,dh`

    if (facility == undefined) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center gap-4">
                <BackToSearch />
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{facility.type}</span>
                        <h2 className="text-2xl font-extrabold text-gray-900">{facility.name}</h2>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 font-medium">
                        <MapPin size={14} /> {facility.fulladdr}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-100 lg:h-125">
                    <div className="p-4 border-b flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                            <MapPin size={16} className="text-blue-600" /> 시설 실물 지도
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{facility.lat.toFixed(4)}, {facility.lon.toFixed(4)}</span>
                    </div>
                    <div className="flex-1 bg-gray-100 relative">
                        <iframe
                            title="facility-map"
                            width="100%"
                            height="100%"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${facility.lon - 0.01}%2C${facility.lat - 0.01}%2C${facility.lon + 0.01}%2C${facility.lat + 0.01}&layer=mapnik&marker=${facility.lat}%2C${facility.lon}`}
                            className="grayscale-[0.2] contrast-[1.1]"
                        ></iframe>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-7 h-125">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pt-1 pb-4">
                            <Info size={18} className="text-blue-600" /> 시설 상세 정보
                        </h3>
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-7 gap-x-4 pb-7">
                                <InfoItem icon={<Phone className="text-gray-400" />} label="문의처" value={facility.tel ? facility.tel : "-"} />
                                <InfoItem icon={<Clock className="text-gray-400" />} label="준공년도" value={`${facility.createDate.slice(0, 4)}년`} />
                                <InfoItem icon={<ShieldCheck className="text-green-500" />} label="내진설계" value={facility.erdsgn == "Y" ? '적용' : '미적용'} />
                                <InfoItem icon={<Trophy className="text-yellow-500" />} label="시설 평점" value={`${facility.star.toFixed(1)} / 5.0`} />
                            </div>
                            <InfoItem icon={<Map className="text-purple-500" />} label="상세 주소" value={`${facility.fulladdr}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-t border-gray-100 pt-4">
                                <MapPin size={18} className="text-blue-600" /> 시설 찾아가기
                            </h3>
                            <div className="flex gap-4">
                                <Link href={kakaoMapUrl} target="_blank" className="bg-amber-300 hover:bg-amber-500 rounded-xl font-bold px-5 py-3 mt-5 transition-all" >카카오맵</Link>
                                <Link href={naverMapUrl} target="_blank" className="bg-green-300 hover:bg-green-500 rounded-xl font-bold px-5 py-3 mt-5 transition-all" >네이버맵</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Review fid={fid} star={facility.star}/>
        </div>
    );
}