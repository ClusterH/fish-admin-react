import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {connect} from "react-redux";
import {FormattedMessage, injectIntl} from "react-intl";
import {useSelector, useDispatch} from "react-redux";
import * as auth from "../../../redux/authRedux";
import {login} from "../../../http/authCRUD";
import setAuthToken from "../../../utils/setAuthToken";
import detectrtc, {browser, isWebRTCSupported} from 'detectrtc';
import {InputAdornment} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';


/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
	email: "",
	password: "",
};

function Login(props) {
	const {intl} = props;
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState([]);
	const [os, setOs] = useState('');
	const [osVersion, setOsVersion] = useState('');
	const [osJavascript, setOsJavascript] = useState('');

	useEffect(() => {
		getOs()
	}, [])

	const getOs = () => {
		setOs(detectrtc.osName);
		setOsVersion(detectrtc.osVersion);
	}

	const LoginSchema = Yup.object().shape({
		email: Yup.string()
			.email(intl.formatMessage({id: "AUTH.VALIDATION.WRONG_EMAIL"}))
			.min(3, intl.formatMessage({id: "AUTH.VALIDATION.MIN_EMAIL_LENGTH"}))
			.max(50, intl.formatMessage({id: "AUTH.VALIDATION.MAX_EMAIL_LENGTH"}))
			.required(
				intl.formatMessage({
					id: "AUTH.VALIDATION.REQUIRED_EMAIL",
				})
			),
		password: Yup.string()
			.min(6, intl.formatMessage({id: "AUTH.VALIDATION.MIN_PASSWORD_LENGTH"}))
			.max(50, intl.formatMessage({id: "AUTH.VALIDATION.MAX_PASSWORD_LENGTH"}))
			.required(
				intl.formatMessage({
					id: "AUTH.VALIDATION.REQUIRED_PASSWORD",
				})
			),
	});

	const enableLoading = () => {
		setLoading(true);
	};

	const disableLoading = () => {
		setLoading(false);
	};

	const getInputClasses = (fieldname) => {
		if(formik.touched[fieldname] && formik.errors[fieldname]){
			return "is-invalid";
		}

		if(formik.touched[fieldname] && !formik.errors[fieldname]){
			return "is-valid";
		}

		return "";
	};

	const formik = useFormik({
		initialValues,
		validationSchema: LoginSchema,
		onSubmit: (values, {setStatus, setSubmitting}) => {
			enableLoading();
			const data = {
				email: values.email,
				password: values.password,
				device: os.toUpperCase(),
				osVersion: osVersion,
			};
			// setTimeout(() => {
				login(data)
					.then(({data: {accessToken}}) => {
						disableLoading();
						localStorage.setItem("jwtToken", accessToken);
						setAuthToken(accessToken);
						// dispatch(auth.actions.login(accessToken));
						props.login(accessToken);
					})
					.catch((err) => {
						disableLoading();
						setSubmitting(false);
						setErrors(err.response && err.response.data.msg);
					});
			// }, 1000);
		},
	});

	return (
		<div className="login-form login-signin" id="kt_login_signin_form">
			{/* begin::Head */}
			<div className="text-center mb-10 mb-lg-20">
				<h3 className="font-size-h1 font-weight-boldest text-primary">
					<FormattedMessage id="AUTH.LOGIN.TITLE"/>
				</h3>
			</div>
			{/* end::Head */}

			{/*begin::Form*/}
			<form
				onSubmit={formik.handleSubmit}
				className="form fv-plugins-bootstrap fv-plugins-framework"
			>
				{/* begin: Alert */}
				{errors && (
					errors.map((error, idx) => {
						return (
							<div className="mb-10 alert alert-custom alert-light-danger alert-dismissible" key={`${idx}`}>
								<div className="alert-text font-weight-bold">{intl.formatMessage({id: error})}</div>
							</div>
						)
					})
				)}
				{/* end: Alert */}

				<div className="form-group fv-plugins-icon-container">
					<TextField
						id="email"
						label={<FormattedMessage id={"AUTH.PLACEHOLDER.EMAIL"}/>}
						type="email"
						className={"d-flex"}
						margin="none"
						variant="outlined"
						InputProps={{
							endAdornment: <InputAdornment position={"end"}><EmailIcon/></InputAdornment>
						}}
						{...formik.getFieldProps("email")}
					/>

					{formik.touched.email && formik.errors.email ? (
						<div className="fv-plugins-message-container">
							<div className="fv-help-block text-danger">{formik.errors.email}</div>
						</div>
					) : null}
				</div>
				<div className="form-group fv-plugins-icon-container">
					<TextField
						id="password"
						label={<FormattedMessage id={"AUTH.PLACEHOLDER.PASSWORD"}/>}
						type="password"
						className={"d-flex"}
						margin="none"
						variant="outlined"
						InputProps={{
							endAdornment: <InputAdornment position={"end"}><LockIcon/></InputAdornment>
						}}
						{...formik.getFieldProps("password")}
					/>

					{formik.touched.password && formik.errors.password ? (
						<div className="fv-plugins-message-container">
							<div className="fv-help-block text-danger">{formik.errors.password}</div>
						</div>
					) : null}
				</div>
				<div className="form-group d-flex flex-wrap justify-content-between align-items-center">
					<Link
						to="/auth/forgot-password"
						className="text-dark-50 text-hover-primary my-3 mr-2"
						id="kt_login_forgot"
					>
						<FormattedMessage id="AUTH.BUTTON.FORGOT_PASSWORD"/>
					</Link>
					<button
						id="kt_login_signin_submit"
						type="submit"
						disabled={formik.isSubmitting}
						className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
					>
						<span><FormattedMessage id={"AUTH.BUTTON.LOGIN"}/></span>
						{loading && <span className="ml-3 spinner spinner-white"/>}
					</button>
				</div>
			</form>
			{/*end::Form*/}
		</div>
	);
}

export default injectIntl(connect(null, auth.actions)(Login));
