import axios from "axios";
import conf from "../config/index";


export async function registerNotice(data) {
    return await axios.post(conf.API_URL + "/notice/register", data);
}

export async function updateNotice(data) {
    return await axios.post(conf.API_URL + "/notice/update", data);
}

export async function getAllNotice(data) {
    return await axios.post(conf.API_URL + "/notice/get-all", data);
}

export async function deleteNotice(data) {
    return await axios.post(conf.API_URL + "/notice/delete", data);
}


export async function registerNoticeType(data) {
    return await axios.post(conf.API_URL + "/notice/type/register", data);
}

export async function getAllNoticeType(data) {
    return await axios.post(conf.API_URL + "/notice/type/get-all", data);
}

export async function deleteNoticeType(data) {
    return await axios.post(conf.API_URL + "/notice/type/delete", data);
}

export async function registerTerms(data) {
    return await axios.post(conf.API_URL + "/terms/register", data);
}

export async function updateTerms(data) {
    return await axios.post(conf.API_URL + "/terms/update", data);
}

export async function getTermsById(data) {
    return await axios.post(conf.API_URL + "/terms/get-by-id", data);
}

export async function getAllTerms(data) {
    return await axios.post(conf.API_URL + "/terms/get-all", data);
}

export async function deleteTerms(data) {
    return await axios.post(conf.API_URL + "/terms/delete", data);
}

