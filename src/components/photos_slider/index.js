import React, { Component } from 'react';
import { WindowResize } from '../../utils/window_resize';
import { getWindowHeight, getWindowWidth } from '../../utils/window_size';
import * as THREE from 'three';
import './style.css';
import { SlideAppearance, SLIDE_APPEARANCE_UP, SLIDE_APPEARANCE_NORMAL, SLIDE_APPEARANCE_DOWN } from '../slide_appearance';

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

/**
 * Возвращает информацию о размера и положении текстуры и граничащей области
 * @param {THREE.Texture} texture 
 * @param {number} width ширина окна
 * @param {number} height ширина окна
 */
const getTextureBoundaries = (texture, width, height) => {
  const boundaryAspect = 4 / 3; // соотношение сторон ограничивающей области w / h
  const textureWidth = texture.image.width;
  const textureHeight = texture.image.height;

  // размеры ограничивающей текстуру области
  const bHeight = Math.round(0.78 * height); // константа от балды
  const bWidth = Math.round(bHeight * boundaryAspect);

  const kw = textureWidth / bWidth;
  const kh = textureHeight / bHeight;

  // размеры текстуры
  let w = textureWidth > bWidth ? bWidth : textureWidth;
  let h = textureHeight > bHeight ? bHeight : textureHeight;

  if (kw > kh) {
    h = w * (textureHeight / textureWidth);
  } else {
    w = h * (textureWidth / textureHeight);
  }

  // положение текстуры и ограничивающей области относительно левого верхнего угла экрана
  const x = Math.round((width - w) / 2);
  const y = Math.round((height - h) / 2);
  const bX = Math.round((width - bWidth) / 2);
  const bY = Math.round((height - bHeight) / 2);

  return { x, y, w, h, bWidth, bHeight, bX, bY };
}

export class PhotosSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: getWindowWidth(),
      height: getWindowHeight(),
      currentTexture: -1,
    }

    this.treeContainerRef = React.createRef();
    this.requestID = undefined;
    this.radius = 0;
  }

  async componentDidMount() {
    this.textures = await loadTextures(this.props.images);
    this.coverTexture = await loadTexture(this.props.cover);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.camera = new THREE.PerspectiveCamera();
    this.plane = new THREE.Mesh();

    this.renderer.setClearColor(0xb9c1b9, 0);
    this.plane.position.set(0, 0, 0);
    this.scene.add(this.plane);
    this.camera.lookAt(this.plane.position);

    this.treeContainerRef.current.appendChild(this.renderer.domElement);

    WindowResize.on(this.handleWindowResize);

    this.handleWindowResize();
  }
  componentWillUnmount() {
    WindowResize.off(this.handleWindowResize);
    this.stopWaveEffect(this.requestID)
  }
  componentDidUpdate() {
    const texture = this.getTexture();
    const { width, height, currentTexture } = this.state;
    const { bWidth, bHeight, w, h } = getTextureBoundaries(texture, width, height);
    const borderSize = currentTexture !== -1 ? 80 : 0; // если не ковер то добавляем границу

    this.renderer.setSize(bWidth, bHeight);
    this.plane.material = new THREE.MeshBasicMaterial({map: texture});
    this.plane.geometry = new THREE.PlaneGeometry(w, h, 40, 40);
    this.plane.position.set(0, 0, 0);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(this.plane.position);

    this.camera.aspect = bWidth / bHeight;
    this.camera.fov = 2 * 180 * Math.atan((bHeight + borderSize) / 200) / Math.PI;
    this.camera.near = 1;
    this.camera.far = 100;
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  }

  handleWindowResize = () => {
    const width = getWindowWidth();
    const height = getWindowHeight();
    this.setState({
      width,
      height,
    });
  }

  handleMouseEnter = (e) => {
    e.persist();
    const { width, height } = this.state;
    const { bX, bY, bWidth, bHeight } = getTextureBoundaries(this.getTexture(), width, height);
    this.startWaveEffect(e.clientX - bX - bWidth / 2, -(e.clientY - bY - bHeight / 2));
  }

  handleClick = (e) => {
    e.persist();

    const { currentTexture } = this.state;
    const newCurrentTexture = currentTexture >= this.textures.length - 1
      ? -1
      : currentTexture + 1;

    this.setState({
      currentTexture: newCurrentTexture,
    }, () => {
      const { width, height } = this.state;
      const { bX, bY, bWidth, bHeight } = getTextureBoundaries(this.getTexture(), width, height);
      this.startWaveEffect(e.clientX - bX - bWidth / 2, -(e.clientY - bY - bHeight / 2));
    });
  }

  startWaveEffect(centerX, centerY) {
    this.stopWaveEffect(this.requestID);

    const drawFrame = (ts) => {
      const center = new THREE.Vector2(centerX, centerY);
      const vLength = this.plane.geometry.vertices.length;
      let maxDist = 0;
      for (let i = 0; i < vLength; i++) {
        const v = this.plane.geometry.vertices[i];
        const dist = new THREE.Vector2(v.x, v.y).sub(center).length();
        maxDist = Math.max(dist, maxDist);
        const size = 200;
        const magnitude = 0.25;

        if (dist > this.radius && dist < this.radius + size) {
          v.z = Math.sin((this.radius - dist) / -size) * magnitude + magnitude;
        } else {
          v.z = 0;
        }
      }
      this.plane.geometry.verticesNeedUpdate = true;
      this.renderer.render(this.scene, this.camera);
      
      
      this.radius += 15;

      if (this.radius > maxDist) {
        this.stopWaveEffect(this.requestID);
      } else {
        this.requestID = window.requestAnimationFrame(drawFrame);
      };
    };

    drawFrame(0);
  }

  stopWaveEffect = (requestID) => {
    window.cancelAnimationFrame(requestID);
    this.radius = 0;
    const vLength = this.plane.geometry.vertices.length;
    for (let i = 0; i < vLength; i++) {
      this.plane.geometry.vertices[i].z = 0;
    }
    this.plane.geometry.verticesNeedUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }

  getTexture = () => {
    const { currentTexture } = this.state;
    if (currentTexture === -1) {
      return this.coverTexture;
    } else {
      return this.textures[currentTexture];
    }
  }

  render() {
    const { currentScreen, screenNumber } = this.props;
    const { width, height, currentTexture } = this.state;
    const {bX, bY, bWidth, bHeight} = this.textures && this.coverTexture
      ? getTextureBoundaries(this.getTexture(), width, height)
      : {bX: 0, bY: 0, bWidth: 0, bHeight: 0}
    const eventTrapStyle = {
      top: `${bY}px`,
      left: `${bX}px`,
      width: `${bWidth}px`,
      height: `${bHeight}px`,
    }

    const bigTitleStyle = {
      position: "absolute",
      top: `${bY + Math.round(0.5 * bHeight) - 110}px`,
      left: `${bX - 50}px`,
      pointerEvents: 'none'
    }

    let bigTitleState = SLIDE_APPEARANCE_NORMAL;
    let bigTitleTransition = undefined;
    if (currentTexture === -1) {
      if (currentScreen === screenNumber) {
        bigTitleTransition = "top ease-in 1.2s"
        bigTitleState = SLIDE_APPEARANCE_NORMAL;
      } else {
        if (currentScreen > screenNumber) {
          bigTitleState = SLIDE_APPEARANCE_DOWN;
        } else {
          bigTitleState = SLIDE_APPEARANCE_UP;
        }
      }
    } else {
      bigTitleState = SLIDE_APPEARANCE_UP;
    }
    
    const smallTitleStyle = {
      position: "absolute",
      top: `${bY - 25}px`,
      left: `${bX}px`,
    }

    const smallTitleState = currentTexture === -1
      ? SLIDE_APPEARANCE_UP
      : SLIDE_APPEARANCE_NORMAL;

    return (
      <div className="photo-slider">
        <div
          className="photo-slider--tree-container"
          style={eventTrapStyle}
          onMouseEnter={this.handleMouseEnter}
          onClick={this.handleClick}
          ref={this.treeContainerRef}
        >
        </div>
        <SlideAppearance style={bigTitleStyle} state={bigTitleState} transition={bigTitleTransition}>
          <h2 className="photo-slider--big-title">{this.props.title}</h2>
        </SlideAppearance>
        <SlideAppearance style={smallTitleStyle} state={smallTitleState}>
          <span className="photo-slider--small-title">{this.props.title}</span>
        </SlideAppearance>
      </div>
    );
  }
}

