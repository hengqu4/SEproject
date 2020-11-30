import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography } from 'antd';
import React, { Component } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {Link} from 'react-router-dom'
import { connect } from 'umi';
import styles from './style.less';
const { Paragraph } = Typography;

class Overview extends Component {
  render() {
    const nullData = [
      {
        router: '/',
        title: `课程文件`,
        name:`file`,
        color:"#00cec9",
        description:
          'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
          'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      },
      {
        router: '/labs/all',
        title: `实验案例`,
        name:`lab`,
        color:"#fab1a0",
        description:
          'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
          'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      },
      {
        router: '/contest/questions-bank',
        title: `对抗题库`,
        name:`contest`,
        color:"#a29bfe",
        description:
          'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
          'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      },
    ];
    return (
      <PageContainer>
        <div className={styles.Overview}>
          <List
            rowKey="id"
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 3,
            }}
            dataSource={nullData}
            renderItem={(item) => {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    cover={
                      <div style={{height:'25px', backgroundColor: item.color}}/>
                    }
                    actions={[<Link to={item.router}>查看</Link>]}
                  >
                    <Card.Meta
                      title={
                        <div style={{textAlign:"center"}}>
                          <Link to={item.router}>{item.title}</Link>
                        </div>
                      }
                      description={
                        <Paragraph
                          className={styles.item}
                          ellipsis={{
                            rows: 3,
                          }}
                        >
                          {item.description}
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
                );
            }}
          />
        </div>
      </PageContainer>
    );
  }
}

export default Overview;
