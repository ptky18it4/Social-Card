/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-const-assign */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import PostDetailImage from "../../images/Image 1@2x.png";

import IconHeart from "../../images/heart-solid.svg";
import IconMessage from "../../images/message-solid.svg";
import Comment from "./components/Comment";
import { useParams } from "react-router-dom";
import { findPostById } from "./postSlice";
import {
  getAllPostAsync,
  getPostByIdAsync,
  updatePostByIdAsync,
} from "../api/ActionPostAsync";
import { format } from "date-format-parse";
import { useDispatch, useSelector } from "react-redux";

const PostDetail = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const post = useSelector(findPostById);
  const [reaction, setReaction] = useState(0);
  useEffect(() => {
    dispatch(getPostByIdAsync({ id: params.id }));
  }, [dispatch]);

  const handleReaction = () => {
    setReaction(post.likes + 1);
    dispatch(updatePostByIdAsync({ id: params.id, likes: post.likes + 1 }));
    window.location.reload();
  };

  return (
    <div className="post-detail">
      <div className="post-detail-container">
        <h1 className="post-detail__header">SOCIAL CARD DETAIL</h1>
        <div className="post-detail__top">
          <img
            className="avatar"
            src={
              post.avatar
                ? post.avatar
                : "https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/282107071_3097124107283687_4114854076538189931_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=V5cjnhQFlwkAX_fZr6i&tn=55OHL7t1G0gtDlXP&_nc_ht=scontent.fdad1-3.fna&oh=00_AT-wmezovc-2vLbiLjGEvcxw39lV00Kx-hfoebU6EmkUfQ&oe=62C0932B"
            }
            alt=""
          />
          <div className="post-detail">
            <p className="post-detail-author__name">{post ? post.name : ""}</p>
            <p className="post-detail__created">
              {post.createdAt ? format(post.createdAt, "DD/MM/YYYY") : ""}
            </p>
          </div>
        </div>
        <div className="post-detail-body">
          <p className="post-detail-body__description">
            {post.description ? post.description : ""}
          </p>
          <div className="post-detail-body__image">
            <img
              className="post-detail__image"
              src={post.image ? post.image : PostDetailImage}
              alt="post image"
            />
          </div>

          <div className="post-detail-body__options">
            <div className="option_heart" onClick={handleReaction}>
              <img src={IconHeart} alt="icon-update" />
              <span className="quantity-heart">
                {post.likes ? post.likes : reaction}
              </span>
            </div>

            <div className="option_comment">
              <img src={IconMessage} alt="icon-trash" />
              <span className="quantity-comment">
                {post.comment ? post.comment.length : 0}
              </span>
            </div>
          </div>
          {post.comment ? (
            <div className="post-detail__comment">
              {post.comment.map((comment) => (
                <div className="comment-item" key={comment._id}>
                  <p className="comment-item__created">
                    {format(comment.createdAt, "DD/MM/YYYY")}
                  </p>
                  <p className="comment-item__detail">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
        <Comment />
      </div>
    </div>
  );
};

export default PostDetail;
