import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardActions, IconButton, TextField, Avatar, Box, Typography, Badge } from './Material';
import { CTooltip } from './Custom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { firestore, auth } from '../config/firebase.config';

export default function Item({ post, uid, username }) {
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  const [imageurl, setImageurl] = useState('');

  // dynamic
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ncomments, setNcomments] = useState(0);
  const [nlikes, setNlikes] = useState(0);

  useEffect(() => {
    handleGetComments();
    handleGetLikes();
    auth().onAuthStateChanged(user => {
      if (user !== null) {
        setImageurl(user.photoURL);
      }
    });    
  }, []);

  const handleGetComments = async () => {
    try {
      const ref = await firestore().collection('/coments').where('postid', '==', post.id).orderBy('time', 'desc').get();
      const c = ref.docs.map(comment => { return { ...comment.data(), id: comment.id } });
      //console.log(c);
      setComments(c);
      setNcomments(c.length);
    } catch (e) {
      console.log(e);
    }
  }

  const handleGetLikes = async () => {
    try {
      const ref = await firestore().collection('/likes').where('postid', '==', post.id).get();
      const l = ref.docs.map(like => { return { ...like.data(), id: like.id } });
      //console.log('Likes');
      setNlikes(l.length)
      //console.log(l);
    } catch (e) {
      console.log(e);
    }
  }

  const handleSetLike = async () => {
    try {
      const ref = await firestore().collection('/likes').where('postid', '==', post.id).where('uid', '==', uid).get();
      const lastl = ref.docs.map(l => { return { ...l.data(), id: l.id } });
      console.log(lastl);
      if (lastl.length === 0) {
        await firestore().collection('/likes').add({
          postid: post.id,
          uid
        });
      } else {
        await firestore().collection('/likes').doc(lastl[0].id).delete();
      }
      await handleGetLikes();
    } catch (e) {
      console.log(e);
    }
  }

  const handleEnter = async (e) => {
    try {
      if (e.key === 'Enter') {
        setLoading(true);
        console.log(post);
        await firestore().collection('/coments').add({
          text,
          postid: post.id,
          time: new Date().getTime(),
          username
        });
        await handleGetComments();
        setText('');
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
      <Card>
        <CardContent>

          <Grid container direction="row" alignItems="center">
            <Avatar alt={post.username} src={imageurl} />
            <Box width={10}></Box>
            <Typography variant="h6" component="h6">
              {post.username}
            </Typography>
          </Grid>

          <Typography variant="body1" >
            {post.text}
          </Typography>
          <Typography variant="caption" align="right" >
            {new Date(post.time).toLocaleString()}
          </Typography>

        </CardContent>

        <CardActions>
          <CTooltip title="Me Gusta">
            <IconButton aria-label="user" color="inherit" onClick={handleSetLike}>
              <Badge badgeContent={nlikes} color="primary">
                <FontAwesomeIcon icon="heart" />
              </Badge>
            </IconButton>
          </CTooltip>

          {/* <CTooltip title="No Me Gusta">
            <IconButton aria-label="user" color="inherit">
              <FontAwesomeIcon icon="heart-broken" />
            </IconButton>
          </CTooltip> */}

          <CTooltip title="Comentar">
            <IconButton aria-label="user" color="inherit" onClick={e => setActive(!active)}>
              <Badge badgeContent={ncomments} color="primary">
                <FontAwesomeIcon icon="comment" />
              </Badge>
            </IconButton>
          </CTooltip>
        </CardActions>

        {
          active && <CardContent>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <TextField
                disabled={loading}
                onKeyPress={handleEnter}
                label="¿Qué estas pensando?"
                value={text}
                onChange={e => setText(e.target.value)}
                variant="outlined"
                fullWidth />
            </Grid>
          </CardContent>
        }

        {
          active &&
          <CardContent>
            <Grid container direction="column" spacing={1}>
              {
                comments.map((comment, i) =>
                  <Grid key={i} item>
                    <Grid container direction="row" alignItems="center">
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                      <Box width={10}></Box>
                      <Grid item>
                        <Grid container direction="column" >
                          <Typography variant="caption">
                            {comment.username}
                          </Typography>
                          <Typography variant="body2">
                            {comment.text}
                          </Typography>
                        </Grid>
                      </Grid>

                    </Grid>
                  </Grid>
                )
              }
            </Grid>
          </CardContent>
        }

      </Card>
    </Grid>
  )
}
