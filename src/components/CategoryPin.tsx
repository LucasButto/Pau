import { CATEGORIES, PIN_ASPECT, type Category } from "../data/locations"

interface CategoryPinProps {
  category: Category
  /** Alto en px; el ancho sale de la proporción del PNG. */
  height: number
}

/** Pin oficial de la categoría (el mismo del mapa), decorativo: el nombre de la categoría va en texto. */
export default function CategoryPin({ category, height }: CategoryPinProps) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="category-pin"
      decoding="async"
      height={height}
      src={CATEGORIES[category].pin}
      width={Math.round(height * PIN_ASPECT)}
    />
  )
}
