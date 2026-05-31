import { useEffect, useState } from "react"
import { useRequest } from "../service/GeneralApi"
import { useAppointmentTypes, useSpecialties } from "../context/context"
import { CreateSpecialty, GetAllSpecialties, GetSpecialty } from "../service/SpecialtyApi"
import { CreateAppointmentType, GetAllAppointmentTypes, GetAppointmentType } from "../service/AppointmentTypeApi"
import type { AppointmentTypeCreate, DropdownProps, FormProps, SpecialtyCreate } from "../types"
import { Button, Dropdown, FormField, PopUp, Table } from "../components"


export const CatalogPage = () => {
        const {executeRequest} = useRequest()
        const [isOpenSpecialty, setIsOpenSpecialty] = useState(false)
        const [isOpenType, setIsOpenType] = useState(false)
        const [SelectedAppointmentType, setSelectedAppointmentType] = useState(null)
        const [selectedSpecialty, setSelectedSpecialty] = useState(null)


        const {appointmentTypes, setAppointmentTypes} = useAppointmentTypes()
        const {specialties, setSpecialties} = useSpecialties()


    const specialtyFields :FormProps[]= [
        {label:'Name of the type', type:'text', placeHolder:'Ex. Check-up', key:'name'},
        {label:'Description', type:'text', placeHolder:'Brief description of the field', key:'description'},
    ]

    const appointmentTypeFields :FormProps[]= [
        {label:'Name of the specialty', type:'text', placeHolder:'Ex. Psychology', key:'name'},
    ]

    const typesTimes: DropdownProps[]= [
        {display: '30 minutes', value: '30'},
        {display: '45 minutes', value: '45'},
        {display: '60 minutes', value: '60'}
    ]

    async function LoadSpecialties(){
        const specialties = await executeRequest('Patients have been loaded', GetAllSpecialties)
        if(specialties){
            setSpecialties(specialties)
        }
    }

    async function LoadAppointmentTypes(){
        const types = await executeRequest('Patients have been loaded',GetAllAppointmentTypes)
        if(types){
            setAppointmentTypes(types)
        }
    }

    async function handleCreateSpecialty(specialty:SpecialtyCreate){
        const created = await executeRequest('Patient created succesfully', () => CreateSpecialty(specialty))
        if (created){
            setSpecialties((currentSpecialties) => [created, ...currentSpecialties])
        }
    }

    async function handleViewDetailsSpecialty(specialtyId:number){
        const specialty = await executeRequest(`Patient No# ${specialtyId} found`, () => GetSpecialty(specialtyId))
        if(specialty){
            setSelectedSpecialty(specialty)
        }
    }

    async function handleCreateAppointmentType(type: AppointmentTypeCreate){
        const created = await executeRequest('Appointment Type created successfully', () => CreateAppointmentType(type))
        if (created){
            setAppointmentTypes((currentAppointmentTypes) => [created, ...currentAppointmentTypes])
        }
    }

    async function handleViewDetailsAppointmetType(typeId:number){
        const type = await executeRequest(`Patient No# ${typeId} found`, () => GetAppointmentType(typeId))
        if(type){
            setSelectedAppointmentType(type)
        }
    }

    useEffect(() => {
        LoadAppointmentTypes()
        LoadSpecialties()
    }, [])

    return(
        <main className="container-fluid p-4">
            <div>
                <h1>Patients</h1>
                <p>current x amount of y patients</p>
                <div>
                    <Button title="+ New Specialty" behavior={()=> setIsOpenSpecialty(true)}/>
                    <PopUp isOpen = {isOpenSpecialty} onClose={()=> setIsOpenSpecialty(false)}>
                        {specialtyFields.map(f => (<FormField label={f.label} 
                        type={f.type} placeHolder={f.placeHolder} key={f.key}/>) )}
                        <Button title="Registrar" behavior={() => {}}/>
                        <Button title="Cancelar" behavior={() => {setIsOpenSpecialty(false)}}/>
                    </PopUp>
                </div>
                <div>
                    <Button title="+ New Type" behavior={()=> setIsOpenType(true)}/>
                    <PopUp isOpen = {isOpenType} onClose={()=> setIsOpenType(false)}>
                        {appointmentTypeFields.map(f => (<FormField label={f.label} 
                        type={f.type} placeHolder={f.placeHolder} key={f.key}/>) )}
                        <Dropdown data = {typesTimes}></Dropdown>
                        <Button title="Registrar" behavior={() => {}}/>
                        <Button title="Cancelar" behavior={() => {setIsOpenType(false)}}/>
                    </PopUp>
                </div>
            </div>
        </main>
    )
}