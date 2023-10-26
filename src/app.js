import * as THREE from 'three';
import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';


function lerp(start, end, t)
{
    return start * ( 1 - t) + end * t;
}

// Mouse coordinate
let targetX = 0;
let targetY = 0;

const normPosition = new THREE.Vector3(0, 0, 0)

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    // Mesh position
    this.offset = new THREE.Vector2(0,0);

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x131313, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 4);
    this.time = 0;


    this.isPlaying = true;

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    this.onMousemove();
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {  value: new THREE.Vector4() },
        uvRate1: { value: new THREE.Vector2(1, 1) },
        uOffset : { value : new THREE.Vector2(0, 0)}
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.plane.position.set(this.offset.x, this.offset.y, 0);
    this.scene.add(this.plane);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  /**
   * Listening to mouse coordinate
   */

  // Updating the mouse coordinate
  onMousemove()
  {
      window.addEventListener('mousemove', (e) => 
      {
          targetX = ((e.clientX / this.width) - 0.5) * 10;
          targetY = ((e.clientY / this.height) - 0.5) * 5.5;

      })
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;

    this.material.uniforms.uTime.value = this.time;
    this.offset.x = lerp(this.offset.x, targetX, 0.1);
    this.offset.y = lerp(this.offset.y, targetY, 0.1);
    this.material.uniforms.uOffset.value.set((targetX - this.offset.x) , -(targetY - this.offset.y));
    this.plane.position.set(targetX , -targetY,);
    console.log(targetY);

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById('container'),
});
