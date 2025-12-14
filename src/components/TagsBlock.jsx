import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTags, filterPostsTag } from "../Redux/slices/postsSlice";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import { SideBlock } from "./SideBlock";


export const TagsBlock = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchTags()); //возвращает action.payload
  }, [])

  const { posts, tags } = useSelector(state => state.postsSlice);
  const tagsFilter = (name) => {
    const filtered = posts.items.filter(item => item.tags.includes(name));
    dispatch(filterPostsTag(filtered));
  };
  const reset = () => {
    dispatch(filterPostsTag([]));
  }

  return (
    <SideBlock title="Тэги">
      <List>
        {(tags.status !== 'loaded' ? [...Array(5)] : tags.items).map((name, i) => (

          <a style={{ textDecoration: "none", color: "black" }}  /* href={`/tags/${name}`} */ onClick={() => tagsFilter(name)} >
            <ListItem key={i} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {tags.status !== 'loaded' ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </a>

        ))}
        <a style={{ textDecoration: "none", color: "black" }} onClick={() => reset()}>
          <ListItem disablePadding>
            <ListItemButton>
              {tags.status !== 'loaded' ? (
                <Skeleton width={100} />
              ) : (
                <ListItemText primary={'Сбросить'} />
              )}
            </ListItemButton>
          </ListItem>
        </a>
      </List>
    </SideBlock>
  );
};
