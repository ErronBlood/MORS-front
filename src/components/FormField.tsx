import type { FormProps } from "../types"

export const FormField = ({label,type,placeHolder,key}:FormProps) =>{
    return(
        <input  className="form-input" aria-label={label} type={type} placeholder= {placeHolder} key={key}/>
    )
}