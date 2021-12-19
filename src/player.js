import * as THREE from 'three';

export const _createPlayer = () => {
  const _height = 1;

  return {
    _pos: new THREE.Vector3(0, _height, 2.5),
    _vel: new THREE.Vector3(),
    _height,
    _grounded: true,
    _movementVector: new THREE.Vector3()
  };
}

export const _keyListener = (_keys, _player, _camera) => {
  if (_keys["a"] || _keys["d"]) {
    _player._movementVector.setFromMatrixColumn(_camera.matrix, 0);
    _player._pos.addScaledVector(_player._movementVector, (_keys["a"] ? -1 : 1) * 0.05);
  } 
  if (_keys["w"] || _keys["s"]) {
    _player._movementVector.setFromMatrixColumn(_camera.matrix, 0);
    _player._movementVector.crossVectors(_camera.up, _player._movementVector);
    _player._pos.addScaledVector(_player._movementVector, (_keys["s"] ? -1 : 1) * 0.05);
  }
  if (_keys[" "] && _player._grounded) {
    _player._vel.y = 0.1;
  }

  if (!_keys["w"] && !_keys["s"] && !_keys["a"] && !_keys["d"]) {
    _player._vel.x = 0;
    _player._vel.z = 0;
  }
}