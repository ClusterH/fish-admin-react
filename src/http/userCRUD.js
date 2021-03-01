import axios from "axios";
import conf from "../config/index";


export async function registerProfile(data) {
    return await axios.post(conf.API_URL + "/user/profile/register", data);
}

export async function updateProfile(data) {
    return await axios.post(conf.API_URL + "/user/profile/update", data);
}

export async function getProfileById(data) {
    return await axios.post(conf.API_URL + "/user/profile/get-by-id", data);
}

export async function getProfileByUserId(data) {
    return await axios.post(conf.API_URL + "/user/profile/get-by-user", data);
}

export async function getUserList(data) {
    return await axios.post(conf.API_URL + "/user/get-all", data);
}

export async function getUserById(data) {
    return await axios.post(conf.API_URL + "/user/get-by-id", data);
}

export async function getFullUserInfo(data) {
    return await axios.post(conf.API_URL + "/user/get-full-info", data);
}

export async function deleteUserById(data) {
    return await axios.post(conf.API_URL + "/user/delete", data);
}

export async function test(data) {
    return await axios.post(conf.API_URL + "/test", data);
}
