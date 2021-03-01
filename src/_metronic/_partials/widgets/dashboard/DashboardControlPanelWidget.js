/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import config from "../../../../app/config";
import {FormattedMessage} from "react-intl";


const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 10,
        flexGrow: 1,
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#0001',
    },
}));

export function DashboardControlPanelWidget(props) {
    const {className, data} = props;
    console.log(data);

    return (
        <>
            {/* begin::Tiles Widget 1 */}
            <div className={`card card-custom ${className}`}>
                {/* begin::Header */}
                <div className="card-header border-0 pt-5">
                    <div className="card-title">
                        <div className="card-label">
                            <div className="font-weight-bolder"><FormattedMessage id={"CA.DASHBOARD.TITLE.CONTROL_PANEL"}/></div>
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
                        <div className="d-flex align-items-center justify-content-center pt-5 pb-1">
                            <div className="d-flex flex-wrap align-items-center justify-content-between w-100">
                                <div className="text-dark-75 font-weight-bold font-size-lg mb-1">
                                    <FormattedMessage id={"CA.DASHBOARD.CONTROL_PANEL.DEPARTMENT"}/>:
                                </div>
                                <span className="label label-lg label-light-primary label-inline font-weight-bold py-4">
                                    {data.departmentCount}
                                </span>
                            </div>
                        </div>
                        {/* end::Item */}

                        {/* begin::Item */}
                        <div className="d-flex align-items-center justify-content-center pt-5 pb-1">
                            <div className="d-flex flex-wrap align-items-center justify-content-between w-100">
                                <div className="text-dark-75 font-weight-bold font-size-lg mb-1">
                                    <FormattedMessage id={"CA.DASHBOARD.CONTROL_PANEL.PUESTO"}/>:
                                </div>
                                <span className="label label-lg label-light-primary label-inline font-weight-bold py-4">
                                    {data.puestoCount}
                                </span>
                            </div>
                        </div>
                        {/* end::Item */}

                        {/* begin::Item */}
                        <div className="d-flex align-items-center justify-content-center pt-5 pb-1">
                            <div className="d-flex flex-wrap align-items-center justify-content-between w-100">
                                <div className="text-dark-75 font-weight-bold font-size-lg mb-1">
                                    <FormattedMessage id={"CA.DASHBOARD.CONTROL_PANEL.AGENT"}/>:
                                </div>
                                <span className="label label-lg label-light-primary label-inline font-weight-bold py-4">
                                    {data.agentCount}
                                </span>
                            </div>
                        </div>
                        {/* end::Item */}

                        {/* begin::Item */}
                        <div className="d-flex align-items-center justify-content-center pt-5 pb-1">
                            <div className="d-flex flex-wrap align-items-center justify-content-between w-100">
                                <div className="text-dark-75 font-weight-bold font-size-lg mb-1">
                                    <FormattedMessage id={"CA.DASHBOARD.CONTROL_PANEL.MANAGER"}/>:
                                </div>
                                <span className="label label-lg label-light-primary label-inline font-weight-bold py-4">
                                    {data.managerCount}
                                </span>
                            </div>
                        </div>
                        {/* end::Item */}

                        {/* begin::Item */}
                        <div className="d-flex align-items-center justify-content-center pt-5 pb-1">
                            <div className="d-flex flex-wrap align-items-center justify-content-between w-100">
                                <div className="text-dark-75 font-weight-bold font-size-lg mb-1">
                                    <FormattedMessage id={"CA.DASHBOARD.CONTROL_PANEL.ADMIN"}/>:
                                </div>
                                <span className="label label-lg label-light-primary label-inline font-weight-bold py-4">
                                    {data.adminCount}
                                </span>
                            </div>
                        </div>
                        {/* end::Item */}

                        {/* begin::Item */}
                        <div className="d-flex align-items-center justify-content-center py-5">
                            <Link to={"/control-panel"} className={"btn btn-primary py-4"}>
                                <FormattedMessage id={"CA.DASHBOARD.ACCESS.CONTROL_PANEL"}/>
                            </Link>
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
