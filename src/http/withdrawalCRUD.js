import axios from "axios";
import conf from "../config/index";


export async function applyWithdrawal(data) {
    return await axios.post(conf.API_URL + "/withdrawal/apply", data);
}

export async function getAllWithdrawal(data) {
    return await axios.post(conf.API_URL + "/withdrawal/get-all", data);
}

export async function getWithdrawalById(data) {
    return await axios.post(conf.API_URL + "/withdrawal/get-by-id", data);
}


export async function getWithdrawalByUser(data) {
    return await axios.post(conf.API_URL + "/withdrawal/get-by-user", data);
}

export async function finishWithdrawal(data) {
    return await axios.post(conf.API_URL + "/withdrawal/finish", data);
}

export async function getAllAccountType(data) {
    return await axios.post(conf.API_URL + "/withdrawal/account-type/get-all", data);
}

export async function registerAccountType(data) {
    return await axios.post(conf.API_URL + "/withdrawal/account-type/register", data);
}


export async function deleteAccountType(data) {
    return await axios.post(conf.API_URL + "/withdrawal/account-type/delete", data);
}
