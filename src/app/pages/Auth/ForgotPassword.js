import React, {useState} from "react";
import {useFormik} from "formik";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import * as Yup from "yup";
import {FormattedMessage, injectIntl} from "react-intl";
import * as auth from "../../../redux/authRedux";
import {forgotPassword} from "../../../http/authCRUD";
import VerifyCode from "./VerifyCode";
import StatusModal from "./StatusModal";
import TextField from "@material-ui/core/TextField";
import EmailIcon from '@material-ui/icons/Email';
import {InputAdornment} from "@material-ui/core";

const initialValues = {
    email: "",
};

function ForgotPassword(props) {
    const {intl} = props;
    const [isRequested, setIsRequested] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [period, setPeriod] = useState(0);
    const [errModal, setErrModal] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(0);
    const [loading, setLoading] = useState(false);

    const ForgotPasswordSchema = Yup.object().shape({
        email: Yup.string()
            .email("Wrong email format")
            .min(3, "Minimum 3 symbols")
            .max(50, "Maximum 50 symbols")
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_EMAIL",
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
        validationSchema: ForgotPasswordSchema,
        onSubmit: (values, {setStatus, setSubmitting}) => {
            setLoading(true);
            forgotPassword(values.email)
                .then((res) => {
                    setLoading(false);
                    setSuccessModal(true);
                    setPeriod(res.data.period);
                    setEmail(res.data.email);
                    setUserId(res.data.userId);
                })
                .catch((err) => {
                    // setIsRequested(false);
                    console.log(err.response.data.msg)
                    setLoading(false);
                    setSubmitting(false);
                    setErrModal(true);
                    setErrMessage(err.response && err.response.data.msg);
                });
        },
    });

    return (
        <>
            <div className="position-relative login-form login-forgot" style={{display: "block"}}>
                {successModal && <VerifyCode email={email} period={period} userId={userId} purpose={"FORGOT_PASSWORD"} intl={intl}/>}
                {errModal && <StatusModal msg={errMessage} setErrModal={setErrModal}/>}
                {!successModal && !errModal && (
                    <>
                        <div className="text-center mb-10 mb-lg-20">
                            <h3 className="font-size-h1"><FormattedMessage id={"AUTH.FORGOT.TITLE"}/></h3>
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
                            <div className="form-group d-flex flex-wrap flex-center">
                                <button
                                    id="kt_login_forgot_submit"
                                    type="submit"
                                    className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                                    disabled={formik.isSubmitting}
                                >
                                    <span><FormattedMessage id={"AUTH.BUTTON.SEND_EMAIL"}/></span>
                                    {loading && <span className="ml-3 spinner spinner-white"/>}
                                </button>
                                <Link to="/auth">
                                    <button
                                        type="button"
                                        id="kt_login_forgot_cancel"
                                        className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                                    >
                                        <FormattedMessage id={"AUTH.BUTTON.CANCEL"}/>
                                    </button>
                                </Link>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </>
    );
}

export default injectIntl(connect(null, auth.actions)(ForgotPassword));
