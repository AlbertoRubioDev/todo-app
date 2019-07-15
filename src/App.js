import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "./components/Navbar";
import TodoList from "./components/TodoList";
import SignIn from "./components/SignIn";


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userID: ''
    }
    this.list = React.createRef();
  }

  changeUser = (id) => {
    this.setState({
      userID: id
  });
  
  }

  cleanList = () =>{
    this.list.current.cleanList();
  }
  
  render(){
      return(
        <Router>
          <div>
              <Navbar />
              <br/>
              <Route path="/" exact render={(props) => <SignIn {...props} 
              cleanList = {this.cleanList} 
              changeUser = {this.changeUser} 
              />}  />
              <Route path="/todolist"  render={(props) => <TodoList {...props} 
              ref={this.list} 
              userID = {this.state.userID} 
              />} />
          </div>
        </Router>
      )
  }
}

export default App;
