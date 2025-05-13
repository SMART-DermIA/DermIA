import React from "react";

import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

const ApexChart = () => {
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
			categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001','4/11/2001' ,'5/11/2001' ,'6/11/2001'],
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
		data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
	},
	{
		name: t('album.asymmetry'),
		data: [1, 15, 30, 36, 70, 74, 80, 84, 86, 88, 94, 98, 94, 92, 85, 93, 92, 95]
	},
	{
		name: t('album.size'),
		data: [6, 15, 80, 85, 88, 90, 94, 96, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
	},
	{
		name: t('album.color'),
		data: [40, 30, 20, 12, 15, 20, 30, 40, 40, 60, 67, 70, 60, 60, 65, 63, 68, 61]
	},
	{
		name: t('album.mean'),
		data: [25, 40, 50, 66, 70, 70, 85, 70, 80, 90, 100, 90, 90, 90, 90, 90, 90, 90]
	}
  ];

  return (
	<div className="chart-wrapper">
		<Chart className="album-chart" options={options} series={series} type="line" height={400} width={700} />
	</div>
  );
};
export default ApexChart;