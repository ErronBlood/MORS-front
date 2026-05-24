import { useState } from "react"
import { Button, FormField, Table, Dropdown, PopUp } from "../components"
import type { PatientResponse, TableColumns } from "../types"
import { Form } from "react-router"

export const PatientsPage = () => {

    const [patients, setPatients] = useState<PatientResponse[]>([
        {id: 1, email: "pene@gmail.com", phone: "7984651", status: "ACTIVE", appointments: [1]},
        {id: 2, email: "ESCRTO@gmail.com", phone: "4835645", status: "INACTIVE", appointments: [1]}
    ])

    const[isOpen, setIsOpen] = useState(false)

    const columns: TableColumns<PatientResponse>[]= [
        {header: "id", key: "id"},
        {header: "email", key: "email"},
        {header: "phone", key: "phone"},
        {header: "state", key: "status"}
    ]

    return(
        <main className="container-fluid p-4">
            <div>
                <h1>Patients</h1>
                <p>current x amount of y patients</p>
                <Button title="+ New Patient" behavior={()=> setIsOpen(true)}/>
                <PopUp isOpen = {isOpen} onClose={()=> setIsOpen(false)}>
                   <FormField></FormField> 
                 </PopUp>
                <FormField/>
                <Dropdown/>
                <Table columns={columns} data={patients}/>
            </div>
        </main>
    )
}