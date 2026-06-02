import { useEffect, useState } from "react"
import { useOffices } from "../context/context"
import { useRequest } from "../service/GeneralApi"
import type { DropdownOptions, DropdownProps, FormProps, OfficeCreate, OfficePatch, OfficeResponse, PatientStatus, TableColumns } from "../types"
import { CreateOffice, GetAllOffices, GetOffice, PatchOffice } from "../service/OfficeApi"
import { Button, Dropdown, FormField, PopUp, Table } from "../components"


export const OfficesPage = () => {
    const {executeRequest} = useRequest()
    const {offices, setOffices} = useOffices()

    const [selectedOffice, setSelectedOffice] = useState<OfficeResponse>()
    const [isEditOpen,setIsEditOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState('allstates')

    const blankForm = {
        name: '',
        location:'',
        openingHour:'',
        closingHour:'',
        status: 'ACTIVE'
    }

    const [createForm, setCreateForm] = useState<OfficeCreate>(blankForm)
    const [editForm, setEditForm] = useState<OfficePatch>(blankForm)

    const filteredOffices = offices.filter(o => statusFilter === 'allstates' ? true: o.status === statusFilter )

    const formFields: FormProps[] =[
        {label: "Name of the office", type: "text", placeHolder: "Ex. Office 401", key: "name"},
        {label: "Location", type: "text", placeHolder: "Ex. Building B, Floor 4", key: "location"},
        {label: "Opening Hour", type: "time", placeHolder: "Ex. Building B, Floor 4", key: "openingHour"},
        {label: "Closing Hour", type: "time", placeHolder: "Ex. Building B, Floor 4", key: "closingHour"},
    ]

    const columns: TableColumns<OfficeResponse>[]= [
        {header: "id", key: "id"},
        {header: "name", key: "name"},
        {header: "location", key: "location"},
        {header: "status", key: "status"},
        {header: "Actions", key: "id", render: (_value, row: any) => (
            <div>
                <Button title="edit" behavior={() => {setSelectedOffice(row)
                    setEditForm({
                        name: row.name,
                        location: row.location,
                        status: row.status,
                        openingHour: row.openingHour,
                        closingHour: row.closingHour
                    })
                    setIsEditOpen(true);}}/>
            </div>
        )}
    ]

    const dropDownOptions: DropdownOptions<DropdownProps>={
        data:  [
        {display: 'All states', value: 'allstates'},
        {display: 'Available', value: 'AVAILABLE'},
        {display: 'In Maintenance', value: 'MAINTENANCE'},
        {display: 'Unavailable', value: 'UNAVAILABLE'}],
    }


    async function LoadOffices(){
        const data = await executeRequest('Patients have been loaded', GetAllOffices)
        if(data){
            setOffices(data)
        }
    }

    async function handleCreate(office:OfficeCreate){
        const created = await executeRequest('Patient created succesfully', () => CreateOffice(office))
        if (created){
            setOffices((currentOffices) => [created, ...currentOffices])
        }
    }

    async function handleViewDetails(officeId:number){
        const office = await executeRequest(`Patient No# ${officeId} found`, () => GetOffice(officeId))
        if(office){
            setSelectedOffice(office)
        }
    }

    async function handlePatch(office:OfficePatch, officeId:number){
        const patchedOffice = await executeRequest('Patient successfully patched',
             () => PatchOffice(office, officeId))
            
        if(patchedOffice){
            setOffices((current) => current.map((o) => o.id === officeId ? patchedOffice : o))
            setSelectedOffice(patchedOffice)
        }
    }

    return(
        <main className="main-content">
            <div>
                <h1>Offices</h1>
                <p>{offices.length} offices registered</p>
                <Button title="+ New Office" behavior={()=> setIsOpen(true)}/>
                <PopUp isOpen = {isOpen} onClose={()=> setIsOpen(false)}>
                    {formFields.map(f => (
                        <FormField 
                            label={f.label} 
                            type={f.type} 
                            placeHolder={f.placeHolder} 
                            key={f.key}
                            value = {createForm[f.key as keyof OfficeCreate]}
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
                    {formFields.map(f => (
                        <FormField 
                            label={f.label} 
                            type={f.type} 
                            placeHolder={f.placeHolder} 
                            key={f.key}
                            value = {editForm[f.key as keyof OfficePatch]}
                            onChange={(e) => setEditForm({...editForm, [f.key]: e.target.value})}
                            />) )}
                        <Dropdown data = {dropDownOptions.data}
                        value={editForm.status}
                        onChange={(value) => setEditForm({...editForm, status: value as PatientStatus})}
                        />
                        <Button title="Edit" behavior={() => {handlePatch(editForm, Number(selectedOffice?.id))
                            setIsEditOpen(false)
                            setEditForm(blankForm)
                        }}/>
                         <Button title="Cancel" behavior={() => {setIsEditOpen(false)
                        setEditForm(blankForm)
                        }}/>
                </PopUp>
                <Dropdown data={dropDownOptions.data}
                        value ={statusFilter}
                        onChange={(value) => setStatusFilter(String(value))}/>
                <Table columns={columns} data={filteredOffices}/>
            </div>
        </main>
    )

}