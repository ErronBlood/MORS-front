import type { DoctorCreate, DoctorPatch} from "../types";
import {requestJson} from './GeneralApi'

const API_URL = import.meta.env.VITE_API_URL;

export async function CreateDoctor(doctor:DoctorCreate){

    const options ={
        method: 'POST',
        body: JSON.stringify(doctor)
    }
    const created = await requestJson(`${API_URL}/doctors`, options)

    return(created)
}

export async function GetDoctor(doctorId:number){
    const Doctor = await requestJson(`${API_URL}/doctor/${doctorId}`)
    return Doctor
}

export async function GetAllDoctors(){

        const options ={
        method: 'GET'
    }

    const doctors = await requestJson(`${API_URL}/doctors`, options)

    return doctors
}

export async function PatchDoctor(doctor:DoctorPatch, doctorId:number){
    const options ={
        method: 'PATCH',
        body: JSON.stringify(doctor)
    }

    const updated = await requestJson(`${API_URL}/doctors/${doctorId}`, options)

    return updated
}