import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Tooltip from './components/Tooltip';
import BottomNav from './components/BottomNav';
import Renderer from './components/Renderer';
// import Drawer from './components/Drawer'
import Drawer from './components/DrawerFunction'
import AppBar from './components/AppBar'
import SwitchGroup from './components/SwitchGroup'
import UploadDialog from './components/UploadDialog';

import CssBaseline from '@material-ui/core/CssBaseline';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// import theme from './ui/theme/index';
// import './styles.css'


const store = configureStore();

class App extends Component {
  state = {
    drawer: false,
    upload: false,
  }

  toggleDrawer() {
    this.setState({drawer: !this.state.drawer})
  }

  toggleUpload() {
    this.setState({upload: !this.state.upload})
  }

  render() {
    return (
      <Provider store={store}>
      {/* <MuiThemeProvider theme={theme}> */}
        <CssBaseline />
        <AppBar toggleDrawer={this.toggleDrawer.bind(this)}/>
        <Drawer open={this.state.drawer} toggleDrawer={this.toggleDrawer.bind(this)}/>
        {/* <SwitchGroup /> */}
        <Renderer />
        {/* <Tooltip /> */}
        <BottomNav toggleUpload={this.toggleUpload.bind(this)}/>
        {/* <Drawer /> */}
        {/* </MuiThemeProvider> */}
        <UploadDialog open={this.state.upload} toggleUpload={this.toggleUpload.bind(this)}/>
      </Provider>
    );
  }
}

export default App;
