import React from 'react';
import * as THREE from 'three';
import OrbitControlsDef from 'three-orbit-controls'
import { connect } from 'react-redux';
import { gbXMLParser, threeGenerator } from '@ladybug-tools/spider-core'
import axios from 'axios';
import { updateString } from '../actions/gbmxl'

class Scene extends React.Component {
  constructor(props) {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
    this.defaultgbXML = 'https://raw.githubusercontent.com/ladybug-tools/spider/5b4575f2d1905e1aedf282603fc4155bb679ba18/read-gbxml/data-files/sam-live2.xml'
    this.state = {
      sceneRotation: 1,
      cameraHelper: null,
      width: window.innerWidth,
      height: window.innerHeight,
      surfaceMeshes: new THREE.Group( {name: 'surfaceMeshes'} ),
      surfaceEdges: new THREE.Group( {name: 'surfaceEdges'} ),
      surfaceOpenings: new THREE.Group( {name: 'surfaceOpenings'} ),
  
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(prevProps)
    if (prevProps.specificProperty !== this.props.specificProperty) {
        // Do whatever you want
    }
  }

  async loadDefaultFile () {
    const response = await axios.get(this.defaultgbXML);
    const gbxmlString = response.data;
    this.props.dispatch(updateString(gbxmlString))
    this.gbxmlToThree()
  }

  gbxmlToThree () {
    const gbxmlString = this.props.gbxml.string;
    const gbXMLJson = gbXMLParser.parseFileXML(gbxmlString);

    this.state.surfaceMeshes.add( ...threeGenerator.getSurfaceMeshes(gbXMLJson) );
		this.state.surfaceEdges.add( ...threeGenerator.getSurfaceEdges(this.state.surfaceMeshes) );
		this.state.surfaceOpenings.add( ...threeGenerator.getOpenings(gbXMLJson) );
    this.zoomObjectBoundingSphere(this.state.surfaceEdges, this.state.surfaceMeshes)
  }

  zoomObjectBoundingSphere = (obj, surfaceMeshes) => {
    const bbox = new THREE.Box3().setFromObject(obj);
  
    const sphere = bbox.getBoundingSphere(new THREE.Sphere());
    const { center, radius } = sphere;
  
    this.controls.reset();
    this.controls.target.copy(center);
    this.controls.maxDistance = 5 * radius;
  
    this.camera.position.copy(center.clone().add(new THREE.Vector3(1.0 * radius, -1.0 * radius, 1.0 * radius)));
    this.camera.far = 10 * radius; // 2 * camera.position.length();
    this.camera.updateProjectionMatrix();
  
    this.lightDirectional.position.copy(center.clone().add(new THREE.Vector3(-1.5 * radius, -1.5 * radius, 1.5 * radius)));
    this.lightDirectional.shadow.camera.scale.set(0.2 * radius, 0.2 * radius, 0.01 * radius);
  
    if (!this.axesHelper) {
      this.axesHelper = new THREE.AxesHelper(1);
      this.axesHelper.name = 'axesHelper';
      this.scene.add(this.axesHelper);
    }
  
    this.axesHelper.scale.set(radius, radius, radius);
    this.axesHelper.position.copy(center);
  
    this.lightDirectional.target = this.axesHelper;
    surfaceMeshes.userData.center = center;
    surfaceMeshes.userData.radius = radius;
  };

  async componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      40,
      width / height,
      0.1,
      1000
    )
    camera.up.set( 0, 0, 1 );

    const renderer = new THREE.WebGLRenderer({ alpha: 1, antialias: true })

    const lightAmbient = new THREE.AmbientLight( 0x444444 );
    scene.add(lightAmbient)

    const lightDirectional = new THREE.DirectionalLight( 0xffffff, 1);
    lightDirectional.shadow.mapSize.width = 2048;  // default 512
    lightDirectional.shadow.mapSize.height = 2048;
    lightDirectional.castShadow = true;
    scene.add(lightDirectional);

    const lightPoint = new THREE.PointLight( 0xffffff, 0.5 );
    // lightPoint.position = new THREE.Vector3( 0, 0, 1 ); TODO: Error about lightPoint not having position property
    camera.add(lightPoint)

    const axesHelper = THREE.AxesHelper( 1 );
    scene.add(axesHelper)

    camera.position.z = 4
    scene.add(camera)

    renderer.setSize( window.innerWidth,  window.innerHeight)
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    
    const OrbitControls = OrbitControlsDef( THREE )
    const controls = new OrbitControls( camera, renderer.domElement )
    controls.autoRotate = false


    this.controls = controls
    this.lightDirectional = lightDirectional
    this.scene = scene
    this.camera = camera
    this.renderer = renderer

    // Load the default GBXML file
    await this.loadDefaultFile();
    console.log(this.state.surfaceMeshes.children[0].userData);

    this.controls.update()
    this.mount.appendChild(this.renderer.domElement)
    this.start()
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  animate() {
    // this.gbxmlToThree()
    this.scene.remove(this.state.surfaceMeshes)
    this.scene.remove(this.state.surfaceEdges)
    this.scene.remove(this.state.surfaceOpenings)


    if (this.props.gbxml.surfaceMeshes) {
      this.scene.add(this.state.surfaceMeshes)
    }
    if(this.props.gbxml.surfaceEdges) {
      this.scene.add(this.state.surfaceEdges)
    }
    if (this.props.gbxml.surfaceOpenings) {
      this.scene.add(this.state.surfaceOpenings)
    }

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div
        // style={{ width: `${window.innerWidth-200}px`, height: `${window.innerHeight-200}px`, "z-index": 3 }}
        style={{position:'relative', left:0, top:0,width: `${window.innerWidth-200}px`, height: `${window.innerHeight-200}px`, zIndex: 0}}
        ref={(mount) => { this.mount = mount }}
        status={this.props.gbxml}
      />
    )
  }
}

const mapStateToProps = (state) => {
  console.log('STATE')
  return {
    gbxml: state.gbxml
  };
};


export default connect(mapStateToProps)(Scene);