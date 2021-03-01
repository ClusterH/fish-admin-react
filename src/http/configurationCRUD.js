import axios from "axios";
import conf from "../config/index";


export async function registerFishType(data) {
    return await axios.post(conf.API_URL + "/fish-type/register", data);
}

export async function updateFishType(data) {
    return await axios.post(conf.API_URL + "/fish-type/update", data);
}

export async function getAllFishTypes(data) {
    return await axios.post(conf.API_URL + "/fish-type/get-all", data);
}

export async function getFishTypeById(data) {
    return await axios.post(conf.API_URL + "/fish-type/get-by-id", data);
}

export async function deleteFishType(data) {
    return await axios.post(conf.API_URL + "/fish-type/delete", data);
}
