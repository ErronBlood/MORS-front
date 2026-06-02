import { useEffect, useState } from "react"
import { useRequest } from "../service/GeneralApi"
import type { AppointmentCancel, AppointmentCompletion, AppointmentCreate, AppointmentResponse, DropdownProps, FormProps, TableColumns } from "../types"
import { CancelAppointment, CompleteAppointment, ConfirmAppointment, CreateAppointment, GetAllAppointments, GetAppointment, NoShowAppointment } from "../service/AppointmentApi"
import { Button, Dropdown, FormField, PopUp, Table } from "../components"
import { useAppointments, useAppointmentTypes, useDoctors, useOffices, usePatients } from "../context/context"


export const AppointmentsPage = () => {
        const {executeRequest} = useRequest()
        const [isOpen, setIsOpen] = useState(false)
        const [isCancelOpen, setIsCancelOpen] = useState(false)
        const [isCompletingOpen, setIsCompletingOpen] = useState(false)
        const [SelectedAppointment, setSelectedAppointment] = useState<AppointmentResponse>()
        const [doctorsFilter, setDoctorsFilter] = useState('alldoctors')
        const [stateFilter, setStateFilter] = useState('allstates')
        const [cancelForm, setCancelForm] = useState<AppointmentCancel>()
        const [completionForm, setCompletionForm] = useState<AppointmentCompletion>()

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
        
        const filteredAppointments = appointments.filter(a => {
            const doctorMatch = doctorsFilter === 'alldoctors' || a.doctorId === Number(doctorsFilter)
            const stateMatch = stateFilter === 'allstates' || a.status === stateFilter

            return doctorMatch && stateMatch
        })

        const statesDropdown: DropdownProps[]= [
            {display: 'All States', value: 'allstates'},
            {display: 'Scheduled', value: 'SCHEDULED'},
            {display: 'Confirmed', value: 'CONFIRMED'},
            {display: 'Cancelled', value: 'CANCELLED'},
            {display: 'Completed', value: 'COMPLETED'},
            {display: 'No Show', value: 'NO_SHOW'}
        ]

        const docs = doctors.map(
            d => ({
                display: d.fullName,
                value: d.id
            })
        )

        const doctorsDropdown: DropdownProps[] =[
            {display: 'All Doctors', value: 'alldoctors'},
            ...docs
        ]

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
            {header: "status", key: "status"},
            { header: "Actions", key: "id", render: (_value, row: any) => {
                const availableActions = appointmentActions[row.status as keyof typeof appointmentActions] ?? [];
                return (
                    <div>
                        {availableActions.map(action => (
                            <Button
                                key={action}
                                title={actionConfig[action].label}
                                behavior={() =>{ actionConfig[action].handler(row.id)
                                    setSelectedAppointment(row)
                                }}
                            />
                        ))}
                    </div>
                )
            }}
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
            const completedAppointment = await executeRequest('Patient successfully patched',
                 () => CompleteAppointment(appointment,appointmentId))
                
            if(completedAppointment){
                setAppointments((current) => current.map((a) => a.id === appointmentId ? completedAppointment : a))
                setSelectedAppointment(completedAppointment)
            }
        }

        async function handleConfirm(appointmentId:number){
            const confirmedAppointment = await executeRequest('Patient successfully patched',
                 () => ConfirmAppointment(appointmentId))
                
            if(confirmedAppointment){
                setAppointments((current) => current.map((a) => a.id === appointmentId ? confirmedAppointment : a))
                setSelectedAppointment(confirmedAppointment)
            }
        }

        const appointmentActions: Record<string, (keyof typeof actionConfig)[]> = {
             SCHEDULED:  ['confirm', 'cancel'],
             CONFIRMED:  ['complete', 'cancel', 'noshow'],
             COMPLETED:  [],
             CANCELLED:  [],
             NO_SHOW:    [],
        }

        const actionConfig = {
            confirm:  { label: 'Confirm',   handler: (id: number) => handleConfirm(id) },
            cancel:   { label: 'Cancel',    handler: (row: AppointmentResponse) => {setSelectedAppointment(row)
                setIsCancelOpen(true)
            }},
            complete: { label: 'Complete',  handler: (row: AppointmentResponse) =>{setSelectedAppointment(row)
                setIsCompletingOpen(true)
            }},
            noshow:   { label: 'No Show',   handler: (id:number) => handleNoShow(id) },
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
                        <p> {appointments.length} appointments stored </p>
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
                                onChange={(e) => setFormData({...formData, [f.key!]: e.target.value })}
                                />
                            ))}

                            <Button title="Save" behavior={() => {handleCreate(formData)
                                setIsOpen(false),
                                setFormData(blankForm)
                            }}/>
                            <Button title="Cancel" behavior={() => {setIsOpen(false)}}/>
                        </PopUp>

                        <PopUp isOpen={isCancelOpen} onClose={() => setIsCancelOpen(false)}>
                            <FormField label="Cancellation Reason"
                            type="text"
                            placeHolder="Brief reason why the appointment was cancelled"
                            value={cancelForm?.cancellationReason}
                            onChange={(e) => setCancelForm({cancellationReason: e.target.value})}
                            />

                            <Button
                            title="Confirm Cancellation"
                            behavior={() =>{ handleCancel(cancelForm! ,Number (SelectedAppointment?.id))
                                setIsCancelOpen(false)
                            }}
                            
                            />
                        </PopUp>

                        <PopUp isOpen={isCompletingOpen} onClose={() => setIsCompletingOpen(false)}>
                            <FormField label="Completion notes"
                            type="text"
                            placeHolder="Summary of the results of the appointment"
                            value={completionForm?.observations}
                            onChange={(e) => setCompletionForm({observations: e.target.value})}
                            />

                            <Button
                            title="Confirm Completion"
                            behavior={() =>{handleCompletion(completionForm! ,Number (SelectedAppointment?.id))
                                setIsCompletingOpen(false)
                            }}
                            />
                        </PopUp>

                        <Dropdown data={doctorsDropdown}
                        value={doctorsFilter}
                        onChange={(value) => setDoctorsFilter(String(value)) }  />

                        <Dropdown data = {statesDropdown} 
                        value={stateFilter}
                        onChange={(value) => setStateFilter(String(value))}
                        />
                        <Table columns={columns} data={filteredAppointments}/>
                    </div>
                </main>
        )
}