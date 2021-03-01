/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {getUserById} from "../../../../redux/userManage/userManageCRUD";
import config from "../../../../app/config";

export function DashboardUserManagerWidget(props){
	const {className, data} = props;

	return (
		<>
			{/* begin::Tiles Widget 1 */}
			<div className={`card card-custom ${className}`}>
				{/* begin::Header */}
				<div className="card-header border-0 pt-5">
					<div className="card-title">
						<div className="card-label">
							<div className="font-weight-bolder">Gestor de usuarios</div>
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
									Nº de usuarios totales:
								</div>
								<span className="label label-lg label-light-primary label-inline font-weight-bold py-4">
									{data.totalUserCount}
								</span>
							</div>
						</div>
						{/* end::Item */}
					</div>
					{/* end::Items */}
				</div>
				{/* end::Body */}
			</div>
			{/* end::Tiles Widget 1 */}
		</>
	);
}
