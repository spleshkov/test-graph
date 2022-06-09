import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';


const Graph = ({ data }) => {
    return (
        <AreaChart
            width={900}
            height={300}
            data={data}
            baseValue="dataMin"
            margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis stroke="#e3e3e3" dataKey="time" />
            <YAxis stroke="#e3e3e3" />
            <Tooltip itemStyle={{ color: '#233142' }} labelStyle={{ color: '#233142' }} />
            <Area type="monotone" dataKey="energy" stroke="#e3e3e3" fill="#f95959" />
        </AreaChart>
    );
};

export default Graph;