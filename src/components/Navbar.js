import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav>
        <Link to="/">INICIO</Link>
        <Link to="/todolist">Mi Lista</Link>
      </nav>
    );
  }
}