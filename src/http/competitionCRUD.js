import axios from "axios";
import conf from "../config/index";


export async function registerCompetition(data) {
    return await axios.post(conf.API_URL + "/competition/register", data);
}

export async function updateCompetition(data) {
    return await axios.post(conf.API_URL + "/competition/update", data);
}

export async function getAllCompetitions(data) {
    return await axios.post(conf.API_URL + "/competition/get-all", data);
}

export async function getCompetitionById(data) {
    return await axios.post(conf.API_URL + "/competition/get-by-id", data);
}

export async function deleteCompetitionById(data) {
    return await axios.post(conf.API_URL + "/competition/delete", data);
}

export async function getProgressingCompetitions(data) {
    return await axios.post(conf.API_URL + "/competition/get-progressing", data);
}

export async function getAttendedCompetitionsByUser(data) {
    return await axios.post(conf.API_URL + "/competition/get-attended-by-user", data);
}

export async function getProgressingCompetitionsByUser(data) {
    return await axios.post(conf.API_URL + "/competition/get-progressing-by-user", data);
}

export async function getRankCompetitions(data) {
    return await axios.post(conf.API_URL + "/competition/get-rank-competition", data);
}

export async function getQuestCompetitions(data) {
    return await axios.post(conf.API_URL + "/competition/get-quest-competition", data);
}

export async function getCompetitionByMultiFilter(data) {
    return await axios.post(conf.API_URL + "/competition/get-competition-by-multi-filter", data);
}
