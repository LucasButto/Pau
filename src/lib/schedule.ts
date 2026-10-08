export type DayCode = "LUN" | "MAR" | "MIÉ" | "JUE" | "VIE" | "SÁB" | "DOM"

/** Orden de `Date.getDay()`: 0 = domingo. */
const WEEK: readonly DayCode[] = [
  "DOM",
  "LUN",
  "MAR",
  "MIÉ",
  "JUE",
  "VIE",
  "SÁB",
]

export const DAY_NAMES: Record<DayCode, string> = {
  LUN: "lunes",
  MAR: "martes",
  MIÉ: "miércoles",
  JUE: "jueves",
  VIE: "viernes",
  SÁB: "sábado",
  DOM: "domingo",
}

const TIME_ZONE = "America/Argentina/Buenos_Aires"
const weekdayInRosario = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  timeZone: TIME_ZONE,
})
const EN_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/** Día de la semana actual en Rosario, sin importar la zona horaria del dispositivo. */
export function todayInRosario(now: Date = new Date()): DayCode {
  const index = EN_WEEKDAYS.indexOf(weekdayInRosario.format(now))
  return WEEK[index === -1 ? now.getDay() : index]
}

export interface OpenStatus {
  today: DayCode
  openToday: boolean
  /** Próximo día de apertura (sin contar hoy), o null si no tiene días cargados. */
  nextDay: DayCode | null
}

export function openStatus(
  openDays: readonly DayCode[],
  now: Date = new Date(),
): OpenStatus {
  const today = todayInRosario(now)
  const start = WEEK.indexOf(today)
  let nextDay: DayCode | null = null
  for (let offset = 1; offset <= 7; offset += 1) {
    const day = WEEK[(start + offset) % 7]
    if (openDays.includes(day)) {
      nextDay = day
      break
    }
  }
  return { today, openToday: openDays.includes(today), nextDay }
}

export type Season = "verano" | "otoño" | "invierno" | "primavera"

const monthDayInRosario = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  day: "numeric",
  timeZone: TIME_ZONE,
})

/** Estación del año en Rosario (hemisferio sur), según el calendario astronómico. */
export function seasonInRosario(now: Date = new Date()): Season {
  const parts = monthDayInRosario.formatToParts(now)
  const month = Number(parts.find((part) => part.type === "month")?.value)
  const day = Number(parts.find((part) => part.type === "day")?.value)
  const monthDay = month * 100 + day
  if (monthDay >= 1221 || monthDay < 321) return "verano"
  if (monthDay < 621) return "otoño"
  if (monthDay < 923) return "invierno"
  return "primavera"
}
