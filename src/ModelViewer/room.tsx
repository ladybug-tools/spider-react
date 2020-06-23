import React, { useContext } from 'react';
import { Model, Face, Room } from '../HoneybeeModel';
import { WebCanvasProps, useThree } from 'react-three-fiber';
import {
  Shape,
  Vector2,
  Vector3,
  Triangle,
  Path,
  Quaternion,
  DoubleSide,
  ShapeGeometry,
  MeshBasicMaterial
} from 'three';

import { ThemeContext } from './color';

interface IFaceRenderProperties {
  face: Face;
}

export const boundaryToFaceGeometry = (boundary: number[][]) => {
  const vertices = boundary.map((b) => new Vector3().fromArray(b));

  const triangle = new Triangle(vertices[0], vertices[1], vertices[2]);
  const normal = triangle.getNormal(new Vector3());
  const baseNormal = new Vector3(0, 0, 1);
  const quaternion = new Quaternion().setFromUnitVectors(normal, baseNormal);

  const tempPoints = vertices.map((vertex) => vertex.clone().applyQuaternion(quaternion));

  return new Shape(tempPoints.map((v) => new Vector2(v.x, v.y)));
};

const FaceRender = (props: IFaceRenderProperties) => {
  const { face } = props;
  const theme = useContext(ThemeContext);
  const vertices = face.geometry.boundary.map((b) => new Vector3().fromArray(b));

  if (!face.apertures) {
    face.apertures = [];
  }

  // const triangle = new Triangle(vertices[2], vertices[1], vertices[0]);
  const triangle = new Triangle(vertices[0], vertices[1], vertices[2]);
  const normal = triangle.getNormal(new Vector3());
  const baseNormal = new Vector3(0, 0, 1);
  const quaternion = new Quaternion().setFromUnitVectors(normal, baseNormal);

  const tempPoints = vertices.map((vertex) => vertex.clone().applyQuaternion(quaternion));

  const apertureMeshes = [] as any;

  let holeVertices = [] as Vector3[];

  const holes = face.apertures.map((aperture) => {
    const apertureVertices3 = aperture.geometry.boundary.map((b) => new Vector3().fromArray(b));

    holeVertices = holeVertices.concat(apertureVertices3);

    const tempApertureVertices3 = apertureVertices3.map((vertex) => vertex.clone().applyQuaternion(quaternion));
    const apertureVertices2 = tempApertureVertices3.map((v) => new Vector2(v.x, v.y));
    const hole = new Path(apertureVertices2);

    const apertureShape = new Shape(apertureVertices2);
    const apertureShapeGeometry = new ShapeGeometry(apertureShape);
    apertureShapeGeometry.vertices = apertureVertices3;

    const holeColor = theme[aperture.type];
    const apertureMaterial = new MeshBasicMaterial({
      color: holeColor,
      opacity: 0.5,
      side: DoubleSide,
      transparent: true,
      wireframe: false
    });

    apertureMeshes.push(<mesh key={aperture.name} args={[apertureShapeGeometry, apertureMaterial]} />);

    return {path: hole, vertices: apertureVertices3};
  });

  const shape = new Shape(tempPoints.map((v) => new Vector2(v.x, v.y)));

  shape.holes = holes.map((h) => h.path);

  const shapeGeometry = new ShapeGeometry(shape);

  shapeGeometry.vertices = vertices.concat(holeVertices.reverse());

  const color = theme[face.face_type];

  const material = new MeshBasicMaterial({ color, opacity: 0.7, side: DoubleSide, transparent: true, wireframe: false});

  return (
    <group>
      <mesh args={[shapeGeometry, material]} />
      {apertureMeshes.map((a: any) => a)}
    </group>
    );
};

interface IWireframeRenderProperties {
  face: Face;
}

const WireframeRender = (props: IWireframeRenderProperties) => {
  const { face } = props;
  const lines = [] as any;
  const vertices = face.geometry.boundary.map((b) => new Vector3(b[0], b[1], b[2]));
  const rootPoint = face.geometry.boundary[0];
  vertices.push(new Vector3().fromArray(rootPoint));

  if (!face.apertures) {
    face.apertures = [];
  }

  face.apertures.forEach((a) => {
    const aVertices = a.geometry.boundary.map((b) => new Vector3().fromArray(b));
    aVertices.push(aVertices[0]);

    lines.push(
      <line>
        <geometry attach='geometry' vertices={aVertices} />
        <lineBasicMaterial attach='material' color='black' />
      </line>
    );
  });

  lines.push(
    <line>
      <geometry attach='geometry' vertices={vertices} />
      <lineBasicMaterial attach='material' color='black' />
    </line>
  );

  return (
    <group>
      {lines}
    </group>
  );
};

interface IRoomRenderProperties {
  room: Room;
  renderFaces?: boolean;
  renderWireframes?: boolean;
}

const RoomRender = (props: IRoomRenderProperties) => {
  const { room, renderFaces, renderWireframes } = props;

  return (
    <group>
      { renderFaces && room.faces.map((f) => <FaceRender key={`face-${f.name}`} face={f} />)}
      { renderWireframes && room.faces.map((f) => <WireframeRender key={`line-${f.name}`} face={f} />)}
    </group>
  );
};

export default RoomRender;
