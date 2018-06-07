import React, { Component } from 'react';
import { FullWindowContainer } from '../full_window_container';

export class Screen extends Component {
  render() {
    return <section>
      <FullWindowContainer className={this.props.className}>
        { !this.props.virtualized && this.props.children }
      </FullWindowContainer>
    </section>
  }
}