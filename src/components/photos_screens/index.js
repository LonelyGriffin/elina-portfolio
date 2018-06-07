import React, { Component } from 'react';
import { FullWindowContainer } from '../full_window_container';
import { PhotosScreen } from '../photos_screen';
import posed from 'react-pose'
import './style.css';

const AnimatedScreens = posed.div({
  0: { top: '0%' },
  1: { top: '-50%' },
})

export class PhotosScreens extends Component {
  renderScreens = () => {
    return this.props.screens.map((screen, index) =>
      <PhotosScreen
        key={index}
        title={screen.title}
        images={screen.images}
      >
      </PhotosScreen>
    )
  }

  getContainerTop = () => {
    const { currentPage, screens } = this.props;

    return -currentPage * 100;
  }

  render() {
    const currentPage = this.props.currentPage;
    const containerStyle = {
      top: `${this.getContainerTop()}%`,
    }
    return (
      <FullWindowContainer>
          <div className="screens">
            <div className="screens-container" style={containerStyle}>
              { this.renderScreens() }
            </div>
          </div>
      </FullWindowContainer>
    );
  }
}

