//------Responses and Requests------

import type { ChangeEvent, Dispatch, ReactNode, SetStateAction } from "react"

//Status

export type PatientDoctorStatus = "ACTIVE" | "INACTIVE"
export type OfficeStatus = "AVAILABLE" | "UNAVAILABLE" | "MAINTENANCE"
export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"

//Patients
export interface PatientResponse{
    id: number,
    fullName: string
    email: string,
    phone: string,
    status: PatientDoctorStatus,
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
    status: PatientDoctorStatus
}

//Doctors

export interface DoctorResponse{
    id: number,
    fullName: string
    email:string,
    licenseNumber: string,
    active: PatientDoctorStatus,
    specialty: SpecialtyResponse,
    doctorSchedules:DoctorScheduleResponse[],
    appointments: AppointmentResponse[]

}

export interface DoctorCreate{
    fullName: string,
    email: string,
    licenseNumber: string,
    specialtyId: number
}

export interface DoctorPatch{
    fullName:string,
    email: string,
    active: PatientDoctorStatus,
    licenseNumber: string,
    specialtyId: number
}

//Doctor Schedule

export interface DoctorScheduleResponse{
    id: number,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    doctorId: number
}

export interface DoctorScheduleCreate{
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    doctorId: number
}

export interface AvailabilitySlotResponse{
    startTime: string,
    endTime: string
}

//Specialty
export interface SpecialtyResponse{
    id: number,
    name: string,
    description: string
}

export interface SpecialtyCreate{
    name: string,
    description: string
}

//Office
export interface OfficeResponse{
    id: number,
    name: string,
    location: string,
    status: OfficeStatus,
    appointments: AppointmentResponse[]
}

export interface OfficeCreate{
    name: string,
    location: string,
    openingHour: string,
    closingHour: string
}

export interface OfficePatch{
    name: string,
    location: string,
    status: string,
    openingHour: string,
    closingHour: string,
    appointments?: AppointmentResponse[]
}

//Appointments
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

export interface AppointmentCreate{
    startAt: string,
    endAt: string,
    patientId: number,
    doctorId: number,
    officeId: number
    appointmentTypeId: number
}

export interface AppointmentCancel{
    id?: number,
    cancellationReason: string
}

export interface AppointmentCompletion{
    id?: number,
    observations: string
}

//Appointment Type

export interface AppointmentTypeResponse{
    id: number,
    name: string
    durationMinutes: number,
    description: string
}

export interface AppointmentTypeCreate{
    name: string
    durationMinutes: number,
    description: string
}

//Reports

export interface OfficeOccupancy{
    id: number,
    name:string,
    location:string,
    openingHour:string,
    closingHour:string,
    busyHours:number,
    availableHours:number,
    occupancyPercent:number
}

export interface PatientNoShowResponse{
    id:number,
    fullName:string,
    noShowCount:number
}

export interface DoctorProductivityReport{
    doctorInfo: DoctorResponse,
    completedAppointments: number,
    totalAppointments: number,
    productivityPercent: number
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
    render?: (value: T[keyof T], row: T) => ReactNode
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
    value: string | number
}

export interface DropdownOptions<DropdownProps>{
    data:DropdownProps[]
    value?: string | number,
    onChange?: (value: string|number)=> void
}

export interface FormProps{
    label: string
    type: string,
    placeHolder?: string,
    key?: string
    value?: string | number | boolean | AppointmentResponse[],
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    
}

export interface WeeklyScheduleProps{
    doctor: DoctorResponse
}

//--------Context---------

export interface PatientsContextType{
    patients: PatientResponse[]
    setPatients: Dispatch<SetStateAction<PatientResponse[]>>
}

export interface DoctorsContextType{
    doctors: DoctorResponse[],
    setDoctors: Dispatch<SetStateAction<DoctorResponse[]>>
}

export interface AppointmentTypesContextType{
    appointmentTypes: AppointmentTypeResponse[],
    setAppointmentTypes: Dispatch<SetStateAction<AppointmentTypeResponse[]>>
}

export interface AppointmentsContextType{
    appointments: AppointmentResponse[],
    setAppointments: Dispatch<SetStateAction<AppointmentResponse[]>>
}

export interface OfficeContextType{
    offices: OfficeResponse[],
    setOffices: Dispatch<SetStateAction<OfficeResponse[]>>
}

export interface SpecialtiesContextTyoe{
    specialties: SpecialtyResponse[],
    setSpecialties: Dispatch<SetStateAction<SpecialtyResponse[]>>
}

//------ Connection ---------
export interface RequestOptions{
    method? : string,
    headers? : Record<string, string>,
    body?: string
}