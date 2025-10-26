import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; //хук для формы авторизации


import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { fetchAuth, isAuthData } from "../../Redux/slices/authSlice";

import styles from "./Login.module.scss";

export const Login = () => {
  const isAuth = useSelector(isAuthData);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isValid }
  } = useForm({ //подключаем react-hook-form, в фигурных скобках вытаскиваем функции хука
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange' //валидация должна происходить только в том случае, если поля имени и пароля поменялись
  });

  const onSubmit = async (values) => { // эта функция будет выполняться только в том случае,  если react-hook-form понял что валидация прошла корректно
    const data = await dispatch(fetchAuth(values));
    if (!data.payload) {
      alert('Не удалось авторизоваться')
    } else {
      console.log(data)
      window.localStorage.setItem('token', data.payload.token) //сохраняем token в lacalStorage
    }
  };


  if (isAuth) {
    return <Navigate to="/" /> //если есть данные от jwt об авторизации в redux, то перекинуть на главную страницу
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}> {/*если у нас отправилась форма, то вызываем handleSubmit*/}
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)} //поле подсвечивается если true //обернул в Boolean-значит если информация внутри скобок появится, то будет true
          helperText={errors.email?.message}//вытащи их объекта email = message ?. означает что если емэйла нет в списке ошибок, то и не надо вытаскивать
          type="email"
          {...register('email', { required: 'Укажите почту' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Укажите пароль' })}
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
