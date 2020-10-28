import React, { useEffect, useState } from 'react';
import { makeStyles, Grid, Typography, TextField, Container, Button, Box, Card, CardContent, Avatar, Zoom } from '../components/Material';
import { CircularLabelProgress, CTooltip } from '../components/Custom';
import { toast } from 'react-toastify';
import { auth, firestore, storage } from '../config/firebase.config';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '800px',
    [theme.breakpoints.up('sm')]: {
      width: '800px'
    },
  },
}));

export default function Account() {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('************');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [birthday, setBirthday] = useState('');
  const [description, setDescription] = useState('');

  const [docid, setDocid] = useState('');
  const [uid, setUid] = useState('');
  const [loadImage, setLoadImage] = useState(false);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [imageurl, setImageurl] = useState('');
  const [bucketurl, setBucketurl] = useState('');

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user !== null) {
        setUid(user.uid);
        setEmail(user.email);
        setUsername(user.displayName);
        handleGetAccount(user.uid);
      }
    })
  }, []);

  const handleGetAccount = async (xuid) => {
    try {
      //console.log(xuid);
      const accounts = await firestore().collection('/users').where('uid', '==', xuid).get();
      const account = accounts.docs.map((doc, i) => {
        const x = doc.data();
        return { ...x, id: doc.id }
      })[0];
      if (account) {
        console.log(account);
        setDocid(account.id);
        // console.log(doc.id);
        // const u = doc.data();
        setName(account.name);
        setLastname(account.lastname);
        setBirthday(account.birthday);
        setDescription(account.description);
        setImageurl(account.imageurl);
        setBucketurl(account.bucketurl);
      } else {
        //toast.error('Iniciar sesión nuevamente')
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleSubmit = async () => {
    try {
      await auth().currentUser.updateProfile({
        displayName: username
      });
      console.log(docid);
      if (docid !== '') {
        await firestore().collection('/users').doc(docid).update({ name, lastname, birthday, description });
      } else {
        await firestore().collection('/users').add({ name, lastname, birthday, description, uid });
      }
      toast.success('Usuario actualizado');
      await handleGetAccount(uid);
    } catch (e) {
      console.log(e);
    }
  }

  const deleteImageFirebase = async (storageRef) => {
    try {
      await storageRef.child(bucketurl).delete();
    } catch (e) {
      console.error('error al eliminar imagen firebase');
    }
  }

  const handleChangeFile = async (selectorFiles) => {
    try {
      setLoadImage(true);
      let insession = auth().currentUser;
      if (!insession) {
        let credential = await auth().signInWithEmailAndPassword('uploads@mrya.com.co', 'upl04ds');
        console.info('No habia sesion: ' + credential.user?.email)
      }
      const storageRef = storage().ref();
      if (imageurl !== '') {
        if (bucketurl !== '') {
          await deleteImageFirebase(storageRef);
        }
      }
      let file = selectorFiles[0];
      if (file) {
        let imgref = storageRef.child(`images/users/user_${new Date().getTime()}`);
        let uploadTask = imgref.put(file);
        uploadTask.on('state_changed', (snapshot) => {
          let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setLoadPercentage(percentage);
        }, (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              console.error('User doesn\'t have permission to access the object');
              break;
            case 'storage/canceled':
              console.info('User canceled the upload');
              break;
            case 'storage/unknown':
              console.error('Unknown error occurred, inspect error.serverResponse');
              break;
            default:
              break;
          }
          console.error("Something nasty happened", error);
          setLoadImage(false);
        }, async () => {
          let downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          console.log('File available at', downloadURL);
          setImageurl(downloadURL);
          setBucketurl(uploadTask.snapshot.ref.fullPath);
          setLoadImage(false);
          await firestore().collection('/users').doc(docid).update({
            imageurl: downloadURL,
            bucketurl: uploadTask.snapshot.ref.fullPath
          })
          auth().currentUser.updateProfile({ photoURL: downloadURL });
        });
      }
    } catch (e) {
      console.log(e);
      setLoadImage(false);
    }
  }

  return (
    <div>
      <Box height={20}></Box>

      <Container className={classes.container}>
        <Card>
          <CardContent>
            {/* <Grid container>
              <Grid item>
                <Typography variant="h3">
                  Mi Perfíl
                </Typography>
              </Grid>
            </Grid> */}
            <Grid container direction="row" alignItems="center">
              <label htmlFor="upload-photo">
                <input
                  style={{ display: 'none' }}
                  id="upload-photo"
                  name="upload-photo"
                  type="file"
                  onChange={(e) => handleChangeFile(e.target.files)}
                />
                <CTooltip
                  title="Seleccionar imagen" TransitionComponent={Zoom}>
                  <Button component="span" disabled={loadImage}>
                    {loadImage
                      ? <CircularLabelProgress value={loadPercentage} />
                      : <Avatar alt="Remy Sharp" src={imageurl} />
                    }
                  </Button>
                </CTooltip>
              </label>
              <Box width={10}></Box>
              <Typography variant="h4" component="h4">
                Mi Perfíl
              </Typography>
            </Grid>

            <Grid container direction="column" spacing={3}>

              <Grid item>
                <div>

                </div>
              </Grid>

              <Grid item>
                <TextField label="Nombre de Usuario" value={username} variant="outlined" onChange={(e) => setUsername(e.target.value)} fullWidth />
              </Grid>

              <Grid item>
                <TextField label="Email" value={email} variant="outlined" onChange={(e) => setEmail(e.target.value)} fullWidth />
              </Grid>
              {/* <Grid item>
                <TextField label="Contraseña" value={password} variant="outlined" onChange={e => setPassword(e.target.value)} fullWidth />
              </Grid> */}

              <Grid item>
                <TextField label="Nombre" value={name} variant="outlined" onChange={e => setName(e.target.value)} fullWidth />
              </Grid>

              <Grid item>
                <TextField label="Apellido" value={lastname} variant="outlined" onChange={e => setLastname(e.target.value)} fullWidth />
              </Grid>

              <Grid item>
                <TextField type="date" value={birthday} variant="outlined" onChange={e => setBirthday(e.target.value)} fullWidth />
              </Grid>

              <Grid item>
                <TextField label="Descripción" value={description} variant="outlined" onChange={e => setDescription(e.target.value)} fullWidth />
              </Grid>

              <Grid item>
                <Button variant="contained" color="primary" style={{ float: 'right' }} onClick={handleSubmit}>
                  Guardar
                </Button>
              </Grid>

            </Grid>
          </CardContent>
        </Card>

      </Container>


    </div>
  )
}
