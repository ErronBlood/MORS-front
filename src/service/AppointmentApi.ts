import type { AppointmentCancel, AppointmentCompletion, AppointmentCreate } from "../types";
import {requestJson} from './GeneralApi'

const API_URL = import.meta.env.VITE_API_URL;

export async function CreateAppointment(appointment:AppointmentCreate){

    const options ={
        method: 'POST',
        body: JSON.stringify(appointment)
    }
    const created = await requestJson(`${API_URL}/appointments`, options)

    return(created)
}

export async function GetAppointment(appointmentId:number){
    const appointment = await requestJson(`${API_URL}/appointments/${appointmentId}`)
    return appointment
}

export async function GetAllAppointments(){

        const options ={
        method: 'GET'
    }

    const appointments = await requestJson(`${API_URL}/appointments`, options)

    return appointments
}

export async function CancelAppointment(appointment:AppointmentCancel, appointmentId:number){
    const options ={
        method: 'PATCH',
        body: JSON.stringify(appointment)
    }

    const updated = await requestJson(`${API_URL}/appointments/${appointmentId}/cancel`, options)

    return updated
}

export async function CompleteAppointment(appointment:AppointmentCompletion, appointmentId:number){
    const options ={
        method: 'PATCH',
        body: JSON.stringify(appointment)
    }

    const updated = await requestJson(`${API_URL}/appointments/${appointmentId}/complete`, options)

    return updated
}

export async function NoShowAppointment(appointmentId:number){
    const options ={
        method: 'PATCH'
    }

    const updated = await requestJson(`${API_URL}/appointments/${appointmentId}/noshow`, options)

    return updated
}

export async function ConfirmAppointment(appointmentId: number){
    const options={
        method: 'PATCH'
    }

    const updated = await requestJson(`${API_URL}/appointments/${appointmentId}/confirm`, options)

    return updated
}