import React, {useEffect, useState} from 'react';
import {FormattedMessage} from "react-intl";
import {InputAdornment} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import CancelIcon from '@material-ui/icons/Cancel';
import {deleteNoticeType, getAllNoticeType, registerNoticeType} from "../../../http/noticeCRUD";

export default function NoticeType(props) {
    const {setShowNoticeTypePopup} = props;
    const [noticeType, setNoticeType] = useState('');
    const [noticeTypeList, setNoticeTypeList] = useState([]);

    useEffect(() => {
        getAllNoticeType().then((res) => {
            setNoticeTypeList(res.data.result);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    const addNoticeType = () => {
        if (noticeType !== '') {
            registerNoticeType({noticeType}).then((res) => {
                const temp = [...noticeTypeList];
                temp.push({
                    id: res.data.result?.id,
                    type: res.data.result?.type,
                });
                setNoticeTypeList(temp);
                setNoticeType('');
            }).catch(err => {
                console.log(err);
            })
        }
    }

    const deleteAction = (id) => {
        deleteNoticeType({noticeTypeId: id}).then((res) => {
            const temp = [...noticeTypeList];
            setNoticeTypeList(temp.filter(x => x.id !== id));
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className={"popup-container"}>
            <div className={"popup-body d-flex"}>
                <div style={{width: '50%'}}>
                    <div>
                        <TextField
                            id="outlined-search"
                            label={"공지사항유형을 입력하세요"}
                            className={"d-flex"}
                            margin="none"
                            variant="outlined"
                            value={noticeType}
                            onChange={event => setNoticeType(event.target.value)}
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button className={"btn btn-danger mt-3 w-100px"} onClick={() => setShowNoticeTypePopup(false)}>닫기</button>
                        <button className={"btn btn-primary mt-3 w-100px"} onClick={addNoticeType}>추가</button>
                    </div>
                </div>
                <div style={{width: '50%'}} className="p-3 mx-5 border rounded max-h-300px overflow-auto">
                    {noticeTypeList.map((item, idx) => {
                        return (
                            <div key={`${idx}`} className="d-flex justify-content-between p-2">
                                <div>{item.type}</div>
                                <div onClick={() => deleteAction(item.id)}>
                                    <CancelIcon className={'text-danger'}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
