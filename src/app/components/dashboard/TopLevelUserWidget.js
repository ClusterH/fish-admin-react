/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {FormattedMessage} from "react-intl";
import {topLevelUsers} from "../../../http/dashboardCRUD";


const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 10,
        flexGrow: 1,
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#0001',
    },
}));

export function TopLevelUserWidget(props) {
    const {className} = props;
    const [topLevelUserList, setTopLevelUserList] = useState([]);

    useEffect(() => {
        topLevelUsers({limit: 3}).then((res) => {
            console.log(res.data.result)
            setTopLevelUserList(res.data.result);
        }).catch(err => {
            console.log(err)
        });
    }, [])

    return (
        <>
            {/* begin::Tiles Widget 1 */}
            <div className={`card card-custom ${className}`}>
                {/* begin::Header */}
                <div className="card-header border-0 pt-5">
                    <div className="card-title">
                        <div className="card-label">
                            <div className="font-weight-bolder">
                                <FormattedMessage id={"DASHBOARD.TOP_LEVEL_USERS"}/>
                            </div>
                            {/*<div className="font-size-sm text-muted mt-2">890,344 Sales</div>*/}
                        </div>
                    </div>
                    <div className="card-toolbar">
                    </div>
                </div>
                {/* end::Header */}

                {/* begin::Body */}
                <div className="card-body d-flex flex-column px-0 pt-0 pb-2">
                    {/* begin::Items */}
                    <div className="flex-grow-1 card-spacer-x">
                        {/* begin::Item */}
                        <div className="pt-5 pb-1">
                            {topLevelUserList.map((item, idx) => {
                                return (
                                    <div key={`${idx}`} className="d-flex justify-content-between align-items-center border rounded px-4 py-2 mb-1">
                                        <div>
                                            <div className="text-primary font-weight-boldest font-size-h5">{item.name}</div>
                                            <div className="font-size-xs">{item.profile?.style}</div>
                                        </div>
                                        <div>레벨: {item.profile?.level}</div>
                                    </div>
                                )
                            })}
                        </div>
                        {/* end::Item */}
                    </div>
                    {/* end::Items */}
                </div>
                {/* end::Body */}
            </div>
            {/* end::Tiles Widget 1 */}
        </>
    );
}
