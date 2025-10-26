import React from 'react';
import { useForm } from 'react-hook-form'; //хук для формы авторизации
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import { fetchRegister, isAuthData } from "../../Redux/slices/authSlice";

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';

export const Registration = () => {
  const isAuth = useSelector(isAuthData);
  const dispatch = useDispatch();
  const { register, handleSubmit, setError, formState: { errors, isValid }
  } = useForm({ //подключаем react-hook-form, в фигурных скобках вытаскиваем функции хука
    defaultValues: {
      fullName: 'Руслан',
      email: 'ruzan45@list.ru',
      password: '12345'
    },
    mode: 'onChange' //валидация должна происходить только в том случае, если поля имени и пароля поменялись
  });

  const onSubmit = async (values) => { // эта функция будет выполняться только в том случае,  если react-hook-form понял что валидация прошла корректно
    const data = await dispatch(fetchRegister(values));
    console.log(data.error)
    if (!data.payload) {
      alert('Не удалось зарегистрироваться')
    } else {
      alert('Вы зарегистрированы. Выполните вход используя свой email и пароль.');
      return <Navigate to="/login" />
    }
  };


  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}> {/*если у нас отправилась форма, то вызываем handleSubmit*/}
        <TextField
          error={Boolean(errors.fullName?.message)} //поле подсвечивается если true //обернул в Boolean-значит если информация внутри скобок появится, то будет true
          helperText={errors.fullName?.message}//вытащи из объекта email = message ?. означает что если емэйла нет в списке ошибок, то и не надо вытаскивать
          {...register('fullName', { required: 'Укажите имя' })}
          className={styles.field}
          label="Полное имя"
          fullWidth />
        <TextField
          error={Boolean(errors.email?.message)} //поле подсвечивается если true //обернул в Boolean-значит если информация внутри скобок появится, то будет true
          helperText={errors.email?.message}//вытащи из объекта email = message ?. означает что если емэйла нет в списке ошибок, то и не надо вытаскивать
          type="email"
          {...register('email', { required: 'Укажите почту' })}
          className={styles.field}
          label="E-Mail"
          fullWidth />
        <TextField
          error={Boolean(errors.password?.message)} //поле подсвечивается если true //обернул в Boolean-значит если информация внутри скобок появится, то будет true
          helperText={errors.password?.message}//вытащи из объекта password = message ?. означает что если емэйла нет в списке ошибок, то и не надо вытаскивать
          type="password"
          {...register('password', { required: 'Укажите пароль' })}
          className={styles.field}
          label="Пароль"
          fullWidth />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
