import React from 'react';
import axios from 'axios';
import { Avatar, Card, Row, Col } from 'antd';

export default class messages extends React.Component {
 constructor(props) {
    super(props);
    this.state = {
      data: [],
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
    
    elemCard = (item) => {
      return (
        <Col span={4} offset={1} style={{ marginTop: "30px" }}>
         <div style={{width:"300px", height:"20px", border:"1px solid #f0f0f0" }}/>
          <Card
            style={{width: 300}}
            cover={
              <div style={{ width: 300, height: 200, overflow: "hidden" }}>
                  <img 
                    alt="post"
                    src={item.image}
                    style={{ maxWidth:"300px" }}
                  />
              </div>
            }
          >
            <Card.Meta
              avatar={<Avatar src={item.owner.picture} />}
              title={<p>{item.owner.firstName} {item.owner.lastName}</p>}
              description={item.text}
            />
          </Card>
        </Col>
      )
    }
    
    render() {
      const info = this.state.data;
      console.log(info);
    return (
      <Row justify="center" align="top">
        {
          info.data ?
            info.data.map((item) =>
             this.elemCard(item)
            )
          : null
        }
      </Row>
    )
  }
}
