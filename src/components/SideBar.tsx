import { NavLink } from "react-router"

export const SideBar = () => {
    return(
        <nav className="d-flex flex-column border-end bg-white vh-100 p-3">
            <NavLink to='/HomePage'>Home</NavLink>
            <NavLink to='/PatientsPage'>Patients</NavLink>
        </nav>
    )
}