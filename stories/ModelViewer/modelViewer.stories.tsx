import React from 'react';
import { storiesOf, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { ModelViewer } from '../../src/ModelViewer';
import RoomRender from '../../src/ModelViewer/room';
import { object, boolean, color, withKnobs } from '@storybook/addon-knobs';
import { Model, Face, Room } from '../../src/HoneybeeModel'

const stories = storiesOf('Model Viewer', module);

const boxModel = require('./model.shoebox.json') as Model
const sampleModel = require('./model.sample.json') as Model


stories.add(
  'A shoebox box model',
  withInfo({
    inline: true,
    text: 'A basic render'
  })(() => {
    if (!boxModel.rooms) {
      boxModel.rooms = []
    }

    return <ModelViewer 
      model={boxModel}
      renderFaces={true}
      renderWireframes={true}
      >
        {
          boxModel.rooms.map(
            room => (
              <RoomRender
                key={room.name}
                room={room}
                renderFaces={true}
                renderWireframes={true}
              />
            )
          )
        }
      </ModelViewer>
    })
);

stories.add(
  'A multi zone model',
  withInfo({
    inline: true,
    text: 'A basic render'
  })(() => {
  const renderFace = boolean('Render Faces', true);
  const renderWireframes = boolean('Render wireframe', true);

  const Wall = color('Wall Color', 'green')
  const Floor = color('Floor Color', 'black')
  const RoofCeiling = color('Roof Color', 'purple')
  const AirWall = color('AirWall Color', 'yellow')
  const Aperture = color('Aperture Color', 'rgba(222,255,96,1)')
  const Door = color('Door Color', 'rgba(222,255,96,1)')
  const Shade = color('Shade Color', 'grey')

  const theme = {
    Wall: Wall,
    Floor: Floor,
    RoofCeiling: RoofCeiling,
    AirWall: AirWall,
    Aperture: Aperture,
    Door: Door,
    Shade: Shade,
  }

  if (!sampleModel.rooms) {
    sampleModel.rooms = []
  }

  return <ModelViewer  
    theme={theme}  
    model={sampleModel}
    renderFaces={renderFace}
    renderWireframes={renderWireframes}
    >
      {
        sampleModel.rooms.map(
          room => (
            <RoomRender
              key={room.name}
              room={room}
              renderFaces={renderFace}
              renderWireframes={renderWireframes}
            />
          )
        )
      }
    </ModelViewer>
  })
);
