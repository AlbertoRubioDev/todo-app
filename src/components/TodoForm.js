import React from "react";

export default class TodoForm extends React.Component{

    state = {
        text: ''
    }

    handleChange = (event) =>{
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.text);
        this.setState({
            text: ""
        });
    }

    render(){
        return (
        <form onSubmit={this.handleSubmit}>
            <input 
                className="form-control"
                name="text"
                value={this.state.text} 
                onChange={this.handleChange}
                placeholder="Agregar un To-do..."
                required
            />
            <button className="form-button add-button" onClick={this.handleSubmit}>
                add todo
            </button>
        </form>
        );
    }
}