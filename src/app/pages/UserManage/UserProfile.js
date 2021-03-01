import React, {useEffect, useState} from "react";
import {Card, CardHeader, CardBody} from "../../../_metronic/_partials/controls";
import Grid from "@material-ui/core/Grid";
import {FormattedMessage} from "react-intl";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector, useDispatch} from "react-redux";
import {getProfileByUserId} from "../../../http/userCRUD";
import {toAbsoluteUrl} from "../../../_metronic/_helpers";
import Spinner from "../../components/Spinner";
import handleError from "../../../utils/handleError";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    avatarBox: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        overflow: 'hidden'
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    alarmBox: {
        height: '460px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '22px'
    }
}));

export default function UserProfile(props) {
    const classes = useStyles();
    const {userId, history} = props;

    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getProfileByUserId({userId})
            .then(res => {
                console.log(res.data.result);
                setUserInfo(res.data.result);
                setLoading(false);
            })
            .catch(err => {
                console.log(err.response?.data);
                setLoading(false);
                handleError(err, history);
            })
    }, [])

    return (
        <>
            {loading ? <Spinner/> : (
                <Card>
                    <CardHeader title={<FormattedMessage id={"USER.TAB_PROFILE"}/>}/>
                    {userInfo === null ? (
                        <div className={classes.alarmBox}>프로필이 존재하지 않습니다.</div>
                    ) : (
                        <CardBody>
                            <Grid item className="d-flex justify-content-center">
                                <div className={classes.avatarBox}>
                                    <img src={userInfo.avatar || toAbsoluteUrl("/media/users/default.jpg")} alt="" className={classes.avatar}/>
                                </div>
                            </Grid>
                            <Grid container spacing={2} className={"pt-5"}>
                                <Grid item md={12} lg={6} className={"p-10"}>
                                    <Grid container spacing={2} className={"d-flex align-items-center"}>
                                        <Grid item xs={4}>회원아이디</Grid>
                                        <Grid item xs={8}>
                                            <div className="form-control">{userInfo.userId}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} className={"d-flex align-items-center"}>
                                        <Grid item xs={4}>유저이름</Grid>
                                        <Grid item xs={8}>
                                            <div className="form-control">{userInfo.username}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} className={"d-flex align-items-center"}>
                                        <Grid item xs={4}>레벨</Grid>
                                        <Grid item xs={8}>
                                            <div className="form-control">{userInfo.level}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} className={"d-flex align-items-center"}>
                                        <Grid item xs={4}>칭호</Grid>
                                        <Grid item xs={8}>
                                            <div className="form-control">{userInfo.style}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} className={"d-flex align-items-center"}>
                                        <Grid item xs={4}>소개</Grid>
                                        <Grid item xs={8}>
                                            <textarea className="form-control" value={userInfo.introMe} readOnly/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={12} lg={6} className={"p-10"}>
                                    <div>출금인증상태</div>
                                    <div className="p-10">
                                        <Grid container spacing={2} className={"d-flex align-items-center"}>
                                            <Grid item xs={3}>이메일인증</Grid>
                                            <Grid item xs={6}>
                                                <div className="form-control">{userInfo.withdrawEmail}</div>
                                            </Grid>
                                            <Grid item xs={3}>
                                                {userInfo.withdrawEmail ? (
                                                    <div className="btn btn-success">인증됨</div>
                                                ) : (
                                                    <div className="btn btn-danger">인증안됨</div>
                                                )}
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2} className={"d-flex align-items-center"}>
                                            <Grid item xs={3}>전화번호인증</Grid>
                                            <Grid item xs={6}>
                                                <div className="form-control">{userInfo.withdrawPhoneNumber}</div>
                                            </Grid>
                                            <Grid item xs={3}>
                                                {userInfo.withdrawPhoneNumber ? (
                                                    <div className="btn btn-success">인증됨</div>
                                                ) : (
                                                    <div className="btn btn-danger">인증안됨</div>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                            </Grid>
                        </CardBody>
                    )}
                </Card>
            )}
        </>
    )
}
