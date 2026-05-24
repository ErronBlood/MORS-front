export interface MetricCardProps{
    label : string,
    value : number,
    info: string
}

export interface PatientResponse{
    id: number,
    email: string,
    phone: string,
    status: "ACTIVE" | "INACTIVE",
    appointments: [number]
}
//T, K extends ketof T means
//Accept any value, whatever the key to access T is, is the value of K
//This interface is used to have a generality for creating many tables with a single component

export interface TableColumns<T>{
    header:string,
    key: keyof T
}

export interface TableProps<T>{
    columns: TableColumns<T>[],
    data: T[]
}

export interface ButtonProps{
    title: string,
    behavior: () => void
}