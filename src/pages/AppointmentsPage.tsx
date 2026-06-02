import { useEffect, useState } from "react"
import { useRequest } from "../service/GeneralApi"
import type { AppointmentCancel, AppointmentCompletion, AppointmentCreate, AppointmentResponse, DropdownProps, TableColumns } from "../types"
import { CancelAppointment, CompleteAppointment, CreateAppointment, GetAllAppointments, GetAppointment, NoShowAppointment } from "../service/AppointmentApi"
import { Button, Dropdown, PopUp, Table } from "../components"
import { useAppointments, useAppointmentTypes, useDoctors, useOffices, usePatients } from "../context/context"


export const AppointmentsPage = () => {
        const {executeRequest} = useRequest()
        const [isOpen, setIsOpen] = useState(false)
        const [SelectedAppointment, setSelectedAppointment] = useState(null)

        const {appointments, setAppointments} = useAppointments()
        const {patients} = usePatients()
        const {doctors} = useDoctors()
        const {appointmentTypes} = useAppointmentTypes()
        const {offices} = useOffices()


        const statesDropdown: DropdownProps[]= [
            {display: 'Medicina General', value: 'medicinaGeneral'},
            {display: 'Psicologia', value: 'psicologia'},
            {display: 'Fisioterapia', value: 'fisioterapia'},
            {display: 'Nutricion', value: 'nutricion'}
        ]
        
        //add patient, doctor and action buttons for each
        //maybe instead let them be selectable, and open a poppup with change state options

        const columns: TableColumns<AppointmentResponse>[]= [
            {header: "id", key: "id"},
            {header: "Office", key: "officeId"},
            {header: "status", key: "status"}
        ]
        
         async function LoadAppointments(){
                const data = await executeRequest('Patients have been loaded', GetAllAppointments)
                if(data){
                    setAppointments(data)
                }
            }
        async function handleCreate(appointment:AppointmentCreate){
            const created = await executeRequest('Patient created succesfully', () => CreateAppointment(appointment))
            if (created){
                setAppointments((currentAppointment) => [created, ...currentAppointment])
            }
        }
    
        async function handleViewDetails(appointmentId:number){
            const appointment = await executeRequest(`Patient No# ${appointmentId} found`, () => GetAppointment(appointmentId))
            if(appointment){
                setSelectedAppointment(appointment)
            }
        }
    
        async function handleCancel(appointment:AppointmentCancel, appointmentId:number){
            const cancelledAppointment = await executeRequest('Patient successfully patched',
                 () => CancelAppointment(appointment,appointmentId))
                
            if(cancelledAppointment){
                setAppointments((current) => current.map((a) => a.id === appointmentId ? cancelledAppointment : a))
                setSelectedAppointment(cancelledAppointment)
            }
        }

        async function handleNoShow(appointmentId:number){
            const noShowAppointment = await executeRequest('Patient successfully patched',
                 () => NoShowAppointment(appointmentId))
                
            if(noShowAppointment){
                setAppointments((current) => current.map((a) => a.id === appointmentId ? noShowAppointment : a))
                setSelectedAppointment(noShowAppointment)
            }
        }

        async function handleCompletion(appointment:AppointmentCompletion, appointmentId:number){
            const cancelledAppointment = await executeRequest('Patient successfully patched',
                 () => CompleteAppointment(appointment,appointmentId))
                
            if(cancelledAppointment){
                setAppointments((current) => current.map((a) => a.id === appointmentId ? cancelledAppointment : a))
                setSelectedAppointment(cancelledAppointment)
            }
        }

        useEffect(()=>{
                LoadAppointments()
            }, [])


        return(
                <main className="container-fluid p-4">
                    <div>
                        <h1>Appointments</h1>
                        <p>current x amount of y patients</p>
                        <Button title="+ New Doctor" behavior={()=> setIsOpen(true)}/>
                        <PopUp isOpen = {isOpen} onClose={()=> setIsOpen(false)}>

                            <Dropdown data = {patients.map(p => ({
                                value: p.id,
                                display: p.fullName
                            }))} ></Dropdown>

                            <Dropdown data={doctors.map(d => ({
                                value: d.id,
                                display: d.fullName
                            }))} />

                            <Dropdown data={appointmentTypes.map(a => ({
                                value: a.id,
                                display: a.name
                            }))} />

                            <Dropdown data={offices.map(o => ({
                                value: o.id,
                                display: o.name
                            }))} />
                            {/*añadir campo para las observaciones*/}
                            <Button title="Registrar" behavior={() => {}}/>
                            <Button title="Cancelar" behavior={() => {setIsOpen(false)}}/>
                        </PopUp>

                        <Dropdown data={doctors.map(d => ({
                                value: d.id,
                                display: d.fullName
                            }))} />

                        <Dropdown data = {statesDropdown}/>
                        <Table columns={columns} data={appointments}/>
                    </div>
                </main>
        )
}