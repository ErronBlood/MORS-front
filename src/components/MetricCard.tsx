import type { MetricCardProps } from "../types"

export const MetricCard = ({ label, value, info }: MetricCardProps ) => {
    return(
        <div className="card p-3">
            <span>{label}</span>
            <h1>{value}</h1>
            <span>{info}</span>
        </div>
    )
}