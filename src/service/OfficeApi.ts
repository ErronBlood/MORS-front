import type { OfficeCreate, OfficePatch } from '../types';
import { requestJson } from './GeneralApi';

const API_URL = import.meta.env.VITE_API_URL;

export async function GetAllOffices() {
  return await requestJson(`${API_URL}/offices`);
}

export async function GetOffice(officeId: number){
  const options = {
    method: 'GET'
  }

  return await requestJson(`${API_URL}/offices/${officeId}`, options)

}

export async function CreateOffice(office: OfficeCreate) {
  const options = {
    method: 'POST',
    body: JSON.stringify(office),
  };
  return await requestJson(`${API_URL}/offices`, options);
}

export async function PatchOffice(office: OfficePatch ,officeId: number) {
  const options = {
    method: 'PATCH',
    body: JSON.stringify(office),
  };
  return await requestJson(`${API_URL}/offices/${officeId}`, options);
}
