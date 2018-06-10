import React, { Component } from 'react';
import { FullWindowContainer } from '../full_window_container';
import { PhotosScreen } from '../photos_screen';
import { Screen } from '../screen';
import './style.css';


export class PhotosScreens extends Component {
  renderScreens = () => {
    return this.props.screens.map((screen, index) =>
      <PhotosScreen
        key={index}
        title={screen.title}
        images={screen.images}
        cover={screen.cover}
        currentScreen={this.props.currentPage}
        screenNumber={index}
      >
      </PhotosScreen>
    )
  }

  getContainerTop = () => {
    const { currentPage } = this.props;

    return -(currentPage + 1) * 100;
  }

  render() {
    const containerStyle = {
      top: `${this.getContainerTop()}%`,
    }

    const screens = this.renderScreens();
    screens.unshift(<Screen key="home"></Screen>);
    return (
      <FullWindowContainer>
          <div className="screens">
            <div className="screens-container" style={containerStyle}>
              { screens }
            </div>
          </div>
      </FullWindowContainer>
    );
  }
}

