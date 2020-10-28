import React from 'react';
import Auth from '../config/auth';
import { Route, Redirect } from 'react-router-dom';

export const Private = ({ component: Component, ...rest }) => {
  //console.log(props);
  //console.log(Auth.isAuthenticated())
  const xchild = (props) => Auth.isAuthenticated() === true
    ? <Component {...props} />
    : <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />;

  return <Route {...rest} render={xchild} />
}