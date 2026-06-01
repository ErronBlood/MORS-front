//------Responses and Requests------

export interface PatientResponse{
    id: number,
    fullName: string
    email: string,
    phone: string,
    status: "ACTIVE" | "INACTIVE",
    appointments: AppointmentResponse[]
}

export interface PatientCreate{
    fullName: string,
    email: string,
    phone:string
}

export interface PatientPatch{
    fullName: string,
    email: string,
    phone: string,
    status: "ACTIVE" | "INACTIVE",
}

export interface AppointmentResponse{
    id: number,
    startAt: string,
    endAt: string,
    status: "SCHEDULED" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW",
    patientId: number,
    doctorId: number,
    officeId: number,
    appointmentType: number
}
//-----Props-----

export interface MetricCardProps{
    label : string,
    value : number,
    info: string
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

export interface DropdownProps{
    display: string
    value: string
}

export interface DropdownOptions<DropdownProps>{
    data:DropdownProps[]
}

export interface FormProps{
    label: string
    type: string,
    placeHolder: string,
    key: string
}

//------ Connection ---------
export interface RequestOptions{
    method? : string,
    headers? : Record<string, string>,
    body?: string
}