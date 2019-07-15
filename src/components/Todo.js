import React from "react";

export default props =>(
<div className="todo">
    <div className="todo-text" style= {{
        textDecoration: props.todo.isdone ? "line-through" : ""
    }}
        onClick={props.toggleComplete}>
        {props.todo.name}
    </div>
    <button className="del-button" onClick={props.onDelete}>x</button>
</div>
);