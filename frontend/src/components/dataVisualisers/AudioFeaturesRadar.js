import React from 'react';
import { ResponsiveRadar } from '@nivo/radar'
import Theme from "./GraphTheme"

const AudioFeaturesRadar = ({ data, sideMargin, topMargin, gridLabelOffset }) => (
    <ResponsiveRadar
        theme={Theme}
        data={data}
        keys={['Average']}
        indexBy="feature"
        valueFormat=">-.2f"
        margin={{ top: topMargin, right: sideMargin, bottom: topMargin, left: sideMargin }}
        borderColor={{ from: 'color' }}
        gridLabelOffset={gridLabelOffset}
        dotSize={10}
        dotBorderWidth={2}
        colors={['#1DB954']}
        blendMode="normal"
        motionConfig="wobbly"
        legends={[
            {
                anchor: 'bottom',
                direction: 'column',
                translateX: 0,
                translateY: 0,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
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
        ]}
    />
)

export default AudioFeaturesRadar;