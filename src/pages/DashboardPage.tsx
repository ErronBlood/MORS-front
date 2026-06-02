import { MetricCard } from "../components/MetricCard"
import { usePatients } from "../context/context"

export const DashboardPage = () => {
    
    const {patients} = usePatients()

    return(
        <main className="container-fluid p-4" style={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ color: '#0d1b2a', fontWeight: 800 }}>Dashboard</h1>
            </div>
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <MetricCard label="Active Patients" value = {patients.length} info='' />
                </div>
                <div className="col-md-3">
                    <MetricCard label="Productividad Doctores"  value = {100} info="DICK" />
                </div>
                <div className="col-md-3">
                    <MetricCard label="Pacientes Inasistentes" value = {100} info="DICK" />
                </div>
            </div>
        </main>
    )
}
