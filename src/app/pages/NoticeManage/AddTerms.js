import React, {useEffect, useState} from 'react';
import TextField from "@material-ui/core/TextField";
import {registerTerms, updateTerms} from "../../../http/noticeCRUD";
import {useSelector, useDispatch} from "react-redux";
import {actions} from "../../../redux/commonRedux";

export default function AddTerms(props) {
    const dispatch = useDispatch();
    const {setShowAddTermsPopup, data, setSelectedTerms} = props;
    // const [noticeTypeId, setNoticeTypeId] = useState(data?.typeId);
    const [title, setTitle] = useState(data?.title);
    const [content, setContent] = useState(data?.content);

    const registerAction = () => {
        if (title && content) {
            if (data.id) {
                updateTerms({
                    termsId: data?.id,
                    title: title,
                    content: content
                }).then(res => {
                    dispatch(actions.setTermsCount(1));
                    setSelectedTerms({});
                    setShowAddTermsPopup(false);
                }).catch(err => {
                    console.log(err);
                });
            } else {
                registerTerms({
                    title: title,
                    content: content
                }).then(res => {
                    dispatch(actions.setTermsCount(1));
                    setSelectedTerms({});
                    setShowAddTermsPopup(false);
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
                        setShowAddTermsPopup(false);
                        setSelectedTerms({});
                    }}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    )
}
