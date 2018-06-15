import React, { Component } from 'react';
import { WaveBox } from '../wave_box';
import { FullWindowContainer } from '../full_window_container';
import {SlideAppearance, SLIDE_APPEARANCE_UP, SLIDE_APPEARANCE_NORMAL} from '../slide_appearance';
import './style.css';

export class Single extends Component {

  render() {
    const { isHomePage } = this.props;

    const waveBoxStyle = {
      position: 'absolute',
      width: '100%',
      height: '50%',
      transform: 'rotate(180deg)',
      transition: 'top ease-in 1s',
      top: isHomePage ? '0%' : '-100%',
    }

    const titleStyle = {
      position: 'relative',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFace: "'Source Sans Pro', sans-serif",
      fontSize: isHomePage ? '40px' : '10px',
      top: isHomePage ? '20%' : '1%',
      transition: 'top ease-in 1s, font-size ease-in 1s',
    }

    const mailStyle = {
      opacity: isHomePage ? '0' : '1',
      transition: 'opacity ease-in 1s',
    }

    
    const topLine = 100 * (this.props.currentPageNumber === -1 ? 0 : this.props.currentPageNumber) / (this.props.screens.length - 1);

    const topLineStyle = {
      height: `calc(${topLine}% - 17px)`,
      transition: 'height ease-in 1s',
    }

    const scrollStyle = {
      opacity: isHomePage ? '0' : '1',
      transition: 'opacity ease-in 1s',
    }

    const subTitleState = isHomePage ? SLIDE_APPEARANCE_NORMAL : SLIDE_APPEARANCE_UP;
    const arrowState = isHomePage ? SLIDE_APPEARANCE_NORMAL : SLIDE_APPEARANCE_UP;

    return (
      <FullWindowContainer>
        <WaveBox style={waveBoxStyle}></WaveBox>
        <div style={titleStyle}>
          <h1 style={{margin: 0, padding: 0, display: 'inline-block'}}>
            Эллина Вдовина
          </h1>
          <SlideAppearance state={subTitleState}>
            <span>Профессиональный фотограф</span>
          </SlideAppearance>
        </div>
        <div className="single--arrow">
          <SlideAppearance state={arrowState}>
            <span>⇣</span>
          </SlideAppearance>
        </div>
        <div className="single--mail" style={mailStyle}>
            <div className="single--mail-inner">
              <a href="mailto:elina@gmail.com">elina@gmail.com</a>
            </div>
        </div>
        <div className="single--scroll" style={scrollStyle}>
          <div className="single--scroll--titles">
            {
              this.props.screens.map((screen, index) => (
                <div
                  className="single--scroll--title"
                  onClick={() => this.props.onChangeScreen(index)}
                  key={index}
                >
                  {screen.title}
                </div>
              ))
            }
          </div>
          <div className="single--scroll--line">
            <div className="single--scroll--line--top" style={topLineStyle}></div>
            <div className="single--scroll--line--middle">{this.props.currentPageNumber === -1 ? 1 : this.props.currentPageNumber + 1}</div>
            <div className="single--scroll--line--down"></div>
          </div>
        </div>
      </FullWindowContainer>
    )
  }
}