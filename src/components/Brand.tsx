import Icon from "./Icon"

export default function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={inverse ? "brand brand-inverse" : "brand"}>
      <span className="brand-mark">
        <Icon name="sprout" size={27} />
      </span>
      <span className="brand-copy">
        <strong>PAU</strong>
        <span>
          Programa de
          <br />
          Agricultura Urbana
        </span>
      </span>
      <span className="brand-city">ROSARIO</span>
    </span>
  )
}
