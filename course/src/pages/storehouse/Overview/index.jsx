import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography } from 'antd';
import React, { Component } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import styles from './style.less';

const { Paragraph } = Typography;

const listDate = {};
listDate.pushlistData.push(
  {
    href: 'https://ant.design',
    title: `课程文件`,
    name:`file`,
    color:"#ffeaa7",
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  },
  {
    href: 'https://ant.design',
    title: `对抗题库`,
    name:`contest`,
    color:"#a29bfe",
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  },
  {
    href: 'https://ant.design',
    title: `实验案例`,
    name:`lab`,
    color:"#fab1a0",
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  },
);

class Overview extends Component {
  render() {
    const {
      storehouseAndOverview: { list },
      loading,
    } = this.props;
    return (
      <PageContainer>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={listData}
            renderItem={(item) => {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[<a key="option">查看</a>]}
                  >
                    <Card.Meta
                      title={<a>{item.title}</a>}
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
{/*
export default connect(({storehouseAndOverview, loading }) => ({
  storehouseAndOverview,
  loading: loading.models.storehouseAndOverview,
}))(Overview);
*/}
export default Overview;