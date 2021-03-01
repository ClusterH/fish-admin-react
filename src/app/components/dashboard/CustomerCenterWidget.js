/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import {getAllQuestion} from "../../../http/customCenterCRUD";

export function CustomerCenterWidget(props){
	const {className} = props;
	const [questions, setQuestions] = useState([]);

	useEffect(() => {
		getAllQuestion({limit: 2}).then((res) => {
			console.log(res.data.result)
			setQuestions(res.data.result);
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
								<FormattedMessage id={"DASHBOARD.CUSTOMER_CENTER_INFO"}/>
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
								{questions.map((item, idx) => {
									return (
										<div key={`${idx}`} className="border rounded px-4 py-2 mb-1">
											<div className="d-flex justify-content-between pb-3">
												<div className="text-light-dark font-size-xs">
													{new Date(item.questionDate).toLocaleString()}
												</div>
												{item.answer !== null ? (
													<div className="rounded bg-success text-white px-5 py-1 font-size-xs">
														답변완료
													</div>
												) : null}
											</div>
											<div className="font-size-h5 font-weight-boldest text-primary">
												{item.question}
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
