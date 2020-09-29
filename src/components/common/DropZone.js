import React, { Component, createRef } from "react";
import Dropzone from "react-dropzone";
import { Card, CardHeader, CardBody, CardTitle, Button } from "reactstrap";
import "../../assets/scss/plugins/extensions/dropzone.scss";
import { CloudUpload } from "@material-ui/icons";
const dropzoneRef = createRef();
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
    };
  }

  openDialog = () => {
    // Note that the ref is set async,
    // so it might be null at some point

    console.log("dropzoneRef" + dropzoneRef);
    this.props.onDrop(dropzoneRef);
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };
  onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
    this.setState({
      files: acceptedFiles,
    });
    this.props.onDrop(acceptedFiles);
  };
  render() {
    const files = this.state.files;
    return (
      <div className="actions cursor-pointer">
        <Dropzone onDrop={this.onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <CloudUpload color="primary" /> Upload
            </div>
          )}
        </Dropzone>

        <aside>
          <ul>
            {this.state.files.map((file) => (
              <li key={file.path}>
                {file.path} -{file.size} bytes
              </li>
            ))}
          </ul>
        </aside>
      </div>
    );
  }
}

export default App;
