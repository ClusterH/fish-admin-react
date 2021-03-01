import axios from "axios";
import conf from "../config/index";


export async function registerCheckedFish(data) {
    return await axios.post(conf.API_URL + "/fish/register-checked-fish", data);
}

export async function getAllFishes(data) {
    return await axios.post(conf.API_URL + "/fish/get-all", data);
}

export async function getFishesByMultiFilter(data) {
    return await axios.post(conf.API_URL + "/fish/get-by-multi-filter", data);
}

export async function getFishById(data) {
    return await axios.post(conf.API_URL + "/fish/get-by-id", data);
}

export async function getFishesByUser(data) {
    return await axios.post(conf.API_URL + "/fish/get-by-user", data);
}

export async function getFishesByCompetition(data) {
    return await axios.post(conf.API_URL + "/fish/get-by-competition", data);
}

export async function addFishImage(data) {
    return await axios.post(conf.API_URL + "/fish/add-image", data);
}

export async function updateFish(data) {
    return await axios.post(conf.API_URL + "/fish/update", data);
}
