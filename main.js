import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { _createPlayer, _keyListener } from './src/player';
import './style.css';

Physijs.scripts.worker = 'lib/physi.js';
Physijs.scripts.ammo = 'ammo.js';

(async () => {
  const _scene = new THREE.Scene();
  const _camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.75, 1000);
  const _renderer = new THREE.WebGLRenderer({ antialias: true });
  _renderer.setSize(innerWidth, innerHeight);
  _renderer.shadowMap.enabled = true;
  _renderer.shadowMap.type = THREE.BasicShadowMap;
  document.body.append(_renderer.domElement);
  const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
  let locked = false;
  const _keys = {};

  const _light = new THREE.PointLight(0xffffff, 0.5);
  _light.position.set(0, 10, 0);
  _light.castShadow = true;
  _light.shadow.camera.near = 0.75;
  _light.shadow.camera.far = 100;
  _scene.add(_light);
  const _hemiLight = new THREE.HemisphereLight(0xffffff, 0x555555, 1);
  _scene.add(_hemiLight);
  const _ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  _scene.add(_ambientLight);

  const _planeGeo = new THREE.PlaneGeometry(20, 20);
  const _planeMat = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0x666666 });
  const _planeMesh = new THREE.Mesh(_planeGeo, _planeMat);
  _planeMesh.rotation.x = -Math.PI / 2;
  _planeMesh.receiveShadow = true;
  _scene.add(_planeMesh);

  const _sunGeo = new THREE.CircleGeometry(1, 30);
  const _sunMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const _sunMesh = new THREE.Mesh(_sunGeo, _sunMat);
  _sunMesh.position.y = 10;
  _scene.add(_sunMesh);

 

  
  const box = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
  box.position.y = 1;
  box.castShadow = true;
  _scene.add(box);


  const _player = _createPlayer();
  

  _camera.position.z = 5;
  _scene.background = new THREE.Color(0x0099ff);


  const _animate = () => {
    _keyListener(_keys, _player, _camera);
    _player._grounded = _player._pos.y === _player._height;

    _sunMesh.lookAt(_player._pos.x, _player._pos.y, _player._pos.z);
    _camera.position.set(_player._pos.x, _player._pos.y + _player._height, _player._pos.z);

    _renderer.render(_scene, _camera);
    requestAnimationFrame(_animate);
  }



  _animate();

  window.onclick = () => {
    _renderer.domElement.requestPointerLock();
  }

  document.onpointerlockchange = () => {
    locked =  
      (document.pointerLockElement === _renderer.domElement || 
      document.mozPointerLockElement === _renderer.domElement);
  }

  window.onmousemove = (event) => {
    if (locked) {
      const movX = event.movementX;
      const movY = event.movementY;

      const maxPolarAngle = Math.PI;
      const minPolarAngle = 0;

      _euler.setFromQuaternion(_camera.quaternion);
      _euler.y -= movX * 0.002;
      _euler.x -= movY * 0.002;
      _euler.x = Math.max(Math.PI / 2 - maxPolarAngle, Math.min(Math.PI / 2 - minPolarAngle, _euler.x));
      _camera.quaternion.setFromEuler(_euler);
    }
  }

  window.onresize = () => {
    _camera.aspect = innerWidth / innerHeight;
    _camera.updateProjectionMatrix();
    _renderer.setSize(innerWidth, innerHeight);
  }

  window.onkeydown = (event) => {
    const key = event.key || event.which;
    _keys[key] = true;
  }

  window.onkeyup = (event) => {
    const key = event.key || event.which;
    _keys[key] = false;
  }
})();