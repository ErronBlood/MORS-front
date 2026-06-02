import { useEffect, useState } from "react"
import { useRequest } from "../service/GeneralApi"
import type { AppointmentCancel, AppointmentCompletion, AppointmentCreate, AppointmentResponse, DropdownProps, FormProps, TableColumns } from "../types"
import { CancelAppointment, CompleteAppointment, CreateAppointment, GetAllAppointments, GetAppointment, NoShowAppointment } from "../service/AppointmentApi"
import { Button, Dropdown, FormField, PopUp, Table } from "../components"
import { useAppointments, useAppointmentTypes, useDoctors, useOffices, usePatients } from "../context/context"


export const AppointmentsPage = () => {
        const {executeRequest} = useRequest()
        const [isOpen, setIsOpen] = useState(false)
        const [SelectedAppointment, setSelectedAppointment] = useState(null)

        const blankForm = {
            startAt: '',
            endAt: '',
            patientId: 0,
            doctorId: 0,
            officeId: 0,
            appointmentTypeId: 0
        }

        const [formData, setFormData] = useState(blankForm)

        const {appointments, setAppointments} = useAppointments()
        const {patients} = usePatients()
        const {doctors} = useDoctors()
        const {appointmentTypes} = useAppointmentTypes()
        const {offices} = useOffices()

        const statesDropdown: DropdownProps[]= [
            {display: 'Scheduled', value: 'SCHEDULE'},
            {display: 'Confirmed', value: 'CONFIRMED'},
            {display: 'Cancelled', value: 'CANCELLED'},
            {display: 'Completed', value: 'COMPLETED'},
            {display: 'No Show', value: 'NO_SHOW'}
        ]

        const doctorsDropdown: DropdownProps[] = doctors.map(
            d => ({
                display: d.fullName,
                value: d.id
            })
        )

        const typesDropdown: DropdownProps[] = appointmentTypes.map(
            a => ({
                value: a.id,
                display: a.name
            })
        )

        const officesDropdown: DropdownProps[] = offices.map(
            o => ({
                value: o.id,
                display: o.name
            })
        )

        const patientsDropdown: DropdownProps[] = patients.map(
            p => ({
                value: p.id,
                display: p.fullName
            })
        )
        
        const formFields: FormProps[] = [
            {label: "Start Time", type: "datetime-local", key: "startAt"},
            {label: "End Time", type: "datetime-local", key: "endAt"}
        ]

        const columns: TableColumns<AppointmentResponse>[]= [
            {header: "id", key: "id"},
            {header: "Patient", key: "patientId", render: (value: any) => patients.find(p => p.id === value)?.fullName ?? String(value)},
            {header: "Doctor", key: "doctorId", render: (value: any) => doctors.find(d => d.id === value)?.fullName ?? String(value)},
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

        useEffect(() => {
            if (patients.length > 0 && doctors.length > 0 && 
                appointmentTypes.length > 0 && offices.length > 0) {
                setFormData(prev => ({
                     ...prev,
                    patientId: patients[0].id,
                    doctorId: doctors[0].id,
                    appointmentTypeId: appointmentTypes[0].id,
                    officeId: offices[0].id
                }))
            }
        } , [patients, doctors, appointmentTypes, offices])


        return(
                <main className="main-content">
                    <div>
                        <h1>Appointments</h1>
                        <p>current x amount of y patients</p>
                        <Button title="+ New Appointment" behavior={()=> setIsOpen(true)}/>
                        <PopUp isOpen = {isOpen} onClose={()=> setIsOpen(false)}>

                            <Dropdown data = {patientsDropdown}
                                value={formData.patientId}
                                onChange={(value) => setFormData({
                                    ...formData, patientId:Number(value)
                                })}
                            />

                            <Dropdown data={doctorsDropdown}
                                value={formData.doctorId}
                                onChange={(value) => setFormData({
                                    ...formData, doctorId:Number(value)
                                })}
                            />

                            <Dropdown data={typesDropdown}
                                value={formData.appointmentTypeId}
                                onChange={(value) => setFormData({
                                    ...formData, appointmentTypeId:Number(value)
                                })}
                            />

                            <Dropdown data={officesDropdown}
                                value={formData.officeId}
                                onChange={(value) => setFormData({
                                    ...formData, officeId:Number(value)
                                })}
                            />

                            {formFields.map(f => (
                                <FormField
                                label={f.label}
                                type={f.type}
                                key={f.key}
                                value={formData[f.key as keyof AppointmentCreate]}
                                onChange={(e) => setFormData({...formData, [f.key]: e.target.value })}
                                />
                            ))}

                            <Button title="Registrar" behavior={() => {handleCreate(formData)
                                setIsOpen(false),
                                setFormData(blankForm)
                            }}/>
                            <Button title="Cancelar" behavior={() => {setIsOpen(false)}}/>
                        </PopUp>

                        <Dropdown data={doctorsDropdown} />

                        <Dropdown data = {statesDropdown}/>
                        <Table columns={columns} data={appointments}/>
                    </div>
                </main>
        )
}