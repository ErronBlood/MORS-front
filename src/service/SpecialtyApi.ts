import type { SpecialtyCreate } from '../types';
import { requestJson } from './GeneralApi';

const API_URL = import.meta.env.VITE_API_URL;

export async function GetAllSpecialties() {
  const options = {
    method: 'GET'
  }
  return await requestJson(`${API_URL}/specialties`, options);
}

//implement into backend
export async function GetSpecialty(specialtyId:number){
    const options = {
    method: 'GET'
  }
  return await requestJson(`${API_URL}/specialties/${specialtyId}`, options);
}


export async function CreateSpecialty(specialty: SpecialtyCreate) {
  const options = {
    method: 'POST',
    body: JSON.stringify(specialty),
  };
  return await requestJson(`${API_URL}/specialties`, options);
}
