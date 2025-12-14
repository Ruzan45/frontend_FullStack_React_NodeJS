import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts } from '../Redux/slices/postsSlice';
import Error from './Error'
import { PostSkeleton } from '../components/Post/Skeleton'

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, filteredPosts } = useSelector(state => state.postsSlice);
  //console.log(posts)
  const userData = useSelector(state => state.authSlice.isAuth.data);
  //console.log(userData)
  // const isPostsLoading = posts.status === 'loading'; //будет приходить true если posts.status === 'loading' или false если не равно
  const [sort, setSort] = React.useState(0);

  React.useEffect(() => {
    dispatch(fetchPosts(sort)); //возвращает action.payload
  }, [sort]); //выполняем запрос при изменении переменной

  const tagPosts = filteredPosts.items.length; //проверяем есть ли в filteredPosts с постами что нибудь

  const skeletons = [...new Array(5)].map((_, index) => <PostSkeleton key={index} />);// (_, index) - _ пустой массив 
  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={sort} aria-label="basic tabs example">
        <Tab onClick={() => setSort(0)} label="Новые" />
        <Tab onClick={() => setSort(1)} label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(tagPosts ? filteredPosts : posts).status === 'error' ? (<Error />) :
            ((tagPosts ? filteredPosts : posts).status === 'loaded' ?
              ((tagPosts ? filteredPosts : posts).items.map((obj, index) => (
                <Post
                  key={index}
                  id={obj.post_id}
                  title={obj.title}
                  imageUrl={obj.image_url}
                  user={{
                    avatarUrl:
                      'https://files.shapes.inc/api/files/avatar_4fa77530-234c-4bb0-9115-9d63e3c20af3.png',
                    fullName: 'Keff',
                  }}
                  createdAt={obj.created_at}
                  viewsCount={obj.views_count}
                  commentsCount={3}
                  tags={obj.tags}
                  isEditable={userData?.user_id === obj.user_id}//надо сделать асинхронно, т к значки не появляются сразу после авторизации
                />
              )))
              : (skeletons)
            )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
