import { useEffect, useState } from "react"
import { useRequest } from "../service/GeneralApi"
import type { DoctorCreate, DoctorPatch, DoctorResponse, DropdownProps, FormProps, PatientDoctorStatus, TableColumns } from "../types"
import { CreateDoctor, GetAllDoctors, GetDoctor, PatchDoctor } from "../service/DoctorApi"
import { Button, Dropdown, FormField, PopUp, Table } from "../components"
import { useDoctors, useSpecialties } from "../context/context"
import { WeeklySchedule } from "../components/WeeklySchedule"

export const DoctorPage = () => {

    const {executeRequest} = useRequest()
    const [isOpen, setIsOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isScheduleOpen, setIsScheduleOpen] = useState(false)
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorResponse>()
    const [statusFilter, setStatusFilter] = useState('allstates')
    
    const blankForm = {
        fullName:'',
        email: '',
        licenseNumber: '',
        specialtyId: 0,
        active: "ACTIVE"
    }

    const [createForm, setCreateForm] = useState<DoctorCreate>(blankForm)
    const [editForm, setEditForm] = useState<DoctorPatch>(blankForm)
    const {specialties} = useSpecialties()
    const {doctors, setDoctors} = useDoctors()

    const filteredDoctors = doctors.filter(o => statusFilter === 'allstates' ? true: o.active === statusFilter )

    const dropDownSpecialties: DropdownProps[]= specialties.map(s => ({
        display: s.name,
        value: s.id
    }))

    const dropDownActive: DropdownProps[]=[
        {display: "Active", value: "ACTIVE"},
        {display: "Inactive", value: "INACTIVE"},
    ]

    const dropDownFilter: DropdownProps[]=[
        {display: "All States", value: "allstates"},
        {display: "Active", value: "ACTIVE"},
        {display: "Inactive", value: "INACTIVE"},
    ]

    const formFields :FormProps[]= [
        {label:'Full Name', type:'text', placeHolder:'Ex. Maria Garcia', key:'fullName'},
        {label:'Email', type:'text', placeHolder:'email@uni.edu.co', key:'email'},
        {label:'License Number', type:'text', placeHolder:'123456789', key:'licenseNumber'},
    ]

    const columns: TableColumns<DoctorResponse>[]= [
        {header: "Doctor", key:"fullName"},
        {header: "Specialty", key: "specialty", render: (value: any) => value?.name ?? "" },
        {header: "state", key: "active"},
        { header: "Actions", key: "id", render: (_value, row: any) => (
            <div>
                <Button title="Edit" behavior={() => {setSelectedDoctor(row)
                    setEditForm({
                        fullName: row.fullName,
                        email: row.email,
                        licenseNumber: row.licenseNumber,
                        active: row.active,
                        specialtyId: row.specialty?.id
                    })
                    setIsEditOpen(true); }}/>
                <Button title="View" behavior={() => {setSelectedDoctor(row)
                    setIsViewOpen(true);}}/>
                <Button title = "Schedules" behavior={() => {setSelectedDoctor(row)
                setIsScheduleOpen(true)
                }}></Button>
            </div>
            
        )},
    ]

    async function LoadDoctors(){
        const data = await executeRequest('Patients have been loaded', GetAllDoctors)
        if(data){
            setDoctors(data)
        }
    }

     async function handleCreate(doctor:DoctorCreate){
            const created = await executeRequest('Patient created succesfully', () => CreateDoctor(doctor))
            if (created){
                setDoctors((currentDoctors) => [created, ...currentDoctors])
            }
        }
    
        async function handleViewDetails(doctorId:number){
            const doctor = await executeRequest(`Patient No# ${doctorId} found`, () => GetDoctor(doctorId))
            if(doctor){
                setSelectedDoctor(doctor)
            }
        }
    
        async function handlePatch(doctor:DoctorPatch, doctorId:number){
            const patchedDoctor = await executeRequest('Patient successfully patched',
                 () => PatchDoctor(doctor, doctorId))
                
            if(patchedDoctor){
                setDoctors((current) => current.map((d) => d.id === doctorId ? patchedDoctor : d))
                setSelectedDoctor(patchedDoctor)
            }
        }
        
            useEffect(() => {
                if(specialties.length > 0){
                    setCreateForm(prev => ({...prev, specialtyId: specialties[0].id})),
                    setEditForm(prev => prev ? ({...prev, specialtyId: specialties[0].id}) : undefined)
                }
            }, [specialties])

            return(
                <main className="main-content">
                    <div>
                        <h1>Doctors</h1>
                        <p>amount of active doctors {doctors.filter(d => d.active === "ACTIVE").length}</p>
                        <p>total amount of doctors {doctors.length}</p>
                        <Button title="+ New Doctor" behavior={()=> setIsOpen(true)}/>

                            {/*creation pop up*/}
                        <PopUp isOpen = {isOpen} onClose={()=> setIsOpen(false)}>
                        {formFields.map(f => (
                        <FormField 
                            label={f.label} 
                            type={f.type} 
                            placeHolder={f.placeHolder} 
                            key={f.key}
                            value = {createForm[f.key as keyof DoctorCreate]}
                            onChange={(e) => setCreateForm({...createForm, [f.key]: e.target.value})}
                            />) )}
                            <Dropdown data={dropDownSpecialties}
                                    value={createForm.specialtyId}
                                    onChange={(value) => setCreateForm({...createForm, specialtyId: Number(value)})} />
                            <Button title="Save" behavior={() => {
                                handleCreate(createForm)
                                setIsOpen(false)
                                setCreateForm(blankForm)
                            }}/>
                            <Button title="Cancel" behavior={() => {setIsOpen(false)}}/>
                        </PopUp>
                            
                            {/*editing pop up*/}
                        <PopUp isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
                            {formFields.map(f => (
                        <FormField 
                            label={f.label} 
                            type={f.type} 
                            placeHolder={f.placeHolder} 
                            key={f.key}
                            value = {editForm[f.key as keyof DoctorPatch]}
                            onChange={(e) => setEditForm({...editForm, [f.key]: e.target.value})}
                            />) )}
                            <Dropdown data={dropDownSpecialties}
                                    value={editForm.specialtyId}
                                    onChange={(value) => setEditForm({...editForm, specialtyId: Number(value)})} />
                            <Dropdown data={dropDownActive}
                                    value={editForm.active}
                                    onChange={(value) => setEditForm({...editForm, active: value as PatientDoctorStatus})} />

                             <Button title="Save" behavior={() => {
                                handlePatch(editForm, Number(selectedDoctor?.id))
                                setIsEditOpen(false)
                                setCreateForm(blankForm)
                            }}/>
                            <Button title="Cancel" behavior={() => {setIsEditOpen(false)}}/>
                        </PopUp>
                                {/*Viewing popup*/}

                        <PopUp isOpen={isViewOpen} onClose={() => setIsViewOpen(false)}>
                            <div>
                                <p><strong>Name:</strong> {selectedDoctor?.fullName}</p>
                                <p><strong>Email:</strong> {selectedDoctor?.email}</p>
                                <p><strong>License Number:</strong> {selectedDoctor?.licenseNumber}</p>
                                <p><strong>Status:</strong> {selectedDoctor?.active}</p>
                                <p><strong>Specialty:</strong> {selectedDoctor?.specialty.name}</p>
                            </div>
                            <Button title="Cancel" behavior={() => {setIsViewOpen(false)}}/>
                        </PopUp>

                        <PopUp isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)}>
                            {selectedDoctor && <WeeklySchedule doctor={selectedDoctor} />}
                            <Button title="Cancel" behavior={() => {setIsScheduleOpen(false)}}/>
                        </PopUp>
                <Dropdown data={dropDownFilter}
                        value ={statusFilter}
                        onChange={(value) => setStatusFilter(String(value))}/>
                        <Table columns={columns} data={filteredDoctors}/>
                    </div>
                </main>
            )
}