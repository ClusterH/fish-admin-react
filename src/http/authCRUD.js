import axios from "axios";
import jwt_decode from "jwt-decode"
import conf from "../config/index";

export async function login(data) {
    return await axios.post(conf.API_URL + "/auth/login", data);
}

export async function register(data) {
    return await axios.post(conf.API_URL + "/auth/register", data);
}

export async function forgotPassword(email) {
    return await axios.post(conf.API_URL + "/auth/forgot-password", {email});
}

export async function verifyCode(data) {
    return await axios.post(conf.API_URL + "/auth/verify-code", data);
}

export async function verifyCodeAndSignUp(data) {
    return await axios.post(conf.API_URL + "/auth/verify-code-and-sign-up", data);
}

export async function changePassword(data) {
    return await axios.post(conf.API_URL + "/auth/change-password", data);
}


export async function getUserByToken() {
    // Authorization head should be fulfilled in interceptor.
    const userId = jwt_decode(localStorage.getItem("jwtToken")).id;
    return await axios.post(conf.API_URL + "/auth/user/get-by-id", {userId});
}
