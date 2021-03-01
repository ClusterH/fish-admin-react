import React, {useEffect, useState} from 'react';
import {FormattedMessage} from "react-intl";
import Grid from "@material-ui/core/Grid";
import {useSelector, useDispatch} from "react-redux";
import {deletePostComment, getPostById} from "../../../http/postCRUD";
import ImageGallery from 'react-image-gallery';
import {Link} from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import {Card, CardHeader, CardBody} from "../../../_metronic/_partials/controls";

const images = [
    {
        original: 'https://picsum.photos/id/1018/1000/600/',
        thumbnail: 'https://picsum.photos/id/1018/250/150/',
    },
    {
        original: 'https://picsum.photos/id/1015/1000/600/',
        thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
        original: 'https://picsum.photos/id/1019/1000/600/',
        thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
];


export default function PostDetailPage(props) {
    const dispatch = useDispatch();
    const postId = props.location.pathname.split("/").pop();

    const [post, setPost] = useState({});
    const [commentId, setCommentId] = useState(0);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getPostById({postId}).then((res) => {
            console.log(res.data.result)
            setPost(res.data.result);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log(err);
        })
    }, []);

    const deleteAction = () => {
        deletePostComment({postCommentId: commentId}).then((res) => {
            const temp = {...post};
            const temp1 = temp.postComments.filter(x => x.id !== commentId);
            temp.postComments = [...temp1];
            setPost(temp);
            setShowDeletePopup(false);
        }).catch(err => {
            console.log(err);
        })
    }

    const toolbar = (
        <div className="card-toolbar">
            <Link to={'/post'}>
                <div className="btn btn-primary w-120px">목록가기</div>
            </Link>
        </div>
    );


    return (
        <>
            {showDeletePopup && (
                <div className={"popup-container"}>
                    <div className={"popup-body warning"}>
                        <div className="popup-text font-size-h4 p-3">
                            <FormattedMessage id={"COMPETITION.DELETE_INFO"}/>
                        </div>
                        <div className={"popup-text font-size-h2 text-center py-10"}>
                            <FormattedMessage id={"GENERAL.DELETE_REALLY"}/>
                        </div>
                        <div className={"d-flex justify-content-between pt-4"}>
                            <button className={"btn btn-primary font-size-h5 w-120px"} onClick={deleteAction}>
                                <FormattedMessage id={"GENERAL.YES"}/>
                            </button>
                            <button className={"btn btn-danger font-size-h5 w-120px"}
                                    onClick={() => setShowDeletePopup(false)}>
                                <FormattedMessage id={"GENERAL.CANCEL"}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Card className="min-h-300px">
                <CardHeader title={"게시물상세정보"} toolbar={toolbar}/>
                <CardBody>
                    <Grid container spacing={2}>
                        <Grid item sm={12} md={6}>
                            <Grid item xs={12}>
                                <div className="p-3">게시날짜: <span>{post.createdDate}</span></div>
                                <div className="p-3">게시물의 유저아이디: <span>{post.user?.id}</span></div>
                                <div className={"p-3"}>유저이름: <span>{post.user?.name}</span></div>
                                <div>
                                    <ImageGallery items={images}/>
                                </div>
                                <div className="d-flex p-3">
                                    <div>{post.content}</div>
                                </div>

                            </Grid>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <div className={"p-3"}>댓글목록</div>
                            {post.postComments?.map((item, idx) => {
                                return (
                                    <div key={`${idx}`}
                                         className="position-relative border rounded bg-light-primary mb-2 hover-opacity-xl-70">
                                        <div className="p-1 font-size-xs text-dark-50">
                                            날짜: <span>{new Date(item.createdDate).toLocaleString()}</span>
                                        </div>
                                        <div className="p-1 font-size-xs text-dark-50">유저아이디: <span>{item.userId}</span>
                                        </div>
                                        <div
                                            className="p-1 font-size-xs text-dark-50">유저이름: <span>{item.user?.name}</span>
                                        </div>
                                        <div className="p-1">
                                            {item.comment}
                                        </div>
                                        <div className="position-absolute" style={{top: '10px', right: '10px'}}
                                             onClick={() => {
                                                 setCommentId(item.id);
                                                 setShowDeletePopup(true);
                                             }}
                                        >
                                            <DeleteIcon className="text-dark-20"/>
                                        </div>
                                    </div>
                                )
                            })}
                        </Grid>
                    </Grid>
                </CardBody>
            </Card>
        </>
    )
}
