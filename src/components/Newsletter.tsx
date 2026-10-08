import { useId, useRef, useState, type FormEvent } from "react"
import { FOOTER_TEXT } from "../content/navegacion"
import {
  NewsletterError,
  isValidEmail,
  subscribeToNewsletter,
} from "../lib/newsletter"
import Icon from "./Icon"

type Status = "idle" | "sending" | "success" | "error"

const ERROR_MESSAGES = {
  invalid: "Revisá el correo: falta algo (por ejemplo, nombre@dominio.com).",
  network: "No pudimos conectarnos. Revisá tu conexión y probá de nuevo.",
  failed: "No pudimos registrar tu correo. Probá de nuevo en un rato.",
} as const

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)
  const sending = useRef(false)
  const inputId = useId()
  const messageId = useId()
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (sending.current) return // sin doble envío
    if (!isValidEmail(email)) {
      setStatus("error")
      setError(ERROR_MESSAGES.invalid)
      return
    }
    sending.current = true
    setStatus("sending")
    setError(null)
    try {
      await subscribeToNewsletter(email)
      setStatus("success")
    } catch (reason) {
      setStatus("error")
      setError(
        reason instanceof NewsletterError && reason.reason === "network"
          ? ERROR_MESSAGES.network
          : ERROR_MESSAGES.failed,
      )
    } finally {
      sending.current = false
    }
  }

  return (
    <div className="newsletter" id="newsletter">
      <h2>
        {FOOTER_TEXT.newsletterTitle[0]}
        <br />
        {FOOTER_TEXT.newsletterTitle[1]}
      </h2>
      {status === "success" ? (
        <div className="success-message" role="status">
          <Icon name="pinParque" size={24} strokeWidth={1.5} />
          <p>
            <strong>Ya estás adentro.</strong> Pronto vas a recibir novedades.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate aria-busy={status === "sending"}>
          <label className="sr-only" htmlFor={inputId}>
            Correo electrónico
          </label>
          <div
            className={
              error ? "newsletter-field has-error" : "newsletter-field"
            }
          >
            <Icon name="mail" size={19} />
            <input
              id={inputId}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Tu correo electrónico"
              value={email}
              aria-invalid={error === ERROR_MESSAGES.invalid}
              aria-describedby={messageId}
              onChange={(event) => {
                setEmail(event.target.value)
                if (status === "error") {
                  setStatus("idle")
                  setError(null)
                }
              }}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              aria-label={status === "sending" ? "Enviando…" : "Suscribirme"}
            >
              <Icon
                name={status === "sending" ? "refresh" : "arrow"}
                size={20}
                className={status === "sending" ? "is-spinning" : undefined}
              />
            </button>
          </div>
          <p
            id={messageId}
            className={
              error ? "newsletter-message is-error" : "newsletter-message"
            }
            role={error ? "alert" : undefined}
          >
            {error ??
              (status === "sending"
                ? "Enviando…"
                : "Noticias estacionales. Cero spam, como en la huerta.")}
          </p>
        </form>
      )}
    </div>
  )
}
