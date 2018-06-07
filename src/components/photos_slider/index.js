import React, { Component } from 'react';
import { WindowResize } from '../../utils/window_resize';
import { getWindowHeight, getWindowWidth } from '../../utils/window_size';
import { ImageCache } from '../../utils/image_cache';
import './style.css';

// const isWaveOverImage = (waveX, waveY, radius, x, y, w, h) => {

// };

var spherize = function(px,py, width, height, curX, curY, maxr) {
  var x = px-curX;
  var y = py-curY;
  var r = Math.sqrt(x*x+y*y);
  if (r>maxr) return {
      'xx':px,
      'yy':py
  }
  var a = Math.atan2(y,x);
  var k = (r/maxr)*(r/maxr)*0.5+0.5;
  var dx = Math.cos(a)*r*k;
  var dy = Math.sin(a)*r*k;
  return {
      'xx': dx+curX,
      'yy': dy+curY
  }
}

const colorat = (x, y, channel, texture, height) => {
  return texture.data[(x + y * height) * 4 + channel];
}


export class PhotosSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: getWindowWidth(),
      height: getWindowHeight(),
      x: 0,
      y: 0,
      h: 0,
      w: 0,
      currentImage: 0,
    }

    this.canvasRef = React.createRef();
    this.doubleBufferCanvas = document.createElement('canvas');
    this.doubleBufferCtx = this.doubleBufferCanvas.getContext('2d');

    this.timer = undefined;
    this.radius = 0;
  }

  async componentDidMount() {
    WindowResize.on(this.handleWindowResize);
    this.ctx = this.canvasRef.current.getContext('2d');
    const width = getWindowWidth();
    const height = getWindowHeight();
    this.setCanvasesSize(width, height);

    this.images = await ImageCache.getImages(this.props.images);

    this.renderCanvas();
  }
  componentWillUnmount() {
    WindowResize.off(this.handleWindowResize);
    clearInterval(this.timer);
  }
  componentDidUpdate() {
    this.renderCanvas();
  }

  handleWindowResize = () => {
    const width = getWindowWidth();
    const height = getWindowHeight();

    this.setCanvasesSize(width, height);

    this.setState({
      width,
      height,
    });
  }

  setCanvasesSize = (width, height) => {
    this.doubleBufferCanvas.width = width;
    this.doubleBufferCanvas.height = height;
    this.canvasRef.current.width = width;
    this.canvasRef.current.height = height;
  }

  renderCanvas () {
    const { currentImage } = this.state;
    const { x, y, w, h } = this.getImageBoundary(this.images[currentImage]);
    this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    this.ctx.drawImage(this.images[currentImage], x, y, w, h);
    if (
      x !== this.state.x ||
      y !== this.state.y ||
      w !== this.state.w ||
      h !== this.state.h
    ) {
      this.setState({x, y, w, h});
    }
  }

  getImageBoundary = (img) => {
    const { width, height } = this.state;
    const imgWidth = img.width;
    const imgHeight = img.height;

    const boundaryWidth = Math.round(0.7 * width);
    const boundaryHeight = Math.round(0.8 * height);
    
    let w = imgWidth > boundaryWidth ? boundaryWidth : imgWidth;
    let h = imgHeight > boundaryHeight ? boundaryHeight : imgHeight;

    if (w < h) {
      h = w * (imgHeight / imgWidth);
    } else {
      w = h * (imgWidth / imgHeight);
    }

    const x = Math.round((width - w) / 2);
    const y = Math.round((height - h) / 2);

    return { x, y, w, h };
  }

  handleMouseEnter = (e) => {
    // console.log(e, 'enter');
  }
  handleMouseLeave = (e) => {
    // console.log(e, 'leave');
  }
  handleClick = (e) => {
    const { currentImage } = this.state;
    const newCurrentImage = currentImage >= this.props.images.length - 1 ? 0 : currentImage + 1;
    this.setState({
      currentImage: newCurrentImage,
    });

    this.makeAnimateWaveEffect(e.clientX, e.clientY);
  }

  makeAnimateWaveEffect(waveX, waveY) {
    console.log(waveX, waveY, 'x y');

    clearInterval(this.timer);
    this.radius = 0;

    this.timer = setInterval(() => {
      const { radius } = this;
      if (radius > 1000) {
        clearInterval(this.timer);
        this.renderCanvas();
        return;
      }

      const { currentImage, width, height } = this.state;
      const { x, y, w, h } = this.getImageBoundary(this.images[currentImage]);
      // this.ctx.fillStyle = "rgb(256, 256, 256)";
      // this.ctx.fillRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
      this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
      this.ctx.drawImage(this.images[currentImage], x, y, w, h);

      const pixelsSource = this.ctx.getImageData(0, 0, width, height);
      const pixelsResult = this.ctx.getImageData(0, 0, width, height);
      const waveSize = 300;

      for (let curX = 0; curX < width; curX++) {
        for(let curY = 0; curY < height; curY++) {
          const curDistance = Math.sqrt((curX - waveX) ** 2 + (curY - waveY) ** 2);
          if (curDistance > radius && curDistance < radius + waveSize) {
            const waveScale = Math.sin(Math.PI * (curDistance - radius) / waveSize);
            // const waveScale = 0;

            // const zoomedX = Math.floor((curX + width * 0.5) * 0.5);
            // const zoomedY = Math.floor((curY + height * 0.5) * 0.5);
            
            // const k1 = 0.5 + 0.5 * waveScale;
            // const k2 = (k1 - 0.5) / 2 - (k1 - 0.5) * waveScale / 2;
            const k1 = 0.5 + 0.5 * Math.sin((Math.PI / 2) * (curDistance - radius) / waveSize);
            const k2 = (1 - k1) / 2;


            const spherizedX = Math.floor(curX * k1 + width * k2);
            const spherizedY = Math.floor(curY * k1 + height * k2);
            // const k = (curDistance + waveSize / 2) / curDistance;
            // const kx = k;
            // const ky = k;
            

            // const { xx, yy } = spherize(curX, curY, width, height, curX * kx, curY * ky, radius + waveSize);
            // const spherizedX = Math.floor(xx);
            // const spherizedY = Math.floor(yy);
            const resultIndex = (curY * width + curX) * 4;
            // const sourceIndex = (curY * width + curX) * 4;
            const sourceIndex = (spherizedY * width + spherizedX) * 4;
            pixelsResult.data[resultIndex] = pixelsSource.data[sourceIndex] + waveScale * 100;
            pixelsResult.data[resultIndex + 1] = pixelsSource.data[sourceIndex + 1] + waveScale * 100;
            pixelsResult.data[resultIndex + 2] = pixelsSource.data[sourceIndex + 2] + waveScale * 100;
            // pixelsResult.data[resultIndex + 3] = 256;
          }
        }
      }
      // for (var j = 0; j < height; j++) {
      //     for (var i = 0; i < width; i++) {
      //         var u = map[(i + j * height) * 2];
      //         var v = map[(i + j * height) * 2 + 1];
      //         var x = Math.floor(u);
      //         var y = Math.floor(v);
      //         var kx = u - x;
      //         var ky = v - y;
      //         for (var c = 0; c < 4; c++) {
      //           pixelsResult.data[(i + j * height) * 4 + c] =
      //                 (colorat(x, y, c, pixelsSource) * (1 - kx) + colorat(x + 1, y, c, pixelsSource) * kx) * (1 - ky) +
      //                 (colorat(x, y + 1, c, pixelsSource) * (1 - kx) + colorat(x + 1, y + 1, c, pixelsSource) * kx) * (ky);
      //         }
      //     }
      // }
      this.ctx.putImageData(pixelsResult, 0, 0);
      // this.ctx.beginPath();
      // this.ctx.arc(waveX, waveY, this.radius, 0, 2 * Math.PI);
      // this.ctx.stroke();

      this.radius += 40;
    }, 50);
  }

  render() {
    const { x, y, w, h } = this.state;
    const eventTrapStyle = {
      top: `${y}px`,
      left: `${x}px`,
      width: `${w}px`,
      height: `${h}px`,
    }

    return (
      <div className="photo-slider">
        <div
          className="photo-slider--event-trap"
          style={eventTrapStyle}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
        >
        </div>
        <canvas
          className="photo-slider--canvas"
          ref={this.canvasRef}
        >
        </canvas>
      </div>
    );
  }
}

