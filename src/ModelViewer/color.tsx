import React, { createContext } from 'react';

export interface IModelSurfaceTheme {
  AirWall: string;
  Aperture: string;
  Door: string;
  Floor: string;
  RoofCeiling: string;
  Shade: string;
  Wall: string;
}

export const defaultTheme = {
  AirWall: 'yellow',
  Aperture: 'blue',
  Door: 'blue',
  Floor: 'black',
  RoofCeiling: 'purple',
  Shade: 'grey',
  Wall: 'green',
} as IModelSurfaceTheme;

export const ThemeContext = createContext(defaultTheme);
