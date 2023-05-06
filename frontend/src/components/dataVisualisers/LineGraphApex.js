import React from 'react';
import ReactApexChart from "react-apexcharts";

const LineGraphApex = ({ data }) => {
    const xValues = data[0]["data"].map((point) => point["x"]);
    const yValues = data[0]["data"].map((point) => point["y"]);

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
            name: "Liked Songs",
            data: yValues
          }
        ]
      };
    return (<ReactApexChart options={chartData.options} series={chartData.series} type="area" height={500} />)
}

export default LineGraphApex;