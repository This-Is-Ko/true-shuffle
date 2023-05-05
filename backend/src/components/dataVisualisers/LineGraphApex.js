import React from 'react';
import ReactApexChart from "react-apexcharts";

const LineGraphApex = ({ data }) => {
    const xValues = data[0]["data"].map((point) => point["x"]);
    const yValues = data[0]["data"].map((point) => point["y"]);

    var chartData = {
        options: {
          chart: {
            id: "area-datetime"
          },
          xaxis: {
            type: 'datetime',
            categories: xValues
          }
        },
        series: [
          {
            name: "series-1",
            data: yValues
          }
        ]
      };
    return (<ReactApexChart options={chartData.options} series={chartData.series} type="area" height={500} />)
}

export default LineGraphApex;