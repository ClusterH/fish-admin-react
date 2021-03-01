/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import {useSelector, useDispatch} from "react-redux";
import objectPath from "object-path";
import {useHtmlClassService} from "../../..";
import {toAbsoluteUrl} from "../../../../_helpers";
import {DropdownTopbarItemToggler} from "../../../../_partials/dropdowns";
import {FormattedMessage} from "react-intl";
import {actions} from "../../../../../redux/authRedux";
import jwt_decode from "jwt-decode"

export function UserProfileDropdown(props) {
	// const {user} = useSelector(state => state.auth);
	// const dispatch = useDispatch();
	const token = localStorage.getItem("jwtToken");
	const user = token ? jwt_decode(token) : undefined;
	console.log('userProfileDropdown', user?.name)

	const uiService = useHtmlClassService();
	const layoutProps = useMemo(() => {
		return {
			light: objectPath.get(uiService.config, "extras.user.dropdown.style") === "light",
		};
	}, [uiService]);

	return (
		<Dropdown drop="down" alignRight>
			<Dropdown.Toggle
				as={DropdownTopbarItemToggler}
				id="dropdown-toggle-user-profile"
			>
				<div className={"btn btn-icon btn-hover-transparent-white d-flex align-items-center btn-lg px-md-2 w-md-auto"}>
					<span className="text-white opacity-70 font-weight-bold font-size-base d-none d-md-inline mr-3">
						<FormattedMessage id={"HEADER.HI"}/>,
					</span>
					<span className="text-white opacity-90 font-weight-bolder font-size-base d-none d-md-inline">
						{user?.name}
					</span>
					<span className="text-white opacity-70 font-weight-bold font-size-base d-none d-md-inline mr-1">
						<FormattedMessage id={"HEADER.NIM"}/>
					</span>
					<span className="symbol symbol-35">
						<span className="symbol-label text-white font-size-h5 font-weight-bold bg-white-o-30">{user?.name[0]}</span>
					</span>
				</div>
			</Dropdown.Toggle>
			<Dropdown.Menu
				className="dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim-up dropdown-menu-lg p-0">
				<>
					{/** ClassName should be 'dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
					{layoutProps.light && (
						<>
							<div className="d-flex align-items-center p-8 rounded-top">
								<div className="symbol symbol-md bg-light-primary mr-3 flex-shrink-0">
									<img src={toAbsoluteUrl("/media/users/default.jpg")} alt=""/>
								</div>
								<div>
									<div className="text-dark m-0 flex-grow-1 mr-3 font-size-h5">
										{user?.name}
									</div>
									<div>
										({user?.email})
									</div>
								</div>

								{/*<span className="label label-light-success label-lg font-weight-bold label-inline">3 messages</span>*/}
							</div>
							{/*<div className="separator separator-solid"/>*/}
						</>
					)}

					{!layoutProps.light && (
						<div
							className="d-flex align-items-center justify-content-between flex-wrap p-8 bgi-size-cover bgi-no-repeat rounded-top"
							style={{backgroundImage: `url(${toAbsoluteUrl("/media/users/default.jpg")})`}}
						>
							<div className="symbol bg-white-o-15 mr-3">
								<span className="symbol-label text-success font-weight-bold font-size-h4">{user?.name[0]}</span>
								{/*<img alt="Pic" className="hidden" src={user.pic}/>*/}
							</div>
							<div>
								<div className="text-dark m-0 flex-grow-1 mr-3 font-size-h5">
									{user?.name}
								</div>
								<div>
									({user?.email})
								</div>
							</div>
							{/*<span className="label label-success label-lg font-weight-bold label-inline">3 messages</span>*/}
						</div>
					)}
				</>

				<div className="navi navi-spacer-x-0">
					<div className="navi-footer d-flex justify-content-end px-8">
						<Link to="/logout" className="btn btn-light-primary font-weight-bold">
							<FormattedMessage id={"AUTH.SIGN_OUT"}/>
						</Link>
					</div>
				</div>
			</Dropdown.Menu>
		</Dropdown>
	);
}
