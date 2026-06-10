export function adjustColor(hex: string, cri: number, temperature: number): string {
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

export function getTempLabel(temp: number): string {
  if (temp <= 3200) return 'Тёплый'
  if (temp <= 5000) return 'Нейтральный'
  return 'Холодный'
}

export function getTempColor(temp: number): string {
  if (temp <= 3200) return '#ffb46b'
  if (temp <= 5000) return '#fff4e0'
  return '#c9e8ff'
}

export function getAmbientColor(temperature: number, cri: number): string {
  const alpha = 0.15 + (1 - cri / 100) * 0.1
  if (temperature <= 3200) return `rgba(255, 180, 107, ${alpha})`
  if (temperature <= 5000) return `rgba(255, 244, 224, ${alpha * 0.7})`
  return `rgba(201, 232, 255, ${alpha})`
}
