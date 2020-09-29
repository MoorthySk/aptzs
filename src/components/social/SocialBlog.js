import React from "react";
import { Card, CardHeader, CardBody, CardTitle, Button } from "reactstrap";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../assets/scss/plugins/extensions/editor.scss";
import axios from "axios";

class SocialBlog extends React.Component {
  uploadImageCallBack = (file) => {
    alert("file inside" + file);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.imgur.com/3/image");
      xhr.setRequestHeader("Authorization", "Client-ID 7e1c3e366d22aa3");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleSubmit(e) {
    e.preventDefault();

    const data = {
      content: this.state.editorState.getCurrentContent().getPlainText(),
    };
    alert(this.state.editorState.getCurrentContent().getPlainText());
    axios.post("/socila/create", { data }).then((res) => {
      console.log(data);
    });

    this.setState({ editorState: EditorState.createEmpty() });
  }
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Blog</CardTitle>
        </CardHeader>
        <CardBody>
          <Editor
            editorState={this.state.editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
            toolbar={{
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
              image: {
                uploadCallback: this.uploadImageCallBack,
                previewImage: true,
                alt: { present: true, mandatory: true },
              },
            }}
          />
          <Button
            color="primary"
            onClick={this.handleSubmit}
            className="btn-large waves-effect waves-light xbutton"
          >
            Post
          </Button>
        </CardBody>
      </Card>
    );
  }
}

export default SocialBlog;
