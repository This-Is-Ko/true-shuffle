import React from 'react';
import { Box } from "@mui/material";
import { ResponsiveBar } from '@nivo/bar'
import { transformReleaseYearData } from "../../utils/StatisticsService"

const ReleaseYearGraph = ({ data }) => {
    const transformedData = transformReleaseYearData(data)
    console.log(transformedData)
    return (<Box sx={{ height:"500px" }}><ResponsiveBar
        data={transformedData}
        indexBy="year"
        margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'year',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendPosition: 'middle',
            legendOffset: -40
        }}
    /></Box>)
}

export default ReleaseYearGraph;