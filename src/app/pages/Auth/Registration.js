import React, {useState} from "react";
import {useFormik} from "formik";
import {connect} from "react-redux";
import * as Yup from "yup";
import {Link} from "react-router-dom";
import {FormattedMessage, injectIntl} from "react-intl";
import * as auth from "../../../redux/authRedux";
import {register} from "../../../http/authCRUD";

import {InputAdornment} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import UserIcon from '@material-ui/icons/AccountBox';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import VerifyCode from "./VerifyCode";

const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
};

function Registration(props) {
    const {intl} = props;
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [codeModal, setCodeModal] = useState(false);
    const [email, setEmail] = useState('');
    const [period, setPeriod] = useState(0);
    const [userId, setUserId] = useState(0);

    const RegistrationSchema = Yup.object().shape({
        name: Yup.string()
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_NAME",
                })
            ),
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
        confirmPassword: Yup.string()
            .min(6, intl.formatMessage({id: "AUTH.VALIDATION.MIN_PASSWORD_LENGTH"}))
            .max(50, intl.formatMessage({id: "AUTH.VALIDATION.MAX_PASSWORD_LENGTH"}))
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_CONFIRM_PASSWORD",
                })
            ),
    });

    const getInputClasses = (fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return "is-invalid";
        }

        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return "is-valid";
        }

        return "";
    };

    const formik = useFormik({
        initialValues,
        validationSchema: RegistrationSchema,
        onSubmit: (values, {setStatus, setSubmitting}) => {
            setLoading(true);
            const data = {
                name: values.name,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
                type: 0,
            };
            register(data)
                .then((res) => {
                    setEmail(res.data.email);
                    setPeriod(res.data.period);
                    setUserId(res.data.userId);
                    setCodeModal(true);
                    setLoading(false);
                })
                .catch((err) => {
                    setSubmitting(false);
                    setErrors(err.response && err.response.data.msg);
                    setLoading(false);
                });
        },
    });

    return (
        <>
            {codeModal ? (
                <VerifyCode email={email} period={period} userId={userId} purpose={"REGISTER"} intl={intl}/>
            ) : (
                <div className="login-form login-signin" style={{display: "block"}}>
                    <div className="text-center mb-10 mb-lg-20">
                        <h3 className="font-size-h1 font-weight-boldest text-primary">
                            <FormattedMessage id="AUTH.REGISTER.TITLE"/>
                        </h3>
                    </div>

                    <form
                        id="kt_login_signin_form"
                        className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
                        onSubmit={formik.handleSubmit}
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

                        {/* begin: Name */}
                        <div className="form-group fv-plugins-icon-container">
                            <TextField
                                id="name"
                                label={<FormattedMessage id={"AUTH.PLACEHOLDER.NAME"}/>}
                                type="text"
                                className={"d-flex"}
                                margin="none"
                                variant="outlined"
                                InputProps={{
                                    endAdornment: <InputAdornment position={"end"}><UserIcon/></InputAdornment>
                                }}
                                {...formik.getFieldProps("name")}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block text-danger">{formik.errors.name}</div>
                                </div>
                            ) : null}
                        </div>
                        {/* end: Name */}

                        {/* begin: Email */}
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
                        {/* end: Email */}

                        {/* begin: Password */}
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
                        {/* end: Password */}

                        {/* begin: Confirm Password */}
                        <div className="form-group fv-plugins-icon-container">
                            <TextField
                                id="confirmPassword"
                                label={<FormattedMessage id={"AUTH.PLACEHOLDER.CONFIRM_PASSWORD"}/>}
                                type="password"
                                className={"d-flex"}
                                margin="none"
                                variant="outlined"
                                InputProps={{
                                    endAdornment: <InputAdornment position={"end"}><LockIcon/></InputAdornment>
                                }}
                                {...formik.getFieldProps("confirmPassword")}
                            />

                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block text-danger">{formik.errors.confirmPassword}</div>
                                </div>
                            ) : null}
                        </div>
                        {/* end: Confirm Password */}

                        <div className="form-group d-flex flex-wrap flex-center">
                            <button
                                type="submit"
                                className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                            >
                                <span><FormattedMessage id={"AUTH.BUTTON.REGISTER"}/></span>
                                {loading && <span className="ml-3 spinner spinner-white"/>}
                            </button>

                            <Link to="/auth/login">
                                <button
                                    type="button"
                                    className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                                >
                                    <FormattedMessage id={"AUTH.BUTTON.CANCEL"}/>
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            )}
        </>

    );
}

export default injectIntl(connect(null, auth.actions)(Registration));
