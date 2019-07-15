import React from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import axios from "axios";

import { getFromStorage } from '../utils/storage';

export default class TodoList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {todos: [], username: '', pass: '', userID:'',token:'', isLoading: true};
    }

    cleanList = () => {
        this.setState({ 
            todos: [], 
            username: '', 
            pass: '', 
            userID:'',
            isLoading: true,
        });
    }


    componentDidMount() {
        const obj = getFromStorage('the_main_app');
        if (obj && obj.token) {
          const { token } = obj;
          // Verify token
          fetch('http://localhost:5000/users/verify?token=' + token)
            .then(res => res.json())
            .then(json => {
              if (json.success) {
                    axios.get('http://localhost:5000/users/'+ json.userID)
                    .then(response => {
                        this.setState({ 
                            isLoading: false,
                            todos: response.data.todos,
                            username: response.data.username,
                            pass: response.data.password,
                            userID: json.userID,
                            token
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
              }else{
                this.setState({
                    isLoading: false,
                  });
              }
            });
        } else {
          this.setState({
            isLoading: false,
          });
        }
    }

    addTodo = text => {
        const currentTodo = {
            name: text,
            description: "",
            isdone: false
        }
        const user = {
            username: this.state.username,
            password: this.state.pass,
            todos : [currentTodo, ...this.state.todos]
        }
        //console.log(user);
        axios.post('http://localhost:5000/users/update/'+ this.state.userID +'/'+this.state.username, user)
            .then(() =>
                 {
                    axios.get('http://localhost:5000/users/'+ this.state.userID)
                    .then(response => {
                        this.setState({ todos: response.data.todos});
                        //console.log("STATE UPDATED")
                        //console.log(this.state);
                    });
                }
            )
            .catch((error) => {
                console.log(error);
            });
            
          axios.get('http://localhost:5000/users/'+ this.state.userID)
            .then(response => {
                this.setState({ todos: response.data.todos});
            });

        //console.log(this.state);
    }

    toggleComplete = (id, isdone) =>{
        if(isdone){
            axios.put('http://localhost:5000/users/todo/false/' + id +'/' + this.state.username);
        }else{
            axios.put('http://localhost:5000/users/todo/true/' + id +'/' + this.state.username);
        }

        this.setState({
            todos: this.state.todos.map( todo => {
                if (todo._id === id){
                    return {
                        ...todo,
                        isdone: !todo.isdone,
                    }
                }else{
                    return todo;
                }
            })
        })
    }

    handleDeleteTodo = (id) => {
        axios.put('http://localhost:5000/users/todo/delete/' + id +'/' + this.state.username)
            //.then(res => console.log(res.data))
            .catch((error) => {
                console.log(error);
            });
        this.setState({
            todos: this.state.todos.filter(todo => todo._id !== id)
        })
    }
    
    render(){

        if (this.state.isLoading) {
            return (
            <div>
              <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>);
          }

        if(this.state.token){
            return (
            <div className ="todo-list form-container">
                <TodoForm onSubmit={this.addTodo} />
                {this.state.todos.map(todo => 
                <Todo 
                key = {todo._id}
                toggleComplete={() => this.toggleComplete(todo._id, todo.isdone)}
                onDelete = {() => this.handleDeleteTodo(todo._id)} 
                todo={todo}/>
                )}
            </div>
            );
        }

        return(
            <div className="form-container">
            <p className="form-title">Por favor inicia sesión</p>
            </div>
        )
    }
}