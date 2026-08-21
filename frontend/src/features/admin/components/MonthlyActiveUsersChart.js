import React from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "@mui/material";

const MonthlyActiveUsersChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <Typography variant="body1" sx={{ color: "lightgrey", fontStyle: "italic", textAlign: "center", py: 4 }}>
                No shuffle activity yet
            </Typography>
        );
    }

    const options = {
        chart: {
            id: "monthly-active-users",
            toolbar: { show: false },
            background: "transparent",
        },
        colors: ["#1DB954"],
        plotOptions: {
            bar: {
                columnWidth: "55%",
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: data.map(item => item.month),
            labels: { style: { colors: "#ccc" } },
            title: { text: "Month", style: { color: "#ccc" } },
        },
        yaxis: {
            labels: { style: { colors: "#ccc" } },
            title: { text: "Active Users", style: { color: "#ccc" } },
        },
        grid: { borderColor: "#333" },
    };

    const series = [
        { name: "Active Users", data: data.map(item => item.active_users) },
    ];

    return <ReactApexChart options={options} series={series} type="bar" height={350} />;
};

export default MonthlyActiveUsersChart;
