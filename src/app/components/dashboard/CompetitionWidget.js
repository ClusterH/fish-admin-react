/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from "react";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";
import {getProgressingCompetitions} from "../../../http/competitionCRUD";

export function CompetitionWidget(props) {
	const {className} = props;
	const [competitions, setCompetitions] = useState([]);

	useEffect(() => {
		getProgressingCompetitions().then((res) => {
			console.log(res.data.result)
			setCompetitions(res.data.result);
		}).catch(err => {
			console.log(err)
		});
	}, [])

	return (
		<>
			{/* begin::Tiles Widget 1 */}
			<div className={`card card-custom ${className}`}>
				{/* begin::Header */}
				<div className="card-header border-0 pt-5">
					<div className="card-title">
						<div className="card-label">
							<div className="font-weight-bolder">
								<FormattedMessage id={"DASHBOARD.CURRENT_COMPETITIONS"}/>
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
							<div className="w-100">
								{competitions.map((item, idx) => {
									return (
										<div key={`${idx}`} className="border rounded px-4 py-2 mb-1">
											<div className="d-flex justify-content-between">
												<div className="text-primary">
													<span className="text-danger">{item.type > 1 ? "[특별전]" : null}</span>
													{item.name}
												</div>
												<div>{item.mode === 1 ? "랭킹전" : "퀘스트전"}</div>
											</div>
											<div className="d-flex justify-content-end">
												시작: &nbsp;
												<span>
													{new Date(item.startDate).toLocaleString()}
												</span>
											</div>
											<div className="d-flex justify-content-end">
												종료: &nbsp;
												<span>
													{new Date(item.endDate).toLocaleString()}
												</span>
											</div>
										</div>
									)
								})}
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
