import './umo_style.css'
import { Header, SideBar } from './components/'
import { BrowserRouter, Routes, Route } from 'react-router'
import { PatientsPage } from './pages/PatientsPage'
import { DashboardPage } from './pages/DashboardPage'
import { DoctorPage } from './pages/DoctorsPage'
import { AppointmentsPage } from './pages/AppointmentsPage'
import { PatientsProvider, DoctorsProvider, AppointmentTypeProvider, OfficesProvider, AppointmentProvider, SpecialtiesProvider, usePatients, useDoctors, useSpecialties, useOffices, useAppointmentTypes, useAppointments } from './context/context'
import { CatalogPage } from './pages/CatalogPage'
import { OfficesPage } from './pages/OfficesPage'
import { useRequest } from './service/GeneralApi'
import { useEffect } from 'react'
import { GetAllPatients } from './service/PatientApi'
import { GetAllDoctors } from './service/DoctorApi'
import { GetAllSpecialties } from './service/SpecialtyApi'
import { GetAllOffices } from './service/OfficeApi'
import { GetAllAppointmentTypes } from './service/AppointmentTypeApi'
import { GetAllAppointments } from './service/AppointmentApi'
import { AvailabilityPage } from './pages/AvailabilityPage'


  const AppDataLoader = () => {
    const { executeRequest } = useRequest()
    const { setPatients } = usePatients()
    const { setDoctors } = useDoctors()
    const { setSpecialties } = useSpecialties()
    const { setOffices } = useOffices()
    const { setAppointmentTypes } = useAppointmentTypes()
    const { setAppointments } = useAppointments()
  
    useEffect(() => {
        executeRequest('Loaded', GetAllPatients).then(d => d && setPatients(d))
        executeRequest('Loaded', GetAllDoctors).then(d => d && setDoctors(d))
        executeRequest('Loaded', GetAllSpecialties).then(d => d && setSpecialties(d))
        executeRequest('Loaded', GetAllOffices).then(d => d && setOffices(d))
        executeRequest('Loaded', GetAllAppointmentTypes).then(d => d && setAppointmentTypes(d))
        executeRequest('Loaded', GetAllAppointments).then(d => d && setAppointments(d))

    }, [])
  
    return null
}

function App() {

  return (
    <>
    <BrowserRouter>
      <PatientsProvider>
      <DoctorsProvider>
      <AppointmentTypeProvider>
      <OfficesProvider>
      <AppointmentProvider>
      <SpecialtiesProvider>
        <AppDataLoader/>
        <Header/>
        <SideBar/>
        <Routes>
          <Route path='/' element={<DashboardPage/>}></Route>
          <Route path='/Dashboard' element={<DashboardPage/>}></Route>
          <Route path = '/PatientsPage' element = {<PatientsPage/>}></Route>
          <Route path = '/AppointmentsPage' element = {<AppointmentsPage/>}></Route>
          <Route path = '/DoctorsPage' element = {<DoctorPage/>}></Route>
          <Route path = '/CatalogPage' element = {<CatalogPage/>}></Route>
          <Route path = '/OfficesPage' element = {<OfficesPage/>}></Route>
          <Route path = '/AvailabilityPage' element = {<AvailabilityPage/>}></Route>
        </Routes>
      </SpecialtiesProvider>
      </AppointmentProvider>
      </OfficesProvider>
      </AppointmentTypeProvider>
      </DoctorsProvider>
      </PatientsProvider>
    </BrowserRouter>
    </>
  )
}

export default App
