import logo from './logo.svg';
import './App.css';
import {
	BrowserRouter,
	Switch,
	Route,
	Link
} from "react-router-dom";
import Root from './Component/Root.js';
import Login from './Component/Login.js';
import Register from './Component/Register.js';
import Homepage from './Component/Homepage.js';


function App() {
  return (
    <BrowserRouter>
		<Route exact path="/" component={ Root }/>
		<Route exact path="/login"  component={ Login }/>
		<Route exact path="/register"  component={ Register }/>
		<Route exact path="/homepage"  component={ Homepage }/>
	</BrowserRouter>
  );
}

export default App;
