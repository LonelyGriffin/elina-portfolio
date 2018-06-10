import React, { Component } from 'react';
import { Screen } from '../screen';
import { PhotosSlider } from '../photos_slider';
import './style.css';

export class PhotosScreen extends Component {

  render() {
    return (
      <Screen className="photos-screen">
        <div className="photos-screen--slider">
          <PhotosSlider {...this.props}>
          </PhotosSlider>
        </div>
      </Screen>
    );
  }
}

