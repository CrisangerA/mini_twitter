import React from 'react';
import { Switch, Route } from 'react-router-dom';
// Componen
import { Private } from './components/Private';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
// Screens
import Account from './screens/Account';
import Home from './screens/Home';
import Signin from './screens/Signin';
// Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
library.add(fas, fab);


export default function App() {
  return (
    <div>
      <Navbar />
      <Switch>
        <Private exact path="/" component={Home} />
        <Private path="/account" component={Account} />
        <Route path="/signin" component={Signin} />
      </Switch>
      {/* <Signin /> */}
      <ToastContainer position="bottom-center" />
    </div>
  )
}
