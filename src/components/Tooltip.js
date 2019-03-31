import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { increment } from '../actions/gbmxl';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit * 2,
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
});

function SimpleTooltips(props) {
  const { classes } = props;
  return (
    <div>
      <Tooltip title="Add" aria-label="Add" onClick={() => {
        props.dispatch(increment());
      }}>
        <Fab color="primary" className={classes.absolute}>
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
}

SimpleTooltips.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect()(withStyles(styles)(SimpleTooltips));