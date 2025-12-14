import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; //createAsyncThunk - для асинхронного запроса
import axios from '../../axios'; //импортируем аксиос

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (values) => { //в values отправляем введённые имя и пароль
    const { data } = await axios.post('/auth/login', values); //нужно вытащить data их аксиос запроса
    return data; //возвращаем ответ от сервера
});
export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => { //
    const { data } = await axios.get('/auth/me'); //нужно вытащить data их аксиос запроса
    return data; //возвращаем ответ от сервера
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (values) => { //
    const { data } = await axios.post('/auth/register', values); //нужно вытащить data их аксиос запроса
    return data; //возвращаем ответ от сервера
});

const initialState = {
    isAuth: {
        data: null,
        status: 'loading'
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuth.data = null; //создаём данные которые отправятся при выходе из аккаунта
        }
    },
    extraReducers: {
        [fetchAuth.pending]: (state) => { //состояние загрузки, отловили состояние pending в Redux. Можно увидеть в расширении
            state.isAuth.data = null;
            state.isAuth.status = 'loading';
        },
        [fetchAuth.fulfilled]: (state, action) => { //если состояние загрузки fulfilled
            state.isAuth.data = action.payload; // значит в state засовываем данные из action.payload
            state.isAuth.status = 'loaded';

        },
        [fetchAuth.rejected]: (state) => { //состояние загрузки
            state.isAuth.data = null;
            state.isAuth.status = 'error';

        },
        [fetchAuthMe.pending]: (state) => { //состояние загрузки, отловили состояние pending в Redux. Можно увидеть в расширении
            state.isAuth.data = null;
            state.isAuth.status = 'loading';
        },
        [fetchAuthMe.fulfilled]: (state, action) => { //если состояние загрузки fulfilled
            state.isAuth.data = action.payload; // значит в state засовываем данные из action.payload
            state.isAuth.status = 'loaded';

        },
        [fetchAuthMe.rejected]: (state) => { //состояние загрузки
            state.isAuth.data = null;
            state.isAuth.status = 'error';

        },
    }
});

export const isAuthData = state => Boolean(state.authSlice.isAuth.data); //экспортируем из редакс
export const { logout } = authSlice.actions; //вытаскиваем экшн logout сверху который
export default authSlice.reducer;