import React, { useEffect, useState } from 'react';
import {
  makeStyles, Grid, TextField, Container, Button, Box
} from '../components/Material';
//import { CTooltip } from '../components/Custom';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { auth, firestore } from '../config/firebase.config';
import { toast } from 'react-toastify';
import Item from '../components/Item';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '800px',
    [theme.breakpoints.up('sm')]: {
      width: '800px'
    },
  },
}));

export default function Home() {
  const classes = useStyles();

  const [uid, setUid] = useState('');
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    handleGetPosts();
    auth().onAuthStateChanged(user => {
      if (user !== null) {
        setUid(user.uid);
        setUsername(user.displayName);
        //handleGetLikes(user.uid);
      }
    });
  }, []);

  const handleGetPosts = async () => {
    try {
      //let xposts = [];
      firestore().collection('/posts').orderBy('time', 'desc').onSnapshot(snap => {
        const lst = snap.docs.map((post, i) => { return { ...post.data(), id: post.id } });
        //console.log(lst);
        setPosts(lst);
        //xposts = lst;
      });
      // const ref = await firestore().collection('/likes').where('uid', '==', xuid).get();
      // const likes = ref.docs.map(like => { return { ...like.data(), id: like.id } });

      // for (let i = 0; i < likes.length; i++) {
      //   const l = likes[i];
      //   for (let j = 0; j < xposts.length; j++) {
      //     const p = xposts[j];
      //     if (l.postid === p.id) {
      //       console.log('1 Like');
      //     }
      //   }
      // }

    } catch (e) {
      console.log(e);
    }
  }

  const handleGetLikes = async (xuid) => {
    try {
      const ref = await firestore().collection('/likes').where('uid', '==', xuid).get();
      const l = ref.docs.map(like => { return { ...like.data(), id: like.id } });
      console.log(l);
    } catch (e) {
      console.log(e);
    }
  }

  const handleSubmit = async (e) => {
    try {
      await firestore().collection('/posts').add({
        username,
        text,
        uid,
        time: new Date().getTime()
      });
      setText('');
      toast.success('Publicado');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Box height={20}></Box>
      <Container className={classes.container}>
        <Grid container spacing={3}>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField label="¿Qué estas pensando?" value={text} onChange={e => setText(e.target.value)} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit} style={{ float: 'right' }}>
              Publicar
            </Button>
          </Grid>

        </Grid>

        <Grid container spacing={3}>
          {
            posts.map((e, i) => <Item key={i} post={e} uid={uid} username={username} />)
          }

        </Grid>

      </Container>

    </div>
  )
}
