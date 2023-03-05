import React from 'react';
import { ResponsiveLine } from '@nivo/line'
import Theme from "./LineTheme"

const LineGraph = ({ data }) => (
    <ResponsiveLine
        theme={Theme}
        data={data}
        margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
        xScale={{ format: "%Y-%m-%d", type: "time", precision: 'day' }}
        xFormat="time:%Y-%m-%d"
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2d"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickValues: "every 1 week",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: "%Y-%m-%d",
            legend: "Date",
            legendOffset: 36,
            legendPosition: "middle"
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        enableGridX={false}
        colors={['#1DB954']}
        pointSize={10}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom',
                direction: 'column',
                justify: false,
                translateX: 0,
                translateY: 100,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)

export default LineGraph;