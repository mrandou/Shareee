import React from 'react';
import axios from 'axios';
import { Avatar, Card, Row, Col, Modal, PageHeader, Button,
   Form, Input, Skeleton, Image } from 'antd';
import { MessageOutlined, HeartOutlined, ShareAltOutlined} from '@ant-design/icons';
import headerStyle from '../Style/MessageStyle';
import defaultPic from '../Assets/defaultpic.jpg'
import DropFile from './DropFile';
import "../Style/Page.css"
// import icon from '../Assets/icon.png'

export default class messages extends React.Component {
 constructor(props) {
    super(props);
    this.state = {
      data: [],
      picture: "",
      currentItem: "",
      userLikes: [],
      messageModalVisible: false,
    }; 
  }

  componentDidMount() {
    var apiID = "5f4530991e86270002101fa5";
    axios.get('https://dummyapi.io/data/api/post?limit=10',  {
      headers: {
        "app-id": apiID
      }})
      .then(res => {
        const data = res.data;
        this.setState({ data });
      })
    }

    setMessageModalVisible(messageModalVisible) {
      this.setState({ messageModalVisible });
    }
    

    newMessage = (message) => {
      var newData = [
        {
          "id" : this.state.data.data.length,
          "owner": {"firstName": message.post.user.firstname, "lastName": message.post.user.lastname},
          "text": message.post.message,
          "image": !this.state.picture ? defaultPic : this.state.picture,
          "likes" : 0,
        }
      ]
      this.state.data.data.push(newData[0])
      this.setMessageModalVisible(false);
    }

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    getPic = async filePic => {
      if (filePic)
      {
        const picture = await this.getBase64(filePic.originFileObj)
        this.setState({ picture })
      }
      else
        this.setState ({ picture: null })
    }

    messageForm = () => {

      // const layout = {
      //   labelCol: { span: 8 },
      //   wrapperCol: { span: 16 },
      // };
      
      const validateMessages = {
        required: 'This field is required!',
        // types: {
        //   email: 'Not validate email!',
        // },
      };

      return (
          <Form name="nest-messages" onFinish={this.newMessage} validateMessages={validateMessages}>
            <Form.Item name={['post', 'user', 'firstname']} label="First name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['post', 'user', 'lastname']} label="Last name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['post', 'message']} label="Message">
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <DropFile picture={this.getPic} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
      )
    }

    createNewMessage = () => {
      return (
        <Modal
          visible={this.state.messageModalVisible}
          onOk={() => this.setMessageModalVisible(false)}
          onCancel={() => this.setMessageModalVisible(false)}
          footer={null}
          >
            {this.messageForm()}
          </Modal>
      )
    }

    alreadyLiked = (id) => {
      const idLikes = this.state.userLikes;
      for (var i = 0; i <= idLikes.length; i++)
        if (id === idLikes[i])
          return i;
      return -1;
    }

    like = (item, index) => {
      let newData = this.state.data;
      var i;
      if ((i = this.alreadyLiked(item.id)) !== -1)
      {
          this.state.userLikes.splice(i, 1, "");      //Post API for update userLikes
          newData.data[index].likes -= 1;
          this.setState({ data: newData });           //Post API for update data
          return ;
      }
      newData.data[index].likes += 1;
      this.state.userLikes.push(item.id);             //Post API for update userLikes
      this.setState({ data: newData });               //Post API for update data
    }

    loadingCards = () => {
      var emptyCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      return (
        emptyCards.map((key) => 
          <Col key={key} xs={{ span: 24 }} md={{ span: 10 }} lg={{ span: 8 }}>
            <Card
              style={{ maxWidth: 330, margin: "0 auto" }}
              cover={
                <div style={{ width: "auto", height: 200, overflow: "hidden" }} >
                    <img 
                      alt="default"
                      src={defaultPic}
                      style={{ maxWidth:"330px", cursor:"wait", opacity:"30%" }}
                    />
                </div>
              }
            >
              <Skeleton active avatar />
            </Card>
          </Col>
        )
      )
    }
    
    elemCard = (item, index) => {
      return (
        <Col key={item.id} xs={{ span: 24 }} md={{ span: 10 }} lg={{ span: 8 }}>
         {/* <div style={{ height:"20px", border:"1px solid #f0f0f0" }}/> */}
          <Card
            style={{ maxWidth: 330, margin: "0 auto" }}
            actions={
              [
                <div onClick={() => this.like(item, index)} style={ this.alreadyLiked(item.id) !== -1 ? { color: "#1e93ff" } : null}>{item.likes} <HeartOutlined/></div>,
                <ShareAltOutlined />
              ]
            }
            cover={
              <div style={{ width: "auto", height: 200, overflow: "hidden" }}>
                  <Image 
                    alt="post"
                    src={item.image}
                    style={{ maxWidth:"330px", cursor:"zoom-in" }}
                  />
              </div>
            }
          >
            <Card.Meta
              avatar={
                item.owner.picture ?
                <Avatar src={item.owner.picture} /> : 
                <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{item.owner.firstName[0]}</Avatar>
              }
              title={<p>{item.owner.firstName} {item.owner.lastName}</p>}
              description={item.text}
            />
          </Card>
        </Col>
      )
    }
    
    render() {
      const info = this.state.data;
      return (
        <div>
          <PageHeader
            style={headerStyle}
            title="Shareee"
            // subTitle="your life"
            extra={[
              <Button key="1" type="text" size="middle" icon={<MessageOutlined/>} onClick={() => this.setMessageModalVisible(true)}/>
            ]}
          />
          <this.createNewMessage/>
          <Row justify="center" align="space-between" gutter={[0, 16]} className="page">
            {
              info.data ?
                info.data.map((item, index) =>
                this.elemCard(item, index),
                )
              : <this.loadingCards/>
            }
          </Row>
        </div>
      )
  }
}
