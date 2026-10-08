import { useCallback, useRef, useState } from "react"
import type { LatLng } from "../lib/geo"

export type GeoStatus = "idle" | "locating" | "granted" | "denied" | "unavailable" | "error"

export interface GeolocationState {
  status: GeoStatus
  position: LatLng | null
  /** Mensaje para mostrar cuando algo salió mal. */
  message: string | null
  /** Aumenta con cada ubicación obtenida (para que el mapa vuele hasta ahí). */
  seq: number
  request(): void
  dismissMessage(): void
}

const MESSAGES = {
  denied:
    "No tenemos permiso para usar tu ubicación. Podés habilitarlo en la configuración del navegador; mientras tanto medimos las distancias desde el centro de Rosario.",
  unavailable:
    "Tu navegador no permite compartir la ubicación. Medimos las distancias desde el centro de Rosario.",
  error: "No pudimos obtener tu ubicación. Probá de nuevo en unos segundos.",
} as const

export function useGeolocation(): GeolocationState {
  const [status, setStatus] = useState<GeoStatus>("idle")
  const [position, setPosition] = useState<LatLng | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [seq, setSeq] = useState(0)
  const busy = useRef(false)
  const request = useCallback(() => {
    if (busy.current) return
    if (!("geolocation" in navigator) || !window.isSecureContext) {
      setStatus("unavailable")
      setMessage(MESSAGES.unavailable)
      return
    }
    busy.current = true
    setStatus("locating")
    setMessage(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        busy.current = false
        setPosition({ lat: coords.latitude, lng: coords.longitude })
        setStatus("granted")
        setSeq((value) => value + 1)
      },
      (error) => {
        busy.current = false
        const denied = error.code === error.PERMISSION_DENIED
        setStatus(denied ? "denied" : "error")
        setMessage(denied ? MESSAGES.denied : MESSAGES.error)
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 },
    )
  }, [])

  const dismissMessage = useCallback(() => setMessage(null), [])
  return { status, position, message, seq, request, dismissMessage }
}
