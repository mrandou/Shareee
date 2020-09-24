import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

export default class DropFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file:null,
    }; 
  }

  onChange = (e) => {
    var newFile = e.file;
    if (newFile.status === "removed")
    {
      this.setState({ file: null });
    }
    else
      this.setState({ file: newFile })
    this.props.picture(this.state.file);
  };

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  render() {
      return (
        <ImgCrop rotate>
          <Upload
            listType="picture"
            customRequest={this.dummyRequest}
            onChange={this.onChange}
          >
            {this.state.file ? null : <Button icon={<UploadOutlined/>}>Upload picture</Button>}
          </Upload>
        </ImgCrop>
      )
    }
}
