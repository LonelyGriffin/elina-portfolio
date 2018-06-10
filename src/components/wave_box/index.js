import React, { Component } from 'react';
import './style.css';

export class WaveBox extends Component {
  render() {
    return (
      <div className={`wave-box ${this.props.className || ""}`} style={this.props.style}>
        <div className="wave-box--wave"></div>
        <div className="wave-box--wave"></div>
      </div>
    );
  }
}