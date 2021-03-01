/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import CanvasJSReact from '../../../lib/canvasjs.react';
import {FormattedMessage} from "react-intl";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export function WithdrawalWidget(props){
	const {className} = props;

	return (
		<>
			{/* begin::Tiles Widget 1 */}
			<div className={`card card-custom ${className}`}>
				{/* begin::Header */}
				<div className="card-header border-0 pt-5">
					<div className="card-title">
						<div className="card-label">
							<div className="font-weight-bolder">
								<FormattedMessage id={"DASHBOARD.WITHDRAWAL_INFO"}/>
							</div>
							{/*<div className="font-size-sm text-muted mt-2">890,344 Sales</div>*/}
						</div>
					</div>
					<div className="card-toolbar">
					</div>
				</div>
				{/* end::Header */}

				{/* begin::Body */}
				<div className="card-body d-flex flex-column px-0 pt-0 pb-2">
					{/* begin::Items */}
					<div className="flex-grow-1 card-spacer-x">
						{/* begin::Item */}
						<div className="d-flex align-items-center justify-content-center pt-5 pb-1">
							<div className="d-flex flex-wrap align-items-center justify-content-between w-100">
								<div className="text-dark-75 font-weight-bold font-size-lg mb-1">
									<FormattedMessage id={"DASHBOARD.MONTH_AVERAGE_WITHDRAWAL_NUMBER"}/>:
								</div>
								<span className="label label-lg label-light-primary label-inline font-weight-bold py-4">
									{}
								</span>
							</div>
						</div>
						{/* end::Item */}

						{/* begin::Item */}
						<div className="d-flex align-items-center justify-content-center pt-5 pb-1">
							<div className="d-flex flex-wrap align-items-center justify-content-between w-100">
								<div className="text-dark-75 font-weight-bold font-size-lg mb-1">
									<FormattedMessage id={"DASHBOARD.PENDING_WITHDRAWAL_NUMBER"}/>:
								</div>
								<span className="label label-lg label-light-primary label-inline font-weight-bold py-4">
									{}
								</span>
							</div>
						</div>
						{/* end::Item */}

						{/* begin::Item */}
						<div className="d-flex align-items-center justify-content-center pt-5 pb-1">
							<div className="d-flex flex-wrap align-items-center justify-content-between w-100">
								<div className="text-dark-75 font-weight-bold font-size-lg mb-1">
									<FormattedMessage id={"DASHBOARD.DAY_AVERAGE_WITHDRAWAL_AMOUNT"}/>
								</div>
								<span className="label label-lg label-light-primary label-inline font-weight-bold py-4">
									{}
								</span>
							</div>
						</div>
						{/* end::Item */}

						{/*/!* begin::Item *!/*/}
						{/*<div className="d-flex align-items-center justify-content-center py-5">*/}
						{/*	<Link to={"/attention-panel"} className={"btn btn-primary py-4"}>*/}
						{/*		ACCESO PANEL DE ATENCIÓN*/}
						{/*	</Link>*/}
						{/*</div>*/}
						{/*/!* end::Item *!/*/}
					</div>
					{/* end::Items */}
				</div>
				{/* end::Body */}
			</div>
			{/* end::Tiles Widget 1 */}
		</>
	);
}
