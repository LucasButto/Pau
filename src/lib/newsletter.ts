const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export class NewsletterError extends Error {
  constructor(readonly reason: "not-configured" | "network" | "server") {
    super(`Newsletter: ${reason}`)
    this.name = "NewsletterError"
  }
}

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

/**
 * Alta en el newsletter. Envía `POST { email }` a `VITE_NEWSLETTER_ENDPOINT`.
 *
 * TODO: configurar el endpoint real (ver `.env.example`). Mientras falte, en desarrollo se simula
 * una respuesta exitosa para poder probar los estados del formulario; en producción se informa el
 * error en lugar de decirle a la persona que quedó suscripta sin haber guardado nada.
 */
export async function subscribeToNewsletter(email: string): Promise<void> {
  const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT?.trim()
  if (!endpoint) {
    if (import.meta.env.DEV) {
      await wait(900)
      return
    }
    throw new NewsletterError("not-configured")
  }
  let response: Response
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: email.trim() }),
    })
  } catch {
    throw new NewsletterError("network")
  }
  if (!response.ok) throw new NewsletterError("server")
}
