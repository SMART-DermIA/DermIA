import React from "react";

import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

const ApexChart = ({dates, irregularity, asymmetry, size, color, mean}) => {
	const { t } = useTranslation();

  	const options = {
		chart: {
			type: 'line',
		},
		stroke: {
			width: 4,
			curve: 'straight',
			dashArray: [0, 0, 0, 0, 5]
		},
		colors: ['#FF4560', '#008FFB', '#00E396', '#775DD0', '#FEB019'],
		xaxis: {
			type: 'datetime',
			categories: dates,
			labels: {
				formatter: function (value, timestamp, opts) {
					if (!timestamp) return ""; // Verifica que timestamp no sea undefined
					return new Date(timestamp).toLocaleDateString(); // Formatea la fecha
				}
			}
		},
		yaxis: {
			max: 100,
		},
		title: {
			text: t('album.chartTitle'),
			align: 'left',
			style: {
			fontSize: "16px",
			color: '#660033'
			}
		},
		responsive: [{
			breakpoint: 768,
			options: {
				chart: {
					width: '100%'
				},
				legend: {
					position: 'bottom'
				}
			}
		}]
	};
  const series = [
	{
		name: t('album.irregularity'),
		data: irregularity
	},
	{
		name: t('album.asymmetry'),
		data: asymmetry
	},
	{
		name: t('album.size'),
		data: size
	},
	{
		name: t('album.color'),
		data: color
	},
	{
		name: t('album.mean'),
		data: mean
	}
  ];

  return (
	<div className="chart-wrapper">
		<Chart className="album-chart" options={options} series={series} type="line" height={400} width={700} />
	</div>
  );
};
export default ApexChart;