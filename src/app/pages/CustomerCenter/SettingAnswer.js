import React, {useEffect, useState} from 'react';
import {FormattedMessage} from "react-intl";
import {FormControl, InputAdornment, InputLabel, MenuItem, Select} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {deleteAccountType, getAllAccountType, registerAccountType} from "../../../http/withdrawalCRUD";
import CancelIcon from '@material-ui/icons/Cancel';
import {getAllNoticeType, registerNotice, updateNotice} from "../../../http/noticeCRUD";
import Grid from "@material-ui/core/Grid";
import {useSelector, useDispatch} from "react-redux";
import {actions} from "../../../redux/commonRedux";
import {registerAnswer} from "../../../http/customCenterCRUD";

export default function SettingAnswer(props) {
    const dispatch = useDispatch();
    const {data, setShowAnswerPopup} = props;

    const [answer, setAnswer] = useState(data?.answer || '');

    const registerAction = () => {
        if (answer !== '') {
            registerAnswer({
                questionId: data?.id,
                answer: answer,
            }).then(res => {
                dispatch(actions.setQuestionCount(1));
                setShowAnswerPopup(false);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    return (
        <div className={"popup-container"}>
            <div className={"popup-body"}>
                <div className="p-3">문의날짜: <span>{data?.questionDate}</span></div>
                <div className="d-flex p-3">
                    <div>문의내용: </div>
                    <div className={"pl-5"}>{data?.question}</div>
                </div>
                <div className="d-flex p-3">
                    <div>답변내용</div>
                    <div className={"pl-5"} style={{width: '88%'}}>
                        {data?.answer ? (
                            <div>{answer}</div>
                        ) : (
                            <TextField
                                className={"d-flex mb-5"}
                                label={"내용을 입력하세요"}
                                multiline
                                rows={6}
                                rowsMax={6}
                                variant="outlined"
                                value={answer}
                                onChange={event => setAnswer(event.target.value)}
                            />
                        )}
                    </div>
                </div>

                {data?.answer ? (
                    <div className="d-flex justify-content-end pt-3">
                        <button className="btn btn-primary w-120px" onClick={() => setShowAnswerPopup(false)}>닫기</button>
                    </div>
                ) : (
                    <div className="p-3 d-flex justify-content-between">
                        <button className="btn btn-primary w-120px" onClick={registerAction}>보관</button>
                        <button className="btn btn-danger w-120px" onClick={() => setShowAnswerPopup(false)}>취소</button>
                    </div>
                )}
            </div>
        </div>
    )
}
