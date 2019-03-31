import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


export default class FormDialog extends React.Component {

  state = {
    file: null
  };


  handleFileRead = (e) => {
    e.preventDefault()
    this.props.toggleUpload()
  }

  onChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    console.log(file)
    reader.onload = (e) => {
      const data = reader.result;
      const decoder = new TextDecoder()
      this.setState({file: decoder.decode(data)})
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.toggleUpload}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Upload File</DialogTitle>
        <form onSubmit={this.handleFileRead.bind(this)}>
        <DialogContent>
          <DialogContentText>
            Upload a file to the viewer from your local machine or an appropriate file reachable through download (eg: a github gist or raw file)
          </DialogContentText>
          <input type="file" onChange={this.onChange.bind(this)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.toggleUpload} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Upload
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    );
  }
}