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

export default function AddNotice(props) {
    const dispatch = useDispatch();
    const {setShowAddNoticePopup, data, setSelectedNotice} = props;
    const [noticeTypeId, setNoticeTypeId] = useState(data?.typeId);
    const [title, setTitle] = useState(data?.title);
    const [content, setContent] = useState(data?.content);
    const [typeList, setTypeList] = useState([]);

    useEffect(() => {
        getAllNoticeType().then((res) => {
            console.log(res.data.result);
            setTypeList(res.data.result);
        }).catch(err => {
            console.log(err);
        });
    }, [])

    const registerAction = () => {
        if (noticeTypeId > 0 && title && content) {
            if (data.id) {
                updateNotice({
                    noticeId: data.id,
                    noticeTypeId: noticeTypeId,
                    title: title,
                    content: content
                }).then(res => {
                    dispatch(actions.setNoticeCount(1));
                    setSelectedNotice({});
                    setShowAddNoticePopup(false);
                }).catch(err => {
                    console.log(err);
                });
            } else {
                registerNotice({
                    noticeTypeId: noticeTypeId,
                    title: title,
                    content: content
                }).then(res => {
                    dispatch(actions.setNoticeCount(1));
                    setSelectedNotice({});
                    setShowAddNoticePopup(false);
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }

    return (
        <div className={"popup-container"}>
            <div className={"popup-body"}>
                <div className="p-3">
                    <select
                        className={"form-control d-flex w-50"}
                        value={noticeTypeId}
                        onChange={event => setNoticeTypeId(event.target.value)}
                    >
                        <option value={0} className="text-dark-25">공지사항유형</option>
                        {typeList.map((item, idx) => {
                            return (
                                <option key={`${idx}`} value={item.id}>{item.type}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="p-3">
                    <TextField
                        id="outlined-search"
                        label={"제목"}
                        className={"d-flex"}
                        margin="none"
                        variant="outlined"
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                    />
                </div>
                <div className={"p-3"}>
                    <TextField
                        className={"d-flex mb-5"}
                        label={"내용을 입력하세요"}
                        multiline
                        rows={6}
                        rowsMax={6}
                        variant="outlined"
                        value={content}
                        onChange={event => setContent(event.target.value)}
                    />
                </div>
                <div className="p-3 d-flex justify-content-between">
                    <button className="btn btn-primary w-120px" onClick={registerAction}>보관</button>
                    <button className="btn btn-danger w-120px" onClick={() => {
                        setShowAddNoticePopup(false);
                        setSelectedNotice({});
                    }}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    )
}
