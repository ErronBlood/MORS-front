import { useEffect, useState } from "react"
import { Button, FormField, Table, Dropdown, PopUp } from "../components"
import type { PatientResponse,PatientStatus, TableColumns, DropdownProps, FormProps, PatientCreate, PatientPatch, DropdownOptions } from "../types"
import { GetAllPatients, CreatePatient, GetPatient, PatchPatient } from '../service/PatientApi'
import { useRequest } from "../service/GeneralApi"
import {usePatients } from "../context/context"

export const PatientsPage = () => {


    const {executeRequest} = useRequest()
    const {patients, setPatients} = usePatients()

    
    const [selectedPatient, setSelectedPatient] = useState<PatientResponse>()
    const [isEditOpen,setIsEditOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState('allstates')
    
    const blankForm = {
        fullName:'',
        email: '',
        phone:'',
        status: 'ACTIVE'
    }

    const [createForm, setCreateForm] = useState<PatientCreate>(blankForm)
    const [editForm, setEditForm] = useState<PatientPatch>(blankForm)
    
    const filteredPatients = patients.filter(p => statusFilter === 'allstates' ? true: p.status === statusFilter )

    const dropDownOptions: DropdownOptions<DropdownProps>={
        data:  [
        {display: 'All states', value: 'allstates'},
        {display: 'Active', value: 'ACTIVE'},
        {display: 'Inactive', value: 'INACTIVE'}],
    }

     const editDropdown: DropdownOptions<DropdownProps>={
        data:  [
        {display: 'Active', value: 'ACTIVE'},
        {display: 'Inactive', value: 'INACTIVE'}],
    }

    const createFields :FormProps[]= [
        {label:'Full Name', type:'text', placeHolder:'Ex. Maria Garcia', key:'fullName'},
        {label:'Email', type:'text', placeHolder:'email@uni.edu.co', key:'email'},
        {label:'Phone Number', type:'text', placeHolder:'300 000 0000', key:'phone'}
    ]
    
    const editFields :FormProps[]= [
        {label:'Full Name', type:'text', placeHolder:'Ex. Maria Garcia', key:'fullName'},
        {label:'Email', type:'text', placeHolder:'email@uni.edu.co', key:'email'},
        {label:'Phone Number', type:'text', placeHolder:'300 000 0000', key:'phone'}
    ]

    const columns: TableColumns<PatientResponse>[]= [
        {header: "id", key: "id"},
        {header: "email", key: "email"},
        {header: "phone", key: "phone"},
        {header: "state", key: "status"},
        {header: "Actions", key: "id", render: (_value, row: any) => (
            <div>
                <Button title="edit" behavior={() => {setSelectedPatient(row)
                    setEditForm({
                        fullName: row.fullName,
                        email: row.email,
                        phone: row.phone,
                        status: row.status
                    })
                    setIsEditOpen(true); }}/>
                <Button title="View" behavior={() => {setSelectedPatient(row)
                    setIsViewOpen(true);}}/>
            </div>
        )}
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
        <main className="main-content">
            <div>
                <h1>Patients</h1>
                <p>current active patients: {patients.filter(p=> p.status === "ACTIVE").length}</p>
                <p>total registered patients: {patients.length}</p>
                <Button title="+ New Patient" behavior={()=> setIsOpen(true)}/>
                <PopUp isOpen = {isOpen} onClose={()=> setIsOpen(false)}>
                    {createFields.map(f => (
                        <FormField 
                            label={f.label} 
                            type={f.type} 
                            placeHolder={f.placeHolder} 
                            key={f.key}
                            value = {createForm[f.key as keyof PatientCreate]}
                            onChange={(e) => setCreateForm({...createForm, [f.key]: e.target.value})}
                            />) )}
                    <Button title="Save" behavior={() => {handleCreate(createForm)
                        setIsOpen(false)
                        setCreateForm(blankForm)
                    }}/>
                    <Button title="Cancel" behavior={() => {setIsOpen(false)
                        setCreateForm(blankForm)
                    }}/>
                </PopUp>

                <PopUp isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
                    {editFields.map(f => (
                        <FormField 
                            label={f.label} 
                            type={f.type} 
                            placeHolder={f.placeHolder} 
                            key={f.key}
                            value = {editForm[f.key as keyof PatientPatch]}
                            onChange={(e) => setEditForm({...editForm, [f.key]: e.target.value})}
                            />) )}
                        <Dropdown data = {editDropdown.data}
                        value={editForm.status}
                        onChange={(value) => setEditForm({...editForm, status: value as PatientStatus})}
                        />
                        <Button title="Edit" behavior={() => {handlePatch(editForm, Number(selectedPatient?.id))
                            setIsEditOpen(false)
                            setEditForm(blankForm)
                        }}/>
                         <Button title="Cancel" behavior={() => {setIsEditOpen(false)
                        setEditForm(blankForm)
                        }}/>
                </PopUp>
                
                <PopUp isOpen={isViewOpen} onClose={() => setIsViewOpen(false)}>
                    <div>
                        <p><strong>Name:</strong> {selectedPatient?.fullName}</p>
                        <p><strong>Email:</strong> {selectedPatient?.email}</p>
                        <p><strong>Phone:</strong> {selectedPatient?.phone}</p>
                        <p><strong>Status:</strong> {selectedPatient?.status}</p>
                    </div>
                    <Button title="Cancel" behavior={() => {setIsViewOpen(false)}}/>
                </PopUp>

                <Dropdown data={dropDownOptions.data}
                        value ={statusFilter}
                        onChange={(value) => setStatusFilter(String(value))}/>
                <Table columns={columns} data={filteredPatients}/>
            </div>
        </main>
    )
}