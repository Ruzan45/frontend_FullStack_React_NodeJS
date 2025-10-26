import React, { useState } from "react";
import { useParams } from 'react-router-dom';

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";

export const FullPost = () => {
  const { id } = useParams();
  const [data, setData] = React.useState()
  const [isLoading, setIsLoading] = React.useState(true)
  React.useEffect(() => {
    axios.get(`/posts/${id}`).then(res => {
      setData(res.data);
      setIsLoading(false)
    }).catch((err) => {
      console.log(err);
      alert('Ошибка при получении статьи');
    })
  }, [])
  if (isLoading) {
    return <Post isLoading={isLoading} />
  }
  return (
    <>
      <Post
        id={data.post_id}
        title={data.title}
        imageUrl={data.image_url}
        user={{
          avatarUrl:
            "https://res.cloudinary.com/practicaldev/image/fetch/s--uigxYVRB--/c_fill,f_auto,fl_progressive,h_50,q_auto,w_50/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/187971/a5359a24-b652-46be-8898-2c5df32aa6e0.png",
          fullName: "Keff",
        }}
        createdAt={data.created_at}
        viewsCount={data.views_count}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <p>
          {data.text}
        </p>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
