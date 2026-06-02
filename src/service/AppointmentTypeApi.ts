import type {AppointmentTypeCreate } from "../types";
import { requestJson } from "./GeneralApi";

const API_URL = import.meta.env.VITE_API_URL;

export async function CreateAppointmentType(appointmentType: AppointmentTypeCreate) {
  const options = {
    method: 'POST',
    body: JSON.stringify(appointmentType),
  };
  return await requestJson(`${API_URL}/appointmenttypes`, options);
}

export async function GetAppointmentType(appointmentTypeId: number){
    const options = {
        method: 'GET'
    }
    return await requestJson(`${API_URL}/appointmenttypes/${appointmentTypeId}`, options)
}

//implement into backend
export async function GetAllAppointmentTypes() {
  const options = {
    method: 'GET'
  }
  return await requestJson(`${API_URL}/appointmenttypes`, options);
}