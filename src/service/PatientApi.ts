import type { PatientCreate, PatientPatch} from "../types";
import {requestJson} from './GeneralApi'

const API_URL = import.meta.env.VITE_API_URL;

export async function CreatePatient(patient:PatientCreate){

    const options ={
        method: 'POST',
        body: JSON.stringify(patient)
    }
    const created = await requestJson(`${API_URL}/patients`, options)

    return(created)
}

export async function GetPatient(patientId:number){
    const patient = await requestJson(`${API_URL}/patients/${patientId}`)
    return patient
}

export async function GetAllPatients(){

        const options ={
        method: 'GET'
    }

    const patients = await requestJson(`${API_URL}/patients`, options)

    return patients
}

export async function PatchPatient(patient:PatientPatch, patientId:number){
    const options ={
        method: 'PATCH',
        body: JSON.stringify(patient)
    }

    const updated = await requestJson(`${API_URL}/patients/${patientId}`, options)

    return updated
}