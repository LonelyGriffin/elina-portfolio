import React, { Component } from 'react';
import { FullWindowContainer } from '../full_window_container';
import { PhotosScreens } from '../photos_screens';
import { PageScroll, SCROLL_UP } from '../../utils/page_scroll';
import { Single } from '../single';
import * as THREE from 'three';
import './style.css';

const screens = [
  {
    title: 'Сирень',
    cover: './img/cover.jpg',
    images: [
      './img/1_g.jpg',
      './img/2_g.jpg',
      './img/1_v.jpg',
    ],
  },
  {
    title: 'Сирень',
    cover: './img/cover.jpg',
    images: [
      './img/1_g.jpg',
      './img/2_g.jpg',
      './img/1_v.jpg',
    ],
  },
  {
    title: 'Сирень',
    cover: './img/cover.jpg',
    images: [
      './img/1_g.jpg',
      './img/2_g.jpg',
      './img/1_v.jpg',
    ],
  },
  {
    title: 'Сирень',
    cover: './img/cover.jpg',
    images: [
      './img/1_g.jpg',
      './img/2_g.jpg',
      './img/1_v.jpg',
    ],
  },
]

const loadTexture = async (imageUrl) => {
  return new Promise(done => {
    const texture = new THREE.TextureLoader().load(imageUrl, () => {
      // texture.wrapS = THREE.RepeatWrapping;
      // texture.wrapT = THREE.RepeatWrapping;
      texture.minFilter = THREE.LinearFilter;
      // texture.repeat.set(1, 1);
      done(texture);
    });
  });
}

const loadTextures = async (imageUrls) => {
  const textures = [];
  for(let i = 0; i < imageUrls.length; i++) {
    const texture = await loadTexture(imageUrls[i]);
    textures.push(texture);
  }
  return textures;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPageNumber: -1,
      loaded: false,
      showContent: false,
    }
  }

  async componentDidMount(){
    PageScroll.on(this.handleScroll);

    for(let i = 0; i < screens.length; i++) {
      screens[i].images = await loadTextures(screens[i].images);
      screens[i].cover = await loadTexture(screens[i].cover);
    }

    this.setState({
      showContent: true,
    }, () => {
      setTimeout(() => {
        this.setState({
          loaded: true,
        });
      }, 500);
    });
  }
  componentWillUnmount(){
    PageScroll.off(this.handleScroll);
  }

  handleScroll = (scrollEvent) => {
    PageScroll.freeze();
    setTimeout(() => {
      PageScroll.unfreeze();
    }, 1000);

    const newCurrentPageNumber = scrollEvent === SCROLL_UP
      ? this.state.currentPageNumber - 1
      : this.state.currentPageNumber + 1;

    if (newCurrentPageNumber >= screens.length) return;
    if (newCurrentPageNumber < -1) return;

    this.setState({
      currentPageNumber: newCurrentPageNumber,
    });
  }

  render() {
    const isHomePage = this.state.currentPageNumber === -1;

    return (
      <FullWindowContainer>
        {this.state.showContent && <div className="app">
          <PhotosScreens screens={screens} currentPage={this.state.currentPageNumber}>
          </PhotosScreens>
        </div>}
        {this.state.showContent && <div className="app-single">
          <Single
            isHomePage={isHomePage}
            currentPageNumber={this.state.currentPageNumber}
            screens={screens}
            onChangeScreen={newScreen => {
              this.setState({
                currentPageNumber: newScreen,
              })
            }}
          ></Single>
        </div>}
        {!this.state.loaded && <div className="app-loader">
            <div className="app-loader--body"></div>
        </div>}
      </FullWindowContainer>
    );
  }
}

export default App;
