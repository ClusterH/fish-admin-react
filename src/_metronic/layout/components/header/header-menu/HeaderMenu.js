/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router";
import {NavLink} from "react-router-dom";
import {checkIsActive} from "../../../../_helpers";
import {FormattedMessage} from "react-intl";
import {useSelector, useDispatch} from "react-redux";

export function HeaderMenu({layoutProps}) {
    const {user} = useSelector(state => state.auth);
    const location = useLocation();


    const getMenuItemActive = (url) => {
        return checkIsActive(location, url) ? "menu-item-active" : "";
    }

    return <div
        id="kt_header_menu"
        className={`header-menu header-menu-left header-menu-mobile ${layoutProps.ktMenuClasses}`}
        {...layoutProps.headerMenuAttributes}
    >
        {/*begin::Header Nav*/}
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
            {/*begin::1 Level*/}
            {/*<li className={`menu-item menu-item-rel ${getMenuItemActive('/dashboard')}`}>*/}
            {/*	<NavLink className="menu-link" to="/dashboard">*/}
            {/*		<span className="menu-text"><FormattedMessage id={"MENU.DASHBOARD"}/></span>*/}
            {/*		{layoutProps.rootArrowEnabled && (<i className="menu-arrow"/>)}*/}
            {/*	</NavLink>*/}
            {/*</li>*/}
            {/*end::1 Level*/}


            <li className={`menu-item menu-item-rel ${getMenuItemActive('/user')}`}>
                <NavLink className="menu-link" to="/user">
                    <span className="menu-text"><FormattedMessage id={"MENU.USER"}/></span>
                    {layoutProps.rootArrowEnabled && (<i className="menu-arrow"/>)}
                </NavLink>
            </li>

            <li className={`menu-item menu-item-rel ${getMenuItemActive('/competition/list')}`}>
                <NavLink className="menu-link" to="/competition/list">
                    <span className="menu-text"><FormattedMessage id={"MENU.COMPETITION"}/></span>
                    {layoutProps.rootArrowEnabled && (<i className="menu-arrow"/>)}
                </NavLink>
            </li>

            <li className={`menu-item menu-item-rel ${getMenuItemActive('/point')}`}>
                <NavLink className="menu-link" to="/point">
                    <span className="menu-text"><FormattedMessage id={"MENU.POINT"}/></span>
                    {layoutProps.rootArrowEnabled && (<i className="menu-arrow"/>)}
                </NavLink>
            </li>

            <li className={`menu-item menu-item-rel ${getMenuItemActive('/notice')}`}>
                <NavLink className="menu-link" to="/notice">
                    <span className="menu-text"><FormattedMessage id={"MENU.NOTICE"}/></span>
                    {layoutProps.rootArrowEnabled && (<i className="menu-arrow"/>)}
                </NavLink>
            </li>

            <li className={`menu-item menu-item-rel ${getMenuItemActive('/customer-center')}`}>
                <NavLink className="menu-link" to="/customer-center">
                    <span className="menu-text"><FormattedMessage id={"MENU.CUSTOMER_CENTER"}/></span>
                    {layoutProps.rootArrowEnabled && (<i className="menu-arrow"/>)}
                </NavLink>
            </li>

            <li className={`menu-item menu-item-rel ${getMenuItemActive('/post')}`}>
                <NavLink className="menu-link" to="/post">
                    <span className="menu-text"><FormattedMessage id={"MENU.POSTING"}/></span>
                    {layoutProps.rootArrowEnabled && (<i className="menu-arrow"/>)}
                </NavLink>
            </li>

            <li className={`menu-item menu-item-rel ${getMenuItemActive('/report')}`}>
                <NavLink className="menu-link" to="/report">
                    <span className="menu-text"><FormattedMessage id={"MENU.REPORT"}/></span>
                    {layoutProps.rootArrowEnabled && (<i className="menu-arrow"/>)}
                </NavLink>
            </li>
        </ul>
    </div>;
}
