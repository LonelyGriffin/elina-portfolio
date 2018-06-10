import React, { Component } from 'react';
import './style.css';

export const SLIDE_APPEARANCE_UP = 'SLIDE_APPEARANCE_UP';
export const SLIDE_APPEARANCE_NORMAL = 'SLIDE_APPEARANCE_NORMAL';
export const SLIDE_APPEARANCE_DOWN = 'SLIDE_APPEARANCE_DOWN';

export class SlideAppearance extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    this.forceUpdate();
  }

  render() {
    const { state } = this.props;

    const height = this.containerRef.current
      ? this.containerRef.current.clientHeight
      : 0;

    const top = state === SLIDE_APPEARANCE_UP
    ? -height
    : state === SLIDE_APPEARANCE_DOWN
      ? height
      : 0;

    return (
      <div className={this.props.className || ''} style={this.props.style} >
        <div className="slide-appearance" ref={this.containerRef}>
          <div
            className="slide-appearance--inner" 
            style={{top: `${top}px`, transition: this.props.transition || "top ease-in 0.5s"}}
          >
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}