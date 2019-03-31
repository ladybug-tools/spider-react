import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import { toggle } from '../actions/gbmxl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';


import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const SwitchesGroup = ({surfaceMeshes, surfaceEdges, surfaceOpenings, toggleMeshes, toggleEdges, toggleOpenings}) => (
  <ExpansionPanel>
  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
    <Typography >Toggles</Typography>
  </ExpansionPanelSummary>
  <ExpansionPanelDetails>
  <List>
    <ListItem>
      <FormControlLabel
          control={
          <Switch
              checked={surfaceMeshes}
              onChange={toggleMeshes}
              value="surfaceMeshes"
          />
          }
          label="Surface Meshes"
      />
    </ListItem>
    <ListItem>
    <FormControlLabel
      control={
        <Switch
          checked={surfaceEdges}
          onChange={toggleEdges}
          value="surfaceEdges"
        />
      }
      label="Surface Edges"
    />
    </ListItem>      
    <ListItem>
    <FormControlLabel
      control={
        <Switch
          checked={surfaceOpenings}
          onChange={toggleOpenings}
          value="surfaceOpenings"
        />
      }
      label="Surface Openings"
    />
    </ListItem>          
  </List>
  </ExpansionPanelDetails>
  </ExpansionPanel>
)
const mapStateToProps = state => ({
  surfaceMeshes: state.gbxml.surfaceMeshes,
  surfaceEdges: state.gbxml.surfaceEdges,
  surfaceOpenings: state.gbxml.surfaceOpenings,
});

const mapDispatchToProps = dispatch => ({
  toggleMeshes: e => dispatch(toggle({ name: 'surfaceMeshes', bool: e.target.checked })),
  toggleEdges: e => dispatch(toggle({ name: 'surfaceEdges', bool: e.target.checked })),
  toggleOpenings: e => dispatch(toggle({ name: 'surfaceOpenings', bool: e.target.checked })),

});

export default connect(mapStateToProps, mapDispatchToProps)(SwitchesGroup);