import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { isAuthData } from "../../Redux/slices/authSlice";
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor'; //библиотека для создания редактора

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import axios from '../../axios'


export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate(); //хук, перебросит на любую страницу
  const isAuth = useSelector(isAuthData);
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState('');//контроллируемый инпут
  const [title, setTitle] = React.useState('');//контроллируемый инпут
  const [tags, setTags] = React.useState('');//контроллируемый инпут
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null)//аналог this в JQ

  const handleChangeFile = async (event) => { //передаём картинку на сервер
    try {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert('Ошибка при загрузке файла')
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => { //useCallback нужен именной этой библиотеке, такая особенность
    setText(value); //контроллируемый редактор

  }, []);

  const onSubmit = async () => {
    try {
      const image_url = 'http://localhost:4444' + imageUrl;
      const fields = {
        title,
        image_url,
        tags,
        text
      }
      setIsLoading(true);

      const { data } = await axios.post('/posts', fields); //передаём на бэкенд

      const id = data.id;
      navigate(`/posts/${id}`)
    } catch (error) {
      console.warn(error);
      alert('Ошибка при создании статьи');

    }
  }

  React.useEffect(() => { //режим редактирования
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setTags(data.tags);
        setImageUrl(data.image_url);
      }).catch((err) => {
        console.log(err);
        alert('Ошибка при получении статьи')
      })
    }
  }, [])


  const options = React.useMemo( //настройки библиотеки
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) { //нужно доработать
    return <Navigate to="/" />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()/* переводим клик на инпут ниже */} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef/* оставляем ссылку на элемент */}
        type="file" onChange={handleChangeFile} //вешаем функцию, которая выполнится при изменении инпута
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={imageUrl} alt="Uploaded" />
        </>

      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e => setTitle(e.target.value)}//управляемый инпут
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={e => setTags(e.target.value)}//управляемый инпут
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {id ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
