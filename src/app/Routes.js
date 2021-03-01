/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React, {useEffect} from "react";
import {Redirect, Switch, Route} from "react-router-dom";
import {shallowEqual, useSelector} from "react-redux";
import {Layout} from "../_metronic/layout";
import BasePage from "./BasePage";
import {Logout, AuthPage} from "./pages/Auth";
import ErrorsPage from "./components/ErrorsExamples/ErrorsPage";
import setAuthToken from "../utils/setAuthToken";
import ResetPassword from "./pages/Auth/ResetPassword";


export function Routes() {
	const {isAuthorized} = useSelector(
		({auth}) => ({
			isAuthorized: !!auth.user,
		}),
		shallowEqual
	);

	// useEffect(() => {
	// 	const token = localStorage.jwtToken;
	// 	if (token) {
	// 		setAuthToken(token);
	// 	}
	// }, []);

	console.log('Routes: isAuthorized: =============>', isAuthorized)

	return (
		<Switch>
			<Route path={"/reset-password"} component={ResetPassword}/>
			{!localStorage.getItem('jwtToken') ? (
				/*Render auth page when user at `/auth` and not authorized.*/
				<Route>
					<AuthPage/>
				</Route>
			) : (
				/*Otherwise redirect to root page (`/`)*/
				<Redirect from="/auth" to="/"/>
			)}

			<Route path="/error" component={ErrorsPage}/>
			<Route path="/logout" component={Logout}/>


			{!localStorage.getItem('jwtToken') ? (
				/*Redirect to `/auth` when user is not authorized*/
				<Redirect to="/auth/login"/>
			) : (
				<Layout>
					<BasePage/>
				</Layout>
			)}
		</Switch>
	);
}
