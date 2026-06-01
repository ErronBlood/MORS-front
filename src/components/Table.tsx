import type {TableProps } from "../types"

export const Table =<T,> ({columns, data}: TableProps<T>) => {
    return(
        <div className="card p-3">
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            {columns.map(col => (   
                                <th key={String(col.key)}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => 
                            <tr key={i}>
                                {columns.map(col => (
                                    <td key={String(col.key)}>
                                        {col.render ? col.render(row[col.key], row):
                                        String(row[col.key]) ?? ""}
                                    </td>
                            ))}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

