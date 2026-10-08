const STATS = [
  { value: "7", label: "Parques Huerta", detail: "en producción" },
  { value: "155+", label: "Huerteros", detail: "registrados" },
  { value: "1", label: "Centro", detail: "Agroecológico" },
  { value: "9", label: "Espacios Huerta", detail: "en la ciudad" },
]

export default function ImpactStats() {
  return (
    <section
      className="impact-section"
      id="impacto"
      aria-labelledby="impacto-title"
    >
      <div className="impact-intro">
        <h2 id="impacto-title">
          Sembramos futuro.
          <br />
          Cosechamos comunidad.
        </h2>
        <p>
          Desde 2002, el PAU transforma terrenos vacantes en espacios
          productivos, verdes y compartidos.
        </p>
      </div>
      <ul className="stats-grid">
        {STATS.map(({ value, label, detail }) => (
          <li className="stat" key={label}>
            <div className="stat-body">
              <strong>{value}</strong>
              <span className="stat-text">
                {label}
                <small>{detail}</small>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
