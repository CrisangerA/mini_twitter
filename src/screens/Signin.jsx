import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Grid, TextField, Button, Typography, Card, CardContent, Container, Box } from '../components/Material';
import { toast } from 'react-toastify';
import Auth from '../config/auth';
import { auth } from '../config/firebase.config';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '800px',
    [theme.breakpoints.up('sm')]: {
      width: '800px'
    },
  },
}));

export default function Signin() {
  const history = useHistory();
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const [createA, setCreateA] = useState(false);

  const handleSignin = async (e) => {
    try {
      setLoading(true);
      const cred = await auth().signInWithEmailAndPassword(email, password);
      if (cred.user) {
        console.info('Inicio de sesión satisfactorio');
        _next(cred.user.uid);
      }
      setLoading(false);
    } catch (e) {
      handleTryCatch(e);
      setLoading(false);
    }
  }

  const handleSignup = async (e) => {
    try {
      setLoading(true);
      const cred = await auth().createUserWithEmailAndPassword(email, password);
      if (cred.user) {
        console.info('Registro satisfactorio');
        await auth().currentUser.updateProfile({
          displayName: username
        });
        _next(cred.user.uid);
      }
      setLoading(false);
    } catch (e) {
      handleTryCatch(e);
      setLoading(false);
    }
  }

  const _next = async (token) => {
    Auth.singin(() => {
      history.push('/');
    }, token);
  }

  const handleTryCatch = (e) => {
    console.log(e);
    if (e.code === "auth/invalid-email") {
      toast.error('Email invalido');
    }
    if (e.code === "auth/user-not-found") {
      toast.info('Email no registrado');
    }
    if (e.code === "auth/wrong-password") {
      toast.error('Contraseña incorrecta');
    }
    if (e.code === "auth/weak-password") {
      toast.error('Contraseña invalida, mínimo 6 caracteres');
    }
  }

  const handleSubmit = async (e) => {
    if (createA) handleSignup();
    else handleSignin();
  }

  return (
    <div>
      <Box height={20}></Box>
      <Container className={classes.container}>
        <Card>
          <CardContent>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Typography variant="h2">
                  {createA ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </Typography>
              </Grid>
              {createA &&
                <Grid item>
                  <TextField label="Nombre de Usuario" variant="outlined" fullWidth onChange={(e) => setUsername(e.target.value)} />
                </Grid>
              }
              <Grid item>
                <TextField label="Email" type="email" variant="outlined" fullWidth onChange={(e) => setEmail(e.target.value)} />
              </Grid>
              <Grid item>
                <TextField label="Contraseña" type="password" variant="outlined" fullWidth onChange={e => setPassword(e.target.value)} />
              </Grid>
              <Grid item>
                <Button disabled={loading} variant="contained" color="primary" style={{ float: 'right' }} onClick={handleSubmit}>
                  {createA ? 'Crear cuenta' : 'Ingresar'}
                </Button>
              </Grid>
              <Grid item>
                <Typography variant="body1" align="center" onClick={e => setCreateA(!createA)}>
                  {createA ? 'Ya tiene cueneta. Iniciar Sesión' : 'Registrarse ahora'}
                </Typography>

                <Typography variant="body1" align="center">
                  ¿Olvido su contraseña?
              </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

    </div>
  )
}
