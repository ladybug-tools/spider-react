import React, { useRef, useEffect, useState } from 'react';
import { Model, Face, Room } from '../HoneybeeModel';
import { Canvas, WebCanvasProps, useThree } from 'react-three-fiber';
import { Controls, SimpleControls } from './controls';
import { Group } from 'three';
import { Color } from 'three/src/math/Color';

import RoomRender, { boundaryToFaceGeometry } from './room';
import { cameraPropsFromModel } from './utils';
import { OrthographicCamera, WebGLRenderer } from 'three';
import { ThemeContext, defaultTheme, IModelSurfaceTheme } from './color';

interface ICanvasProperties {
  width?: number;
  height?: number;
}

interface IModelViewerProperties {
  canvas?: ICanvasProperties;
  model?: Model;
  renderFaces?: boolean;
  renderWireframes?: boolean;
  theme?: IModelSurfaceTheme;
  children?: any;
}

export const ModelViewer = (props: IModelViewerProperties) => {
  let { theme, renderFaces, renderWireframes, model, children } = props;

  let [camera, setCamera] = useState({})
  let [rooms, setRooms] = useState(model && model.rooms || [])

  useEffect(() => {
    if (props.model) {
      const cameraProps = cameraPropsFromModel(props.model);
      setCamera(cameraProps);
    }
  }, []);

  if (!theme) {
    theme = defaultTheme;
  }


  // if (model && model.rooms) {
  //   rooms = model.rooms;
  // }

  console.log(rooms)

  const renderer = new WebGLRenderer();

  // renderer.setSize(1000, 1000, true);

  return (
      <Canvas
        // gl={renderer}
        camera={camera}
      >
      <ThemeContext.Provider value={theme}>

        <scene background={new Color(0xcce0ff)} />
        {/* <axesHelper args={[10]} /> */}
        {/* <Controls rooms={model.rooms} /> */}
        <SimpleControls />

        {/* {children} */}
        {
          rooms.map(
            room => (
              <RoomRender
                key={room.name}
                room={room}
                renderFaces={renderFaces}
                renderWireframes={renderWireframes}
              />
            )
          )
        }
      </ThemeContext.Provider>
    </Canvas>
  );
};
