import axios from "axios";
import conf from "../config/index";


export async function registerReport(data) {
    return await axios.post(conf.API_URL + "/report/register", data);
}

export async function updateReport(data) {
    return await axios.post(conf.API_URL + "/report/update", data);
}

export async function getAllReports(data) {
    return await axios.post(conf.API_URL + "/report/get-all", data);
}

export async function getReportById(data) {
    return await axios.post(conf.API_URL + "/report/get-by-id", data);
}


export async function getReportByUser(data) {
    return await axios.post(conf.API_URL + "/report/get-by-user", data);
}

export async function getReportByReporter(data) {
    return await axios.post(conf.API_URL + "/report/get-by-reporter", data);
}

export async function deleteReport(data) {
    return await axios.post(conf.API_URL + "/report/delete", data);
}

export async function getReportByFilter(data) {
    return await axios.post(conf.API_URL + "/report/get-by-filter", data);
}
