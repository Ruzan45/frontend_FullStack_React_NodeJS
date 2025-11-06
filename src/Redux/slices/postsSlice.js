import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; //createAsyncThunk - для асинхронного запроса
import axios from '../../axios'; //импортируем аксиос

export const fetchPosts = createAsyncThunk('/posts/fetchPosts', async () => {  //посты
    const { data } = await axios.get('/posts'); //нужно вытащить дата их аксиос запроса
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

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
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

export default postsSlice.reducer;