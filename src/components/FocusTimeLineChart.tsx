"use client"

import {Line, CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip} from "recharts"
import {rgb} from "d3-color";

const data = [
    {name: '01/01', Total: Math.random() * 10 + 3},
    {name: '02/01', Total: Math.random() * 10 + 3},
    {name: '03/01', Total: Math.random() * 10 + 3},
    {name: '04/01', Total: Math.random() * 10 + 3},
    {name: '05/01', Total: Math.random() * 10 + 3},
    {name: '06/01', Total: Math.random() * 10 + 3},
    {name: '07/01', Total: Math.random() * 10 + 3},
    {name: '08/01', Total: Math.random() * 10 + 3},
    {name: '09/01', Total: Math.random() * 10 + 3},
    {name: '10/01', Total: Math.random() * 10 + 3},
    {name: '11/01', Total: Math.random() * 10 + 3},
    {name: '12/01', Total: Math.random() * 10 + 3},
    {name: '13/01', Total: Math.random() * 10 + 3},
    {name: '14/01', Total: Math.random() * 10 + 3},
    {name: '15/01', Total: Math.random() * 10 + 3},
]

export function FocusTimeLineChart() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Line type="monotone" dataKey="Total" stroke='#0f172a' strokeWidth={2} activeDot={{r: 8}}/>
            </LineChart>
        </ResponsiveContainer>
    )
}