import React, {useState} from "react";
import {useFormik} from "formik";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import * as Yup from "yup";
import {FormattedMessage, injectIntl} from "react-intl";
import {changePassword, forgotPassword, verifyCode} from "../../../http/authCRUD";
import StatusModal from "./StatusModal";
import TextField from "@material-ui/core/TextField";
import LockIcon from '@material-ui/icons/Lock';
import {InputAdornment} from "@material-ui/core";

const initialValues = {
    newPassword: "",
    confirmPassword: "",
};

export default function ResetPassword(props) {
    const {email} = props;
    const [successModal, setSuccessModal] = useState(false);
    const [errModal, setErrModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [toLogin, setToLogin] = useState(false);
    const [loading, setLoading] = useState(false);

    const ForgotPasswordSchema = Yup.object().shape({
        newPassword: Yup.string()
            .min(6, (<FormattedMessage id={"AUTH.VALIDATION.MIN_PASSWORD_LENGTH"}/>))
            .max(50, (<FormattedMessage id={"AUTH.VALIDATION.MAX_PASSWORD_LENGTH"}/>))
            .required(
                <FormattedMessage id={"AUTH.VALIDATION.REQUIRED_PASSWORD"}/>
            ),
        confirmPassword: Yup.string()
            .min(6, (<FormattedMessage id={"AUTH.VALIDATION.MIN_PASSWORD_LENGTH"}/>))
            .max(50, (<FormattedMessage id={"AUTH.VALIDATION.MAX_PASSWORD_LENGTH"}/>))
            .required(
                <FormattedMessage id={"AUTH.VALIDATION.REQUIRED_CONFIRM_PASSWORD"}/>
            ),
    });

    const formik = useFormik({
        initialValues,
        validationSchema: ForgotPasswordSchema,
        onSubmit: (values, {setStatus, setSubmitting}) => {
            setLoading(true);
            const data = {
                email: email,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
            }
            changePassword(data)
                .then((res) => {
                    setLoading(false);
                    setSuccessModal(true);
                })
                .catch((err) => {
                    console.log(err);
                    setErrMsg(err.response && err.response.data.msg)
                    setLoading(false);
                    setSubmitting(false);
                    setErrModal(true);
                });
        },
    });

    return (
        <>
            {toLogin && <Redirect to="/auth"/>}
            {!toLogin && (
                <div className="position-relative login-form login-forgot" style={{display: "block"}}>
                    {successModal && (
                        <div className="position-absolute top-0 left-0 w-100 h-100"
                             style={{backgroundColor: '#ffffff', zIndex: 10}}
                        >
                            <div className="font-size-h3 p-2">
                                <FormattedMessage id={"AUTH.RESET_PASSWORD_SUCCESS"}/>
                            </div>
                            <div className="mt-4 text-center">
                                <button className="btn btn-primary py-4" onClick={() => {
                                    setSuccessModal(false);
                                    setToLogin(true);
                                }}>
                                    <FormattedMessage id={"AUTH.BUTTON.OK"}/>
                                </button>
                            </div>
                        </div>
                    )}
                    {errModal && <StatusModal msg={'AUTH.ERROR'} setErrModal={setErrModal}/>}
                    {!successModal && !errModal && (
                        <>
                            <div className="text-center mb-10 mb-lg-20">
                                <h1>
                                    <FormattedMessage id={"AUTH.VERIFY_CODE_SUCCESS"}/>
                                </h1>
                            </div>
                            <h3 className="font-size-h3 mb-5">
                                <FormattedMessage id={"AUTH.RESET.TITLE"}/>
                            </h3>
                            <form
                                onSubmit={formik.handleSubmit}
                                className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
                            >
                                {formik.status && (
                                    <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                                        <div className="alert-text font-weight-bold">
                                            {formik.status}
                                        </div>
                                    </div>
                                )}
                                <div className="form-group fv-plugins-icon-container">
                                    <TextField
                                        id="newPassword"
                                        label={<FormattedMessage id={"AUTH.PLACEHOLDER.PASSWORD"}/>}
                                        type="password"
                                        className={"d-flex"}
                                        margin="none"
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: <InputAdornment position={"end"}><LockIcon/></InputAdornment>
                                        }}
                                        {...formik.getFieldProps("newPassword")}
                                    />

                                    {formik.touched.newPassword && formik.errors.newPassword ? (
                                        <div className="fv-plugins-message-container">
                                            <div className="fv-help-block text-danger">{formik.errors.newPassword}</div>
                                        </div>
                                    ) : null}
                                </div>

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

                                <div className="form-group d-flex flex-wrap flex-center">
                                    <button
                                        id="kt_login_forgot_submit"
                                        type="submit"
                                        className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                                        disabled={formik.isSubmitting}
                                    >
                                        <span><FormattedMessage id={"AUTH.BUTTON.RESET_SUBMIT"}/></span>
                                        {loading && <span className="ml-3 spinner spinner-white"/>}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
