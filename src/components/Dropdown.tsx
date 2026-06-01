import type { DropdownOptions, DropdownProps} from "../types"

export const Dropdown = ({data, value, onChange}:DropdownOptions<DropdownProps>) => {
    
    {
        //these options must be dynamic too
    }
    return(
    <select className="form-select"
     value={value}
     onChange={(e) => onChange?.(e.target.value)}
    >
        {data.map(d => (
            <option value={d.value}>{d.display}</option>
        ))}
    </select>
    )
}