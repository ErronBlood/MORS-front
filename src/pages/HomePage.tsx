import { useState } from 'react'
import {MetricCard, Table } from '../components'
import type { MetricCardProps } from '../types'

export const HomePage = () => {

    const [cardProps, setCardProps] = useState(
        {
            label: "pene",
            value: 10,
            info: "cocks"
        }
    )


    return (
        <main className="container-fluid p-4">
        </main>
    )
}