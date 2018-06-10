import React, { Component } from 'react';
import { FullWindowContainer } from '../full_window_container';
import { PhotosScreens } from '../photos_screens';
import { PageScroll, SCROLL_UP } from '../../utils/page_scroll';
import { Single } from '../single';
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
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPageNumber: -1,
    }
  }

  componentDidMount(){
    PageScroll.on(this.handleScroll);
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
        <div className="app">
          <PhotosScreens screens={screens} currentPage={this.state.currentPageNumber}>
          </PhotosScreens>
        </div>
        <div className="app-single">
          <Single isHomePage={isHomePage}></Single>
        </div>
      </FullWindowContainer>
    );
  }
}

export default App;
