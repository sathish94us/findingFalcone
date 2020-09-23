import React from 'react';
import './App.css';
import Home from './components/home/Home';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Result from './components/result/Result';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

function App() {
  return (
    <React.Fragment>
      {/* Header */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography style={{ textAlign: "center" }} variant="h6">
            Finding Falcone
          </Typography>
            <a className="cl-geektrust" href="https://www.geektrust.in/" target="_blank"><Button color="inherit">GeekTrust Home</Button></a>
        </Toolbar>
      </AppBar>
      {/* Router */}
      <BrowserRouter>
        <Switch>
          <Route path="/home" exact component={Home}></Route>
          <Route path="/find" exact component={Result}></Route>
          <Redirect from="/" to="/home"></Redirect>
        </Switch>
        {/* Footer */}
      </BrowserRouter >
      <div className={"cl-footer"}>
        <span>Coding problem - <a href="https://www.geektrust.in/coding-problem/frontend/space" target="_blank">www.geektrust.in/coding-problem/frontend/space</a></span>
      </div>
    </React.Fragment>
  );
}

export default App;
