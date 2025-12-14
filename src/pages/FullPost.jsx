import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { fetchCommentsPost } from "../Redux/slices/postsSlice";
import { isAuthData } from "../Redux/slices/authSlice";
import ReactMarkdown from 'react-markdown'

import { Post } from "../components/Post";
import { AddComment } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";

export const FullPost = () => {
  const isAuth = useSelector(isAuthData);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    axios.get(`/posts/${id}`).then(res => {//запрашиваем пост
      setData(res.data);
      setIsLoading(false)
    }).catch((err) => {
      console.log(err);
      alert('Ошибка при получении статьи');
    });
    dispatch(fetchCommentsPost(id)); //получаем комментарии
  }, [])
  const { commentsPost } = useSelector(state => state.postsSlice);
  const comments = commentsPost.items.comments;
  if (isLoading) {
    return <Post isLoading={isLoading} />
  }

  return (
    <>
      <Post
        id={data.post_id}
        title={data.title}
        imageUrl={data?.image_url}
        user={{
          avatarUrl: data.avatar,
          fullName: data.fullname,
        }}
        createdAt={data.created_at}
        viewsCount={data.views_count}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <p>
          <ReactMarkdown children={data.text} /> {/* react-markdown для красивого текста */}
        </p>
      </Post>
      <CommentsBlock
        items={comments}
        isLoading={commentsPost.status === 'loading'}
      >
        {isAuth && <AddComment />}
      </CommentsBlock>
    </>
  );
};
