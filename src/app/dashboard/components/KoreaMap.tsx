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

function getColor(count?: number) {
    if (!count) return '#F5F5F5';
    if (count > 2500) return '#1B5E20';
    if (count > 1500) return '#2E7D32';
    if (count > 500) return '#66BB6A';
    return '#C8E6C9';
}

interface KoreaMapProps {
  onProvinceClick: (provinceName: string) => void;
  facilityCount: Record<string, number>,
  selectedProvince?: string;
}

export default function KoreaMap({onProvinceClick, selectedProvince, facilityCount} : KoreaMapProps) {
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
                            const count = facilityCount[province];
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