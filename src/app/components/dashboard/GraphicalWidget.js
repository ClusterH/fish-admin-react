/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import CanvasJSReact from '../../../lib/canvasjs.react';
import {FormattedMessage} from "react-intl";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export function GraphicalWidget(props) {
    const {className} = props;

    const options_style = {
        theme: "light2",
        animationEnabled: true,
        title: {
            text: "칭호",
            fontSize: 16,
        },
        height: 400,
        data: [{
            type: "pie",
            startAngle: 0,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: false,
            legendText: "{label}",
            indexLabelFontSize: 14,
            indexLabel: "{label} {y}%",
            indexLabelFontColor: "#000",
            indexLabelPlacement: "outside",
            dataPoints: [
                {y: 17, label: "초보 낚시꾼"},
                {y: 8, label: "수습 낚시꾼"},
                {y: 20, label: "숙련된 낚시꾼"},
                {y: 18, label: "전문 낚시꾼"},
                {y: 12, label: "낚시광"},
                {y: 15, label: "내가 왕이 될 상인가?"},
                {y: 7, label: "낚시명인"},
                {y: 3, label: "낚시의 맛을 아는자!"},
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
                {y: 2, label: "mac"},
                {y: 3, label: "Windows"},
                {y: 4, label: "Otros"},
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
                {label: "Win 10", y: 8},
                {label: "Win 7", y: 7},
                {label: "MacOS", y: 6},
                {label: "Win 8", y: 5},
                {label: "Win XP", y: 4},
                {label: "Linux", y: 3},
                {label: "Otros", y: 2},
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
                            <div className="font-weight-bolder">
                                <FormattedMessage id={"DASHBOARD.GRAPHICAL_STATISTIC"}/>
                            </div>
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
                            <CanvasJSChart options={options_style}/>
                        </div>
                        {/*<div className={"col xs-12 sm-6"}>*/}
                        {/*    <CanvasJSChart options={options_pc}/>*/}
                        {/*</div>*/}
                    </div>
                    {/*<CanvasJSChart options={options_bar_chart}/>*/}
                </div>
                {/* end::Body */}
            </div>
            {/* end::Tiles Widget 1 */}
        </>
    );
}
