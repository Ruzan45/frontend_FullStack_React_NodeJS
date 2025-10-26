import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4444'
});

instance.interceptors.request.use((config) => {//пишем мидлвор на запрос, т.е. меняем конфигурацию аксиоса
    config.headers.Authorization = window.localStorage.getItem('token'); //в конфигурацию аксиос запроса вшиваем токен
    return config;
})

export default instance;