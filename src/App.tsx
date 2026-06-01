import './umo_style.css'
import { Header, SideBar } from './components/'
import { BrowserRouter, Routes, Route } from 'react-router'
import { PatientsPage } from './pages/PatientsPage'
import { DashboardPage } from './pages/DashboardPage'
import { DoctorPage } from './pages/DoctorsPage'
import { AppointmentsPage } from './pages/AppointmentsPage'
import { PatientsProvider, DoctorsProvider, AppointmentTypeProvider, OfficesProvider, AppointmentProvider, SpecialtiesProvider } from './context/context'
import { CatalogPage } from './pages/CatalogPage'


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
        <Header/>
        <SideBar/>
        <Routes>
          <Route path='/' element={<DashboardPage/>}></Route>
          <Route path='/Dashboard' element={<DashboardPage/>}></Route>
          <Route path = '/PatientsPage' element = {<PatientsPage/>}></Route>
          <Route path = '/AppointmentsPage' element = {<AppointmentsPage/>}></Route>
          <Route path = '/DoctorsPage' element = {<DoctorPage/>}></Route>
          <Route path = '/CatalogPage' element = {<CatalogPage/>}></Route>
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
