/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import CanvasJSReact from '../../../../lib/canvasjs.react';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export function DashboardConnectionStatisticsWidget(props){
	const {className, data} = props;
	const android = (data.androidCount * 100 / data.totalSPCount).toFixed(2);
	const ios = (data.iosCount * 100 / data.totalSPCount).toFixed(2);
	const otherSP = 100 - android - ios;
	const windows = (data.windowsCount * 100 / data.totalPCCount).toFixed(2);
	const mac = (data.macCount * 100 / data.totalPCCount).toFixed(2);
	const otherPC = 100 - windows - mac;


	const options_sp = {
		theme: "light2",
		animationEnabled: true,
		title: {
			text: "Smartphone",
			fontSize: 16,
		},
		height: 200,
		data: [{
			type: "pie",
			startAngle: 0,
			toolTipContent: "<b>{label}</b>: {y}%",
			showInLegend: false,
			legendText: "{label}",
			indexLabelFontSize: 14,
			indexLabel: "{label} {y}%",
			indexLabelFontColor: "#000",
			indexLabelPlacement: "inside",
			dataPoints: [
				{y: ios, label: "iOS"},
				{y: android, label: "Android"},
				{y: otherSP, label: "Otros"},
			]
		}]
	};

	const options_pc = {
		theme: "light2",
		animationEnabled: true,
		title: {
			text: "PC",
			fontSize: 16,
		},
		height: 200,
		data: [{
			type: "pie",
			startAngle: 0,
			toolTipContent: "<b>{label}</b>: {y}%",
			showInLegend: false,
			legendText: "{label}",
			indexLabelFontSize: 14,
			indexLabel: "{label} {y}%",
			indexLabelFontColor: "#000",
			indexLabelPlacement: "inside",
			dataPoints: [
				{y: mac, label: "mac"},
				{y: windows, label: "Windows"},
				{y: otherPC, label: "Otros"},
			]
		}]
	};

	const options_bar_chart = {
		theme: "light2",
		animationEnabled: true,
		title: {
			text: "Sistema Operativo",
			fontSize: 16,
		},
		height: 320,
		axisX: {
			interval: 1,
			labelFontSize: 12,
			labelAngle: -45,
		},
		data: [{
			type: "column",
			dataPoints: [
				{label: "Win 10", y: data.win10Count},
				{label: "Win 7", y: data.win7Count},
				{label: "MacOS", y: data.macCount},
				{label: "Win 8", y: data.win8Count},
				{label: "Win XP", y: data.winXpCount},
				{label: "Linux", y: data.linuxCount},
				{label: "Otros", y: data.totalPCCount - data.win10Count - data.win7Count - data.macCount - data.win8Count - data.winXpCount - data.linuxCount},
			]
		}]
	};

	return (
		<>
			{/* begin::Tiles Widget 1 */}
			<div className={`card card-custom ${className}`}>
				{/* begin::Header */}
				<div className="card-header border-0 pt-5">
					<div className="card-title">
						<div className="card-label">
							<div className="font-weight-bolder">Estadísticas de conexión</div>
							{/*<div className="font-size-sm text-muted mt-2">890,344 Sales</div>*/}
						</div>
					</div>
					<div className="card-toolbar">
					</div>
				</div>
				{/* end::Header */}

				{/* begin::Body */}
				<div className="card-body d-flex flex-column px-0 py-0">
					<div className={"row"} style={{flex: 'unset'}}>
						<div className={"col xs-12 sm-6"}>
							<CanvasJSChart options={options_sp}/>
						</div>
						<div className={"col xs-12 sm-6"}>
							<CanvasJSChart options={options_pc}/>
						</div>
					</div>
					<CanvasJSChart options={options_bar_chart}/>
				</div>
				{/* end::Body */}
			</div>
			{/* end::Tiles Widget 1 */}
		</>
	);
}
