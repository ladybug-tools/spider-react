/* tslint:disable:interface-name */
import React, { useRef, useEffect, useState } from 'react';
import { ReactThreeFiber, extend, useThree, useRender } from 'react-three-fiber';
import { getBoundingSphere } from './utils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { Room } from '../HoneybeeModel';
import { Vector3 } from 'three';

extend({ OrbitControls });
extend({ FlyControls });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
      flyControls: ReactThreeFiber.Object3DNode<FlyControls, typeof FlyControls>;

    }
  }
}

interface IControlsProperties {
  rooms: Room[];
}

export const Controls = (props: IControlsProperties) => {
  const { rooms } = props;
  const orbitRef = useRef<OrbitControls>(null);
  // const orbitRef = useRef<FlyControls>(null);

  const { camera, gl } = useThree();

  useEffect(() => {
    const sphere = getBoundingSphere(rooms);
    const center = sphere.center;
    const radius = sphere.radius;

    // orbitRef.target.copy(center); // needed because model may be far from origin
    // orbitRef.maxDistance = 5 * radius;

    camera.position.copy(center.clone().add(new Vector3(- 1.5 * radius, - 1.5 * radius, 1.5 * radius)));
    camera.near = 0.001 * radius; // 2 * camera.position.length();
    camera.far = 10 * radius; // 2 * camera.position.length();
    camera.updateProjectionMatrix();
  });

  useRender(() => {
    if (orbitRef && orbitRef.current) {
      orbitRef.current.update();
    }
  }, false);

  return (
    <orbitControls
    // <flyControls
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  );
};

export const SimpleControls = () => {
  const orbitRef = useRef<OrbitControls>(null);
  // const orbitRef = useRef<FlyControls>(null);

  const { camera, gl } = useThree();

  // useEffect(() => {
  //   const sphere = getBoundingSphere(rooms)
  //   const center = sphere.center;
  //   const radius = sphere.radius;

  //   // orbitRef.target.copy(center); // needed because model may be far from origin
  //   // orbitRef.maxDistance = 5 * radius;

  //   camera.position.copy(center.clone().add(new Vector3(- 1.5 * radius, - 1.5 * radius, 1.5 * radius)));
  //   camera.near = 0.001 * radius; //2 * camera.position.length();
  //   camera.far = 10 * radius; //2 * camera.position.length();
  //   camera.updateProjectionMatrix();
  // })

  useRender(() => {
    if (orbitRef && orbitRef.current) {
      orbitRef.current.update();
    }
  }, false);

  return (
    <orbitControls
      // <flyControls
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  );
};
