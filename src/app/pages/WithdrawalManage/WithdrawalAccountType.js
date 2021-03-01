import React, {useEffect, useState} from 'react';
import {FormattedMessage} from "react-intl";
import {InputAdornment} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {deleteAccountType, getAllAccountType, registerAccountType} from "../../../http/withdrawalCRUD";
import CancelIcon from '@material-ui/icons/Cancel';

export default function WithdrawalAccountType(props) {
    const {setShowAccountTypePopup} = props;
    const [accountType, setAccountType] = useState('');
    const [accountTypeList, setAccountTypeList] = useState([]);

    useEffect(() => {
        getAllAccountType().then((res) => {
            setAccountTypeList(res.data.result);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    const addAccountType = () => {
        if (accountType !== '') {
            registerAccountType({accountType}).then((res) => {
                const temp = [...accountTypeList];
                temp.push({
                    id: res.data.result?.id,
                    type: res.data.result?.type,
                });
                setAccountTypeList(temp);
                setAccountType('');
            }).catch(err => {
                console.log(err);
            })
        }
    }

    const deleteAction = (id) => {
        deleteAccountType({accountTypeId: id}).then((res) => {
            const temp = [...accountTypeList];
            setAccountTypeList(temp.filter(x => x.id !== id));
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
                            label={"계좌유형을 입력하세요"}
                            className={"d-flex"}
                            margin="none"
                            variant="outlined"
                            value={accountType}
                            onChange={event => setAccountType(event.target.value)}
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button className={"btn btn-danger mt-3 w-100px"} onClick={() => setShowAccountTypePopup(false)}>닫기</button>
                        <button className={"btn btn-primary mt-3 w-100px"} onClick={addAccountType}>추가</button>
                    </div>
                </div>
                <div style={{width: '50%'}} className="p-3 mx-5 border rounded max-h-300px overflow-auto">
                    {accountTypeList.map((item, idx) => {
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
