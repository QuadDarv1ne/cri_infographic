'use client'

import { useMemo } from 'react'

interface RoomPreviewProps {
  cri: number
  temperature: number
}

// Adjust a hex color based on CRI and temperature
function adjustColor(hex: string, cri: number, temperature: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const criFactor = cri / 100
  
  let tempShiftR = 0
  let tempShiftG = 0
  let tempShiftB = 0

  if (temperature <= 3200) {
    tempShiftR = 35
    tempShiftG = 10
    tempShiftB = -30
  } else if (temperature <= 5000) {
    tempShiftR = 5
    tempShiftG = 5
    tempShiftB = 0
  } else {
    tempShiftR = -15
    tempShiftG = -5
    tempShiftB = 30
  }

  const gray = (r + g + b) / 3
  const desaturation = 1 - criFactor

  const nr = Math.max(0, Math.min(255, Math.round((r * (1 - desaturation * 0.7) + gray * desaturation * 0.7) + tempShiftR * (0.5 + criFactor * 0.5))))
  const ng = Math.max(0, Math.min(255, Math.round((g * (1 - desaturation * 0.7) + gray * desaturation * 0.7) + tempShiftG * (0.5 + criFactor * 0.5))))
  const nb = Math.max(0, Math.min(255, Math.round((b * (1 - desaturation * 0.7) + gray * desaturation * 0.7) + tempShiftB * (0.5 + criFactor * 0.5))))

  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`
}

// Get the ambient light color for the room
function getAmbientColor(temperature: number, cri: number): string {
  const alpha = 0.15 + (1 - cri / 100) * 0.1
  if (temperature <= 3200) return `rgba(255, 180, 107, ${alpha})`
  if (temperature <= 5000) return `rgba(255, 244, 224, ${alpha * 0.7})`
  return `rgba(201, 232, 255, ${alpha})`
}

export default function RoomPreview({ cri, temperature }: RoomPreviewProps) {
  // ALL color calculations in useMemo to avoid recalculating on every render
  const objects = useMemo(() => {
    const c = (hex: string) => adjustColor(hex, cri, temperature)
    return {
      // Fruit bowl
      apple: c('#e53e3e'),
      orange: c('#ed8936'),
      banana: c('#ecc94b'),
      grape: c('#805ad5'),
      bowl: c('#8b5e3c'),
      bowlInner: c('#a0703c'),
      // Plant
      leaf1: c('#38a169'),
      leaf2: c('#2f855a'),
      pot: c('#c4854c'),
      potRim: c('#d4955c'),
      stem1: c('#2d6a4f'),
      stem2: c('#2d6a4f'),
      // Painting
      sky: c('#63b3ed'),
      grass: c('#48bb78'),
      sun: c('#f6e05e'),
      paintingFrame: c('#8b5e3c'),
      // Walls & floor
      wall: c('#e2d8cc'),
      floor: c('#a0845c'),
      floorLine: c('#7a6543'),
      // Furniture
      table: c('#6b4e2e'),
      tableLeg: c('#5c3d1e'),
      ceiling: c('#d1d5db'),
      // Skin tone & clothes
      skin: c('#e8b89d'),
      clothes: c('#4a5568'),
      // Light color
      lightColor: temperature <= 3200 ? '#ffb46b' : temperature <= 5000 ? '#fff4e0' : '#c9e8ff',
    }
  }, [cri, temperature])

  const ambientColor = useMemo(() => getAmbientColor(temperature, cri), [temperature, cri])
  
  const criLabel = cri >= 80 ? 'Отличная цветопередача' : cri >= 60 ? 'Хорошая цветопередача' : cri >= 40 ? 'Приемлемая цветопередача' : 'Плохая цветопередача'
  const tempLabel = temperature <= 3200 ? 'Тёплый свет' : temperature <= 5000 ? 'Нейтральный свет' : 'Холодный свет'

  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cri >= 80 ? '#e8751a' : cri >= 60 ? '#f59e0b' : cri >= 40 ? '#eab308' : '#ef4444' }} />
        <span className="text-gray-300 text-sm font-medium">Предпросмотр комнаты</span>
        <span className="text-gray-500 text-xs">— {criLabel}, {tempLabel}</span>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-gray-700/50" style={{ background: objects.wall }}>
        {/* Ambient light overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(ellipse at 50% 20%, ${ambientColor}, transparent 70%)`,
          }}
        />

        <svg viewBox="0 0 600 320" className="w-full relative z-0">
          {/* Wall */}
          <rect x="0" y="0" width="600" height="220" fill={objects.wall} />

          {/* Floor */}
          <rect x="0" y="220" width="600" height="100" fill={objects.floor} />
          {/* Floor line */}
          <line x1="0" y1="220" x2="600" y2="220" stroke={objects.floorLine} strokeWidth="2" />

          {/* Ceiling light */}
          <rect x="240" y="0" width="120" height="12" rx="2" fill={objects.ceiling} />
          <ellipse cx="300" cy="16" rx="40" ry="8" fill={objects.lightColor} opacity={0.3 + cri / 200} />
          {/* Light cone */}
          <polygon
            points="270,16 330,16 400,220 200,220"
            fill={objects.lightColor}
            opacity={0.04 + (cri / 100) * 0.06}
          />

          {/* Painting on wall */}
          <rect x="60" y="40" width="120" height="90" rx="3" fill={objects.paintingFrame} />
          <rect x="68" y="48" width="104" height="74" rx="1" fill={objects.sky} />
          {/* Sun in painting */}
          <circle cx="140" cy="65" r="12" fill={objects.sun} />
          {/* Grass in painting */}
          <rect x="68" y="95" width="104" height="27" fill={objects.grass} />

          {/* Fruit bowl on table */}
          {/* Table */}
          <rect x="340" y="185" width="200" height="8" rx="2" fill={objects.table} />
          <rect x="360" y="193" width="8" height="27" fill={objects.tableLeg} />
          <rect x="512" y="193" width="8" height="27" fill={objects.tableLeg} />

          {/* Bowl */}
          <ellipse cx="440" cy="182" rx="45" ry="10" fill={objects.bowl} />
          <ellipse cx="440" cy="178" rx="40" ry="8" fill={objects.bowlInner} />

          {/* Fruits */}
          <circle cx="420" cy="168" r="12" fill={objects.apple} />
          <circle cx="445" cy="165" r="11" fill={objects.orange} />
          <ellipse cx="465" cy="170" rx="7" ry="12" fill={objects.banana} />
          <circle cx="435" cy="158" r="8" fill={objects.grape} />

          {/* Plant in corner */}
          <rect x="40" y="165" width="40" height="55" rx="4" fill={objects.pot} />
          <ellipse cx="60" cy="165" rx="24" ry="5" fill={objects.potRim} />
          {/* Plant leaves */}
          <ellipse cx="55" cy="130" rx="20" ry="30" fill={objects.leaf1} />
          <ellipse cx="75" cy="135" rx="18" ry="25" fill={objects.leaf2} />
          <ellipse cx="45" cy="120" rx="15" ry="22" fill={objects.leaf1} />
          <line x1="60" y1="165" x2="55" y2="140" stroke={objects.stem1} strokeWidth="3" />
          <line x1="60" y1="165" x2="75" y2="145" stroke={objects.stem2} strokeWidth="2" />

          {/* Person silhouette (simple) */}
          <circle cx="280" cy="130" r="18" fill={objects.skin} />
          <rect x="266" y="148" width="28" height="50" rx="6" fill={objects.clothes} />
          <rect x="258" y="155" width="12" height="40" rx="4" fill={objects.clothes} transform="rotate(-10, 264, 155)" />
          <rect x="290" y="155" width="12" height="40" rx="4" fill={objects.clothes} transform="rotate(10, 296, 155)" />
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: objects.apple }} />
          Яблоко
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: objects.leaf1 }} />
          Растение
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: objects.sky }} />
          Картина
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: objects.skin }} />
          Кожа
        </span>
      </div>
    </div>
  )
}
