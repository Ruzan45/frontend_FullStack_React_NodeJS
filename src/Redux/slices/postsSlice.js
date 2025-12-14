import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; //createAsyncThunk - для асинхронного запроса
import axios from '../../axios'; //импортируем аксиос

export const fetchPosts = createAsyncThunk('/posts/fetchPosts', async (sort) => {  //посты
    let post = '';
    sort !== '' ? post = `/posts/sort/${sort}` : post = '/posts';
    const { data } = await axios.get(post); //нужно вытащить дата их аксиос запроса
    return data; //возвращаем ответ от сервера в action.payload
});

export const fetchTags = createAsyncThunk('/posts/fetchTags', async () => {  //тэги
    const { data } = await axios.get('/tags'); //нужно вытащить дата их аксиос запроса
    return data; //возвращаем ответ от сервера в action.payload
});
export const fetchRemovePost = createAsyncThunk('/posts/fetchRemovePost', async (id) => { //удаление поста
    const { data } = await axios.delete(`/posts/${id}`); //нужно вытащить дата их аксиос запроса
    return data; //возвращаем ответ от сервера в action.payload
});
export const fetchCommentsPost = createAsyncThunk('/posts/fetchCommentsPost', async (id) => {
    const { data } = await axios.get(`comments/${id}`);
    return data
});

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
    filteredPosts: {
        items: [],
        status: 'loading',
    },
    commentsPost: {
        items: [],
        status: 'loading',
    },
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        filterPostsTag(state, action) {
            state.filteredPosts.items = action.payload;
            state.filteredPosts.status = 'loaded';
        }
    },
    extraReducers: {
        //получение статей
        [fetchPosts.pending]: (state) => { //состояние загрузки, отловили состояние pending в Redux. Можно увидеть в расширении
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        [fetchPosts.fulfilled]: (state, action) => { //если состояние загрузки fulfilled
            state.posts.items = action.payload; // значит в state засовываем данные из action.payload
            state.posts.status = 'loaded';
        },
        [fetchPosts.rejected]: (state) => { //состояние загрузки
            state.posts.items = [];
            state.posts.status = 'error';

        },
        //получение статей
        [fetchCommentsPost.pending]: (state) => { //состояние загрузки, отловили состояние pending в Redux. Можно увидеть в расширении
            state.commentsPost.items = [];
            state.commentsPost.status = 'loading';
        },
        [fetchCommentsPost.fulfilled]: (state, action) => { //если состояние загрузки fulfilled
            state.commentsPost.items = action.payload; // значит в state засовываем данные из action.payload
            state.commentsPost.status = 'loaded';
        },
        [fetchCommentsPost.rejected]: (state) => { //состояние загрузки
            state.commentsPost.items = [];
            state.commentsPost.status = 'error';
        },
        //получение тэгов
        [fetchTags.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'loaded';
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = 'error';

        },
        //удаление статей
        [fetchRemovePost.fulfilled]: (state, action) => {
            state.posts.items = state.posts.items.filter(item => item.post_id !== Number(action.payload.post_id)) //из state.posts.items удаляем пост. В action.payload возвращаем id удалённой статьи из бэкэнда
        },
    },
});

export const { filterPostsTag } = postsSlice.actions;

export default postsSlice.reducer;