import { createElement } from "react"
import { ICON_PATHS, type IconName, type IconShape } from "./iconPaths"

interface IconProps {
  name: IconName
  size?: number
  className?: string
  /** Grosor del trazo en unidades de la grilla de 20 (los íconos de categoría usan 1.5). */
  strokeWidth?: number
}

export default function Icon({ name, size = 20, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      height={size}
      viewBox="0 0 20 20"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        {(ICON_PATHS[name] as IconShape[]).map(([tag, attrs], index) => createElement(tag, { key: index, ...attrs }))}
      </g>
    </svg>
  )
}
