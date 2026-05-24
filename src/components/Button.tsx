import type { ButtonProps } from "../types"

export const Button = ({title, behavior}: ButtonProps) => {
    return(
        <button onClick={behavior}>
            {title}
        </button>
    )
}