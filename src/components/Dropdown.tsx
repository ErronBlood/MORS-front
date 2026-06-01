import type { DropdownOptions, DropdownProps} from "../types"

export const Dropdown = ({data} :DropdownOptions<DropdownProps>) => {
    
    {
        //these options must be dynamic too
    }
    return(
    <select className="form-select">
        {data.map(d => (
            <option value={d.value}>{d.display}</option>
        ))}
    </select>
    )
}