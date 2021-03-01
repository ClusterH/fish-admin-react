import React, {Component, useEffect, useState} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {AuthPage} from "./AuthPage";
import {LayoutSplashScreen} from "../../../_metronic/layout";
import * as auth from "../../../redux/authRedux";
import {useSelector, useDispatch} from "react-redux";

// export default function Logout(props) {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     console.log('------------>');
//     dispatch(auth.actions.logout());
//     localStorage.removeItem('jwtToken');
//   }, []);
//
//   return <AuthPage/>
//   // return <Redirect to="/"/>;
// }

class Logout extends Component {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    const { hasAuthToken } = this.props;
    console.log('what: ', hasAuthToken)
    return hasAuthToken ? <LayoutSplashScreen/> : <Redirect to="/auth/login"/>;
  }
}

export default connect(
  ({ auth }) => ({ hasAuthToken: Boolean(auth.authToken) }),
  auth.actions
)(Logout);
