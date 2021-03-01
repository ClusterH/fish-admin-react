import axios from "axios";
import conf from "../config/index";


export async function countUser(data) {
    return await axios.post(conf.API_URL + "/user/total-count", data);
}

export async function countUserToday(data) {
    return await axios.post(conf.API_URL + "/user/count-today", data);
}

export async function topLevelUsers(data) {
    return await axios.post(conf.API_URL + "/user/get-top-level", data);
}
