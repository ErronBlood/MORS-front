import { createContext, useContext, useState } from "react"
import type { AppointmentsContextType, AppointmentResponse, AppointmentTypesContextType, AppointmentTypeResponse, DoctorResponse, DoctorsContextType, OfficeContextType, OfficeResponse, PatientResponse, PatientsContextType, SpecialtyResponse, SpecialtiesContextTyoe } from "../types"


export const PatientsContext = createContext<PatientsContextType | undefined>(undefined)
export const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined)
export const AppointmentTypesContext = createContext<AppointmentTypesContextType | undefined>(undefined)
export const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)
export const OfficeContext = createContext<OfficeContextType | undefined>(undefined)
export const SpecialtiesContext = createContext<SpecialtiesContextTyoe | undefined>(undefined)

export const PatientsProvider = ({children}) => {
    const [patients, setPatients] = useState<PatientResponse[]>([])

    return(
        <PatientsContext.Provider value = {{patients, setPatients}}>
            {children}
        </PatientsContext.Provider>
    )

}

export const DoctorsProvider = ({children}) => {
    const [doctors, setDoctors] = useState<DoctorResponse[]>([])

    return(
        <DoctorsContext.Provider value={{doctors, setDoctors}}>
            {children}
        </DoctorsContext.Provider>
    )
}

export const AppointmentTypeProvider = ({children}) => {
    const [appointmentTypes, setAppointmentTypes] = useState<AppointmentTypeResponse[]>([])

    return(
        <AppointmentTypesContext.Provider value={{appointmentTypes, setAppointmentTypes}}>
            {children}
        </AppointmentTypesContext.Provider>
    )
}

export const AppointmentProvider = ({children}) => {
    const [appointments, setAppointments] = useState<AppointmentResponse[]>([])

    return(
        <AppointmentsContext.Provider value={{appointments,setAppointments}}>
            {children}
        </AppointmentsContext.Provider>
    )
}

export const OfficesProvider = ({children}) =>{
    const [offices, setOffices] = useState<OfficeResponse[]>([])

    return(
        <OfficeContext.Provider value={{offices,setOffices}}>
            {children}
        </OfficeContext.Provider>
    )
}

export const SpecialtiesProvider = ({children}) =>{
    const [specialties, setSpecialties] = useState<SpecialtyResponse[]>([])

    return(
        <SpecialtiesContext.Provider value={{specialties,setSpecialties}}>
            {children}
        </SpecialtiesContext.Provider>
    )
}

export const useDoctors = () => {
    const context = useContext(DoctorsContext)
    if (context === undefined){
        throw new Error('Must be used inside a context provider') 
    }

    return context
}

export const usePatients = () => {
    const context = useContext(PatientsContext)
    if( context === undefined){
        throw new Error('Must be used inside a context provider')
    } 

    return context
}

export const useAppointmentTypes = () =>{
    const context = useContext(AppointmentTypesContext)
    if( context === undefined){
        throw new Error('Must be used inside a context provider')
    } 

    return context
}

export const useAppointments = () =>{
    const context = useContext(AppointmentsContext)
    if( context === undefined){
        throw new Error('Must be used inside a context provider')
    } 

    return context
}

export const useOffices = () => {
    const context = useContext(OfficeContext)
    if( context === undefined){
        throw new Error('Must be used inside a context provider')
    } 

    return context
}

export const useSpecialties = () => {
    const context = useContext(SpecialtiesContext)
    if( context === undefined){
        throw new Error('Must be used inside a context provider')
    } 
    return context
}