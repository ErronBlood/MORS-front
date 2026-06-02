import { useEffect, useState } from "react"
import { useRequest } from "../service/GeneralApi"
import type { DoctorCreate, DoctorPatch, DoctorResponse, DropdownProps, FormProps, TableColumns } from "../types"
import { CreateDoctor, GetAllDoctors, GetDoctor, PatchDoctor } from "../service/DoctorApi"
import { Button, Dropdown, FormField, PopUp, Table } from "../components"
import { useDoctors, useSpecialties } from "../context/context"

export const DoctorPage = () => {

    const {executeRequest} = useRequest()
    const [isOpen, setIsOpen] = useState(false)
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    
    const blankForm = {
        fullName:'',
        email: '',
        licenseNumber: '',
        specialtyId: 0
    }

    const [formData, setFormData] = useState<DoctorCreate>(blankForm)
    const {specialties} = useSpecialties()
    const {doctors, setDoctors} = useDoctors()

    const dropDownOptions: DropdownProps[]= specialties.map(s => ({
        display: s.name,
        value: s.id
    }))

    const formFields :FormProps[]= [
        {label:'Full Name', type:'text', placeHolder:'Ex. Maria Garcia', key:'fullName'},
        {label:'Email', type:'text', placeHolder:'email@uni.edu.co', key:'email'},
        {label:'License Number', type:'text', placeHolder:'123456789', key:'licenseNumber'},
    ]

    const columns: TableColumns<DoctorResponse>[]= [
        {header: "Doctor", key:"fullName"},
        {header: "Specialty", key: "specialty", render: (value: any) => value?.name ?? "" }
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

        useEffect(()=>{
                LoadDoctors()
            }, [])
        
            useEffect(() => {
                if(specialties.length > 0){
                    setFormData(prev => ({...prev, specialtyId: specialties[0].id}))
                }
            }, [specialties])

            return(
                <main className="container-fluid p-4">
                    <div>
                        <h1>Doctors</h1>
                        <p>current x amount of y doctors</p>
                        <Button title="+ New Doctor" behavior={()=> setIsOpen(true)}/>
                        <PopUp isOpen = {isOpen} onClose={()=> setIsOpen(false)}>
                        {formFields.map(f => (
                        <FormField 
                            label={f.label} 
                            type={f.type} 
                            placeHolder={f.placeHolder} 
                            key={f.key}
                            value = {formData[f.key as keyof DoctorCreate]}
                            onChange={(e) => setFormData({...formData, [f.key]: e.target.value})}
                            />) )}
                            <Dropdown data={dropDownOptions}
                                    value={formData.specialtyId}
                                    onChange={(value) => setFormData({...formData, specialtyId: Number(value)})} />
                            <Button title="Save" behavior={() => {
                                handleCreate(formData)
                                setIsOpen(false)
                                setFormData(blankForm)
                            }}/>
                            <Button title="Cancel" behavior={() => {setIsOpen(false)}}/>
                        </PopUp>
                        <Table columns={columns} data={doctors}/>
                    </div>
                </main>
            )
}