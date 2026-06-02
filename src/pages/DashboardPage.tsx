import { MetricCard } from "../components/MetricCard"
import { useAppointments, useDoctors, usePatients } from "../context/context"

export const DashboardPage = () => {
    
    const {patients} = usePatients()
    const {doctors} = useDoctors()
    const {appointments} = useAppointments()

    return(



        <main className="main-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Dashboard</h1>
            </div>
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <MetricCard label="Active Patients" value = {patients.filter(p =>p.status === "ACTIVE").length} info='' />
                </div>
                <div className="col-md-3">
                    <MetricCard label="Active Doctors"  value = {doctors.filter(p =>p.active === "ACTIVE").length} info='' />
                </div>
                <div className="col-md-3">
                    <MetricCard label="Pending Appointments" value = {appointments.filter(a => a.status === "SCHEDULED").length} info="Awaiting confirmation" />
                </div>
            </div>
        </main>
    )
}
