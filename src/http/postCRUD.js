import axios from "axios";
import conf from "../config/index";


export async function registerPost(data) {
    return await axios.post(conf.API_URL + "/post/register", data);
}

export async function updatePost(data) {
    return await axios.post(conf.API_URL + "/post/update", data);
}

export async function getAllPosts(data) {
    return await axios.post(conf.API_URL + "/post/get-all", data);
}

export async function deletePostById(data) {
    return await axios.post(conf.API_URL + "/post/delete", data);
}

export async function getPostById(data) {
    return await axios.post(conf.API_URL + "/post/get-by-id", data);
}

export async function getPostByUser(data) {
    return await axios.post(conf.API_URL + "/post/get-by-user", data);
}

export async function registerPostComment(data) {
    return await axios.post(conf.API_URL +  "/post/comment/register", data);
}

export async function updatePostComment(data) {
    return await axios.post(conf.API_URL + "/post/comment/update", data);
}

export async function getPostCommentByPost(data) {
    return await axios.post(conf.API_URL + "/post/comment/get-by-post", data);
}

export async function deletePostComment(data) {
    return await axios.post(conf.API_URL + "/post/comment/delete", data);
}

export async function registerPostCommentReply(data) {
    return await axios.post(conf.API_URL + "/post/comment/reply/register", data);
}

export async function updatePostCommentReply(data) {
    return await axios.post(conf.API_URL + "/post/comment/reply/update", data);
}

export async function getPostCommentReplyByPostComment(data) {
    return await axios.post(conf.API_URL + "/post/comment/reply/get-by-post", data);
}

export async function deletePostCommentReply(data) {
    return await axios.post(conf.API_URL + "/post/comment/reply/delete", data);
}
