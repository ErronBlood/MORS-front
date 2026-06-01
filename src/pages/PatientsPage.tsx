import { useEffect, useState } from "react"
import { Button, FormField, Table, Dropdown, PopUp } from "../components"
import type { PatientResponse, TableColumns, DropdownProps, FormProps, PatientCreate, PatientPatch, DropdownOptions } from "../types"
import { GetAllPatients, CreatePatient, GetPatient, PatchPatient } from '../service/PatientApi'
import { useRequest } from "../service/GeneralApi"
import {usePatients } from "../context/context"

export const PatientsPage = () => {


    const {executeRequest} = useRequest()
    const {patients, setPatients} = usePatients()

    
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState('allstates')
    
    const blankForm = {
        fullName:'',
        email: '',
        phone:''
    }
    const [formData, setFormData] = useState<PatientCreate>(blankForm)
    
    const filteredPatients = patients.filter(p => statusFilter === 'allstates' ? true: p.status === statusFilter )

    const dropDownOptions: DropdownOptions<DropdownProps>={
        data:  [
        {display: 'All states', value: 'allstates'},
        {display: 'Active', value: 'ACTIVE'},
        {display: 'Inactive', value: 'INACTIVE'}],
    }

    const formFields :FormProps[]= [
        {label:'Full Name', type:'text', placeHolder:'Ex. Maria Garcia', key:'fullName'},
        {label:'Email', type:'text', placeHolder:'email@uni.edu.co', key:'email'},
        {label:'Phone Number', type:'text', placeHolder:'300 000 0000', key:'phone'}
    ]

    const columns: TableColumns<PatientResponse>[]= [
        {header: "id", key: "id"},
        {header: "email", key: "email"},
        {header: "phone", key: "phone"},
        {header: "state", key: "status"}
    ]

    async function LoadPatients(){
        const data = await executeRequest('Patients have been loaded', GetAllPatients)
        if(data){
            setPatients(data)
        }
    }

    async function handleCreate(patient:PatientCreate){
        const created = await executeRequest('Patient created succesfully', () => CreatePatient(patient))
        if (created){
            setPatients((currentPatients) => [created, ...currentPatients])
        }
    }

    async function handleViewDetails(patientId:number){
        const patient = await executeRequest(`Patient No# ${patientId} found`, () => GetPatient(patientId))
        if(patient){
            setSelectedPatient(patient)
        }
    }

    async function handlePatch(patient:PatientPatch, patientId:number){
        const patchedPatient = await executeRequest('Patient successfully patched',
             () => PatchPatient(patient, patientId))
            
        if(patchedPatient){
            setPatients((current) => current.map((p) => p.id === patientId ? patchedPatient : p))
            setSelectedPatient(patchedPatient)
        }
    }
    
    useEffect(()=>{
        LoadPatients()
    }, [])

    
    return(
        <main className="container-fluid p-4">
            <div>
                <h1>Patients</h1>
                <p>current {patients.filter(p=> p.status === "ACTIVE").length}
                     amount of {patients.length} patients</p>
                <Button title="+ New Patient" behavior={()=> setIsOpen(true)}/>
                <PopUp isOpen = {isOpen} onClose={()=> setIsOpen(false)}>
                    {formFields.map(f => (
                        <FormField 
                            label={f.label} 
                            type={f.type} 
                            placeHolder={f.placeHolder} 
                            key={f.key}
                            value = {formData[f.key as keyof PatientCreate]}
                            onChange={(e) => setFormData({...formData, [f.key]: e.target.value})}
                            />) )}
                    <Button title="Registrar" behavior={() => {handleCreate(formData)
                        setIsOpen(false)
                        setFormData(blankForm)
                    }}/>
                    <Button title="Cancelar" behavior={() => {setIsOpen(false)
                        setFormData(blankForm)
                    }}/>
                </PopUp>
                <Dropdown data={dropDownOptions.data}
                        value ={statusFilter}
                        onChange={(value) => setStatusFilter(String(value))}/>
                <Table columns={columns} data={filteredPatients}/>
            </div>
        </main>
    )
}