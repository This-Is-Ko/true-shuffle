import React from 'react';
import ReactApexChart from "react-apexcharts";

const LineGraphApex = ({ xValues, yValues, yName }) => {
    var chartData = {
        options: {
          colors: ["#1DB954"],
          chart: {
            id: "area-datetime"
          },
          xaxis: {
            type: 'datetime',
            categories: xValues
          },
          yaxis: {
            title: {
              text: "Count"
            }
          }
        },
        series: [
          {
            name: yName,
            data: yValues
          }
        ]
      };
    return (<ReactApexChart options={chartData.options} series={chartData.series} type="area" height={500} />)
}

export default LineGraphApex;