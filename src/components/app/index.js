import React, { Component } from 'react';
import { FullWindowContainer } from '../full_window_container';
import { PhotosScreens } from '../photos_screens';
import { PageScroll, SCROLL_UP } from '../../utils/page_scroll';
import './style.css';

const screens = [
  {
    title: 'Screen1',
    images: [
      './img/1_g.jpg',
      './img/1_g.jpg',
    ],
  },
  {
    title: 'Screen2',
    images: [
      './img/2_g.jpg',
      './img/1_v.jpg',
    ],
  },
  {
    title: 'Screen3',
    images: [
      './img/2_v.jpg',
      './img/1_v.jpg',
    ],
  },
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPageNumber: 0,
    }
  }

  componentDidMount(){
    PageScroll.on(this.handleScroll);
  }
  componentWillUnmount(){
    PageScroll.off(this.handleScroll);
  }

  handleScroll = (scrollEvent) => {
    const newCurrentPageNumber = scrollEvent === SCROLL_UP
      ? this.state.currentPageNumber - 1
      : this.state.currentPageNumber + 1;

    if (newCurrentPageNumber >= screens.length) return;
    if (newCurrentPageNumber < 0) return;

    this.setState({
      currentPageNumber: newCurrentPageNumber,
    });
  }

  render() {
    return (
      <FullWindowContainer>
        <div className="app">
          <PhotosScreens screens={screens} currentPage={this.state.currentPageNumber}>
          </PhotosScreens>
        </div>
      </FullWindowContainer>
    );
  }
}

export default App;
