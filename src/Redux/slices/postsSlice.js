import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; //createAsyncThunk - для асинхронного запроса
import axios from '../../axios'; //импортируем аксиос

export const fetchPosts = createAsyncThunk('/posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts'); //нужно вытащить дата их аксиос запроса
    return data; //возвращаем ответ от сервера
});
export const fetchTags = createAsyncThunk('/posts/fetchTags', async () => {
    const { data } = await axios.get('/tags'); //нужно вытащить дата их аксиос запроса
    return data; //возвращаем ответ от сервера
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
    reducers: {

    },
    extraReducers: {
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
        [fetchTags.pending]: (state) => { //состояние загрузки, отловили состояние pending в Redux. Можно увидеть в расширении
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [fetchTags.fulfilled]: (state, action) => { //состояние загрузки
            state.tags.items = action.payload;
            state.tags.status = 'loaded';

        },
        [fetchTags.rejected]: (state) => { //состояние загрузки
            state.tags.items = [];
            state.tags.status = 'error';

        },
    },
});

export default postsSlice.reducer;