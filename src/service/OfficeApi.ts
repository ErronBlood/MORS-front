import { requestJson } from './GeneralApi';

const API_URL = import.meta.env.VITE_API_URL;

export async function GetAllOffices() {
  return await requestJson(`${API_URL}/offices`);
}

export async function CreateOffice(office: any) {
  const options = {
    method: 'POST',
    body: JSON.stringify(office),
  };
  return await requestJson(`${API_URL}/offices`, options);
}

export async function UpdateOffice(officeId: number, office: any) {
  const options = {
    method: 'PUT',
    body: JSON.stringify(office),
  };
  return await requestJson(`${API_URL}/offices/${officeId}`, options);
}
