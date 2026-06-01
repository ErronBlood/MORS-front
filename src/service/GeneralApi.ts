import { useState } from "react";
import type { RequestOptions } from "../types";

export async function requestJson(url: string, options:RequestOptions = {}) {
    const response = await fetch(url, {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            ...options.headers
        },
        ...options
    })

 if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function useRequest(){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')  

    async function executeRequest(successMessage: string, callback:()=>void){
            
        setLoading(true)
        setError('')
        setMessage('')

        try{
            const result = await callback()
            setMessage(successMessage)
            
            return result
        } catch(requestError:any){
            setError(requestError.message)
            return null
        }
        finally{
            setLoading(false)
        }

    }
    return({loading, error, message, executeRequest})
}