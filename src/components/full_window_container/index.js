import React, { Component } from 'react';
import { WindowResize } from '../../utils/window_resize';
import { getWindowHeight, getWindowWidth } from '../../utils/window_size';

export class FullWindowContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: getWindowWidth(),
      height: getWindowHeight(),
    }
  }

  componentDidMount() {
    WindowResize.on(this.handleWindowResize);
  }
  componentWillUnmount() {
    WindowResize.off(this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({
      width: getWindowWidth(),
      height: getWindowHeight(),
    })
  }

  render() {
    return <div
      className={this.props.className}
      style={{width: this.state.width, height: this.state.height}}
    >
      { this.props.children }
    </div>
  }
}