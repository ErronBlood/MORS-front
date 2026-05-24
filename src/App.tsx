import './App.css'
import { Header, SideBar } from './components/'
import { HomePage } from './pages' 
import { BrowserRouter, Routes, Route } from 'react-router'
import { PatientsPage } from './pages/PatientsPage'
function App() {
  return (
    <>
    
    
    <BrowserRouter>
    <Header/>
    <SideBar/>
    <Routes>
      <Route path='/HomePage' element={<HomePage/>}></Route>
      <Route path = '/PatientsPage' element = {<PatientsPage/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
