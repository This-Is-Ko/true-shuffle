import React from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "@mui/material";

const FailureRateChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <Typography variant="body1" sx={{ color: "lightgrey", fontStyle: "italic", textAlign: "center", py: 4 }}>
                No shuffle data yet
            </Typography>
        );
    }

    const options = {
        chart: {
            id: "failure-rate",
            toolbar: { show: false },
            background: "transparent",
        },
        colors: ["#e15241"],
        stroke: { curve: "smooth", width: 3 },
        dataLabels: { enabled: false },
        xaxis: {
            categories: data.map(item => item.period),
            labels: { style: { colors: "#ccc" } },
            title: { text: "Period", style: { color: "#ccc" } },
        },
        yaxis: {
            max: 100,
            labels: {
                style: { colors: "#ccc" },
                formatter: (value) => `${value}%`,
            },
            title: { text: "Failure Rate", style: { color: "#ccc" } },
        },
        grid: { borderColor: "#333" },
        tooltip: {
            y: { formatter: (value) => `${value}%` },
        },
    };

    const series = [
        {
            name: "Failure Rate",
            data: data.map(item => Number((item.rate * 100).toFixed(1))),
        },
    ];

    return <ReactApexChart options={options} series={series} type="line" height={350} />;
};

export default FailureRateChart;
