import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'; // заменяем все HTML ссылки для динамической подгрузки
import Button from '@mui/material/Button';
import { isAuthData, logout } from '../../Redux/slices/authSlice';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';


export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthData);


  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>UPosts</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Написать статью</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
