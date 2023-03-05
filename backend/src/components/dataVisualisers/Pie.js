import React from 'react';
import { ResponsivePie } from '@nivo/pie'
import Theme from "./GraphTheme"

const Pie = ({ data, sideMargin, topMargin, labelDiagonalLength, labelStraightLength, enableArcLinkLabels, enableLegend }) => {
    let legend = []
    if (enableLegend) {
        legend =
            [
                {
                    anchor: 'bottom',
                    direction: 'column',
                    justify: false,
                    translateX: 0,
                    translateY: 150,
                    itemsSpacing: 0,
                    itemWidth: 83,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]
    }
    if (enableArcLinkLabels == null) {
        enableArcLinkLabels = true
    }
    return <ResponsivePie
        theme={Theme}
        data={data}
        margin={{ top: topMargin, right: sideMargin, bottom: topMargin, left: sideMargin }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'category10' }}
        borderWidth={1}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.2
                ]
            ]
        }}
        enableArcLinkLabels={enableArcLinkLabels}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#ffffff"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLinkLabelsDiagonalLength={labelDiagonalLength}
        arcLinkLabelsStraightLength={labelStraightLength}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2
                ]
            ]
        }}
        legends={legend}
    />
}

export default Pie;