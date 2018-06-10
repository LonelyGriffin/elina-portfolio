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
      height: '10%',
      transition: 'top ease-in 1s',
      top: isHomePage ? '90%' : '150%',
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
      </FullWindowContainer>
    )
  }
}