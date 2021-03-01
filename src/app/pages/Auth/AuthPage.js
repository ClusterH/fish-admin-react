/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from "react";
import {Link, Switch, Redirect} from "react-router-dom";
import {ContentRoute} from "../../../_metronic/layout"
import Login from "./Login";
import Registration from "./Registration";
import ForgotPassword from "./ForgotPassword";
import "../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";
import {FormattedMessage} from "react-intl";
import {LanguageSelectorDropdown} from "../../../_metronic/layout/components/extras/dropdowns/LanguageSelectorDropdown";


export function AuthPage() {

	return (
		<>
			<div className="d-flex flex-column flex-root">
				{/*begin::Login*/}
				<div
					className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-row-fluid bg-white"
					id="kt_login"
				>
					{/*begin::Aside*/}
					<div
						className="login-aside d-flex flex-row-auto bgi-no-repeat p-10 p-lg-10"
						// style={{
						// 	backgroundImage: `url(${toAbsoluteUrl("/media/bg/background.png")})`,
						// 	objectFit: 'cover',
						// }}
					>
						{/*begin: Aside Container*/}
						<div className="d-flex flex-row-fluid flex-column justify-content-between">
							<Link to="/" className="flex-column-auto">
							</Link>

							<div className="d-none flex-column-auto d-lg-flex justify-content-center mt-10">
								<div className="opacity-70 font-weight-bold	text-white">
									&copy; 2020 낚시의 맛 관리자페이지
								</div>
							</div>
						</div>
						{/*end: Aside Container*/}
					</div>
					{/*begin::Aside*/}

					{/*begin::Content*/}
					<div className="flex-row-fluid d-flex flex-column position-relative p-7 overflow-hidden">
						{/*begin::Content header*/}
						<div
							className="position-absolute top-0 right-0 text-right mt-5 mr-5 mb-15 mb-lg-0 flex-column-auto justify-content-center py-5 px-10">
							<span className="font-weight-bold text-dark-50"><FormattedMessage id={"AUTH.NO_ACCOUNT"}/></span>
							<Link to="/auth/registration" className="font-weight-bold ml-2" id="kt_login_signup">
								<FormattedMessage id={"AUTH.SIGN_UP"}/>
							</Link>
						</div>
						{/*end::Content header*/}

						{/* begin::Content body */}
						<div className="d-flex flex-column-fluid flex-center mt-30 mt-lg-0">
							<Switch>
								<ContentRoute path="/auth/login" component={Login}/>
								<ContentRoute path="/auth/registration" component={Registration}/>
								<ContentRoute path="/auth/forgot-password" component={ForgotPassword}/>
								{/*<ContentRoute path="/auth/reset-password/:key?" component={ResetPassword}/>*/}
								<Redirect from="/auth" exact={true} to="/auth/login"/>
								<Redirect to="/auth/login"/>
							</Switch>
						</div>
						{/*end::Content body*/}

						{/*begin::Language selector*/}
						<div className="position-absolute top-0 right-0 mt-5 mb-15 mb-lg-0 flex-column-auto justify-content-center py-1">
							<LanguageSelectorDropdown/>
						</div>
						{/*end::Language selector*/}

						{/* begin::Mobile footer */}
						<div
							className="d-flex d-lg-none flex-column-auto flex-column flex-sm-row justify-content-center align-items-center mt-5 p-5">
							<div className="text-dark-50 font-weight-bold order-2 order-sm-1 my-2">
								&copy; 2020 낚시의 맛 관리자페이지
							</div>
						</div>
						{/* end::Mobile footer */}
					</div>
					{/*end::Content*/}
				</div>
				{/*end::Login*/}
			</div>
		</>
	);
}
