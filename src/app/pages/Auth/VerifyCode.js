import React, {useState} from "react";
import {useFormik} from "formik";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import * as Yup from "yup";
import {FormattedMessage, injectIntl} from "react-intl";
import {verifyCodeAndSignUp, verifyCode} from "../../../http/authCRUD";
import StatusModal from "./StatusModal";
import TextField from "@material-ui/core/TextField";
import LockIcon from '@material-ui/icons/Lock';
import {InputAdornment} from "@material-ui/core";
import ResetPassword from "./ResetPassword";
import setAuthToken from "../../../utils/setAuthToken";
import {useSelector, useDispatch} from "react-redux";
import {actions} from "../../../redux/authRedux";

const initialValues = {
    code: "",
};

export default function VerifyCode(props) {
    const dispatch = useDispatch();
    const {intl, email, period, userId, purpose} = props;
    const [successModal, setSuccessModal] = useState(false);
    const [status, setStatus] = useState(0);
    const [errMsg, setErrMsg] = useState('');
    const [errModal, setErrModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const VerifyCodeSchema = Yup.object().shape({
        code: Yup.string()
            .required(
                <FormattedMessage id={"AUTH.VALIDATION.REQUIRED_CODE"}/>
            ),
    });

    const formik = useFormik({
        initialValues,
        validationSchema: VerifyCodeSchema,
        onSubmit: (values, {setStatus, setSubmitting}) => {
            setLoading(true);
            const data = {
                userId: userId,
                code: values.code,
            }
            console.log(data)
            if (purpose === 'REGISTER') {
                verifyCodeAndSignUp(data)
                    .then(({data: {accessToken}}) => {
                        console.log(accessToken)
                        localStorage.setItem("jwtToken", accessToken);
                        setAuthToken(accessToken);
                        dispatch(actions.login(accessToken));
                    })
                    .catch(err => {
                        setLoading(false);
                        setSubmitting(false);
                        setErrModal(true);
                        setErrMsg(err.response && err.response.data.msg);
                    });
            } else if (purpose === 'FORGOT_PASSWORD') {
                verifyCode(data)
                    .then((res) => {
                        console.log(res.status)
                        if (res.status === 200) {
                            setLoading(false);
                            setSuccessModal(true);
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                        setSubmitting(false);
                        setErrModal(true);
                        setErrMsg(err.response && err.response.data.msg);
                    });
            }
        },
    });

    return (
        <>
            <div className="position-relative login-form login-forgot" style={{display: "block"}}>
                {successModal && <ResetPassword email={email}/>}
                {errModal && <StatusModal msg={errMsg} setErrModal={setErrModal}/>}
                {!successModal && !errModal && (
                    <>
                        <div className="text-center mb-10 mb-lg-20">
                            <h3 className="font-size-h3">
                                <span className="line-height-lg">
                                    {intl.formatMessage({id: "AUTH.SEND_MAIL_SUCCESS_1"}, {email: email})}
                                </span>
                                <span  className="line-height-lg">
                                    {intl.formatMessage({id: "AUTH.SEND_MAIL_SUCCESS_2"}, {min: period})}
                                </span>
                            </h3>
                        </div>
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
                                    id="code"
                                    label={<FormattedMessage id={"AUTH.PLACEHOLDER.CODE"}/>}
                                    type="text"
                                    className={"d-flex"}
                                    margin="none"
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: <InputAdornment position={"end"}><LockIcon/></InputAdornment>
                                    }}
                                    {...formik.getFieldProps("code")}
                                />
                                {formik.touched.code && formik.errors.code ? (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block text-danger">{formik.errors.code}</div>
                                    </div>
                                ) : null}
                            </div>

                            <div className="form-group d-flex flex-wrap justify-content-between">
                                <Link to="/auth/login">
                                    <button
                                        type="button"
                                        className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                                    >
                                        <FormattedMessage id={"AUTH.BUTTON.CANCEL"}/>
                                    </button>
                                </Link>
                                <button
                                    id="kt_login_forgot_submit"
                                    type="submit"
                                    className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                                    disabled={formik.isSubmitting}
                                >
                                    <FormattedMessage id={"AUTH.BUTTON.NEXT"}/>
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </>
    );
}
