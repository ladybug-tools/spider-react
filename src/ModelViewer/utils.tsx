import { Model, Face, Room } from '../HoneybeeModel';
import {
  Group,
  Triangle,
  Vector3,
  Vector2,
  Quaternion,
  Shape,
  ShapeGeometry,
  Mesh,
  Box3,
  Sphere } from 'three';

export const getBoundingSphere = (rooms: Room[]) => {
  const group = new Group();

  rooms.forEach((room) => {
    room.faces.forEach((face) => {
      const vertices = face.geometry.boundary.map((b) => new Vector3().fromArray(b));
      const triangle = new Triangle(vertices[0], vertices[1], vertices[2]);
      const normal = triangle.getNormal(new Vector3());
      const baseNormal = new Vector3(0, 0, 1);
      const quaternion = new Quaternion().setFromUnitVectors(normal, baseNormal);

      const tempPoints = vertices.map((vertex) => vertex.clone().applyQuaternion(quaternion));

      const shape = new Shape(tempPoints.map((v) => new Vector2(v.x, v.y)));
      const shapeGeometry = new ShapeGeometry(shape);
      shapeGeometry.vertices = vertices;

      const object = new Mesh(shapeGeometry);

      group.add(object);
    });
  });

  const bbox = new Box3().setFromObject(group);

  return bbox.getBoundingSphere(new Sphere());
};


export const cameraPropsFromModel = (model: Model) => {
  const group = new Group();

  const rooms = model.rooms || [];

  rooms.forEach((room) => {
    room.faces.forEach((face) => {
      const vertices = face.geometry.boundary.map((b) => new Vector3().fromArray(b));
      const triangle = new Triangle(vertices[0], vertices[1], vertices[2]);
      const normal = triangle.getNormal(new Vector3());
      const baseNormal = new Vector3(0, 0, 1);
      const quaternion = new Quaternion().setFromUnitVectors(normal, baseNormal);

      const tempPoints = vertices.map((vertex) => vertex.clone().applyQuaternion(quaternion));

      const shape = new Shape(tempPoints.map((v) => new Vector2(v.x, v.y)));
      const shapeGeometry = new ShapeGeometry(shape);
      shapeGeometry.vertices = vertices;

      const object = new Mesh(shapeGeometry);

      group.add(object);
    });
  });

  const bbox = new Box3().setFromObject(group);

  const bSphere = bbox.getBoundingSphere(new Sphere());


    return {
      position: bSphere.center.clone().add(new Vector3(- 1.5 * bSphere.radius, - 1.5 * bSphere.radius, 1.5 * bSphere.radius)),
      near: 0.001 * bSphere.radius,
      far: 10 * bSphere.radius
    }
}
