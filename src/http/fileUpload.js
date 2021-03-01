import axios from "axios";
import conf from "../config/index";


export async function fileUpload(data) {
    return await axios.post(conf.API_URL + "/file/upload", data);
}
