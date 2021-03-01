import axios from "axios";
import conf from "../config/index";


export async function registerQuestion(data) {
    return await axios.post(conf.API_URL + "/question/register", data);
}

export async function updateQuestion(data) {
    return await axios.post(conf.API_URL + "/question/update", data);
}

export async function getQuestionById(data) {
    return await axios.post(conf.API_URL + "/question/get-by-id", data);
}

export async function getAllQuestion(data) {
    return await axios.post(conf.API_URL + "/question/get-all", data);
}


export async function deleteQuestion(data) {
    return await axios.post(conf.API_URL + "/question/delete", data);
}

export async function registerAnswer(data) {
    return await axios.post(conf.API_URL + "/question/register-answer", data);
}

export async function addCommentToAnswer(data) {
    return await axios.post(conf.API_URL + "/question/answer/register-comment", data);
}

export async function getQuestionsByFilter(data) {
    return await axios.post(conf.API_URL + "/question/get-by-filter", data);
}
