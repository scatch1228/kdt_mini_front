'use client';

import { useEffect, useState } from 'react';
import {
    ComposableMap,
    createLatitude,
    createLongitude,
    Geographies,
    Geography,
} from '@vnedyalk0v/react19-simple-maps';
import { feature } from 'topojson-client';

const facilityCountByProvince: Record<string, number> = {
    '서울특별시': 1200,
    '경기도': 3400,
    '부산광역시': 950,
    '인천광역시': 800,
    '대구광역시': 600,
    '광주광역시': 450,
    '대전광역시': 500,
    '울산광역시': 400,
    '충청북도': 250,
    '충청남도': 700,
    '전북특별자치도': 650,
    '전라남도': 350,
    '경상북도': 850,
    '경상남도': 900,
    '강원특별자치도': 3200,
    '제주특별자치도': 300,
    '세종특별자치시' : 400,
};

function getColor(count?: number) {
    if (!count) return '#F5F5F5';
    if (count > 2500) return '#1B5E20';
    if (count > 1500) return '#2E7D32';
    if (count > 500) return '#66BB6A';
    return '#C8E6C9';
}

interface KoreaMapProps {
  onProvinceClick: (provinceName: string) => void;
  selectedProvince?: string;
}

export default function KoreaMap({onProvinceClick, selectedProvince} : KoreaMapProps) {
    const [geoData, setGeoData] = useState<any>(null);

    useEffect(() => {
        fetch('/maps/skorea-provinces-topo-simple.json')
            .then((res) => res.json())
            .then((topology) => {
                const geoJson = feature(
                    topology,
                    topology.objects['skorea-provinces-geo']
                );
                setGeoData(geoJson);
            });
    }, []);

    if (!geoData) return <div>지도 로딩 중...</div>;

    const longitude = createLongitude(128.2);
    const latitude = createLatitude(36.3);

    return (
        <div className="">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    center: [longitude, latitude],
                    scale: 6000,
                }}
                width={700}
                height={800}
                style={{ width: '100%', height: 'auto' }}
            >
                <Geographies geography={geoData}>
                    {({ geographies }) =>
                        geographies.map((geo, idx) => {
                            const province = geo.properties?.name;
                            const count = facilityCountByProvince[province];
                            const isSelected = selectedProvince === province;

                            return (
                                <Geography
                                    key={`${province}-${idx}`}
                                    geography={geo}
                                    // fill={getColor(count)}/
                                    fill={isSelected ? '#FFB300' : getColor(count)}
                                    onClick={() => onProvinceClick(province)}
                                    stroke="#555"
                                    strokeWidth={0.8}
                                    style={{
                                        default: { outline: 'none' },
                                        hover: {
                                            fill: '#FFB300',
                                            outline: 'none',
                                            cursor: 'pointer',
                                        },
                                        pressed: {
                                            outline: 'none',
                                        },
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>
        </div>
    );
}