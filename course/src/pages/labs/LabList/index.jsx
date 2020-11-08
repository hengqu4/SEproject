import React, { useRef, useState, useEffect } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
} from 'antd';
import { findDOMNode } from 'react-dom';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import styles from './style.less';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

const Info = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const ListContent = ({ data: { owner, createdAt, percent, status } }) => (
  <div className={styles.listContent}>
    {/*<div className={styles.listContentItem}>
      <span>Owner</span>
      <p>{owner}</p>
    </div>*/}
    <div className={styles.listContentItem}>
      <span>开始时间</span>
      <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>结束时间</span>
      <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
    </div>
    {/*<div className={styles.listContentItem}>
      <Progress
        percent={percent}
        status={status}
        strokeWidth={6}
        style={{
          width: 180,
        }}
      />
    </div>*/}
  </div>
);

export const LabList = (props) => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    labsAndLabList: { list },
  } = props;
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(undefined);
  useEffect(() => {
    dispatch({
      type: 'labsAndLabList/fetch',
      payload: {
        count: 5,
      },
    });
  }, [1]);
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: 50,
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (id) => {
    dispatch({
      type: 'labsAndLabList/submit',
      payload: {
        id,
      },
    });
  };

  const editAndDelete = (key, currentItem) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除任务',
        content: '确定删除该任务吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteItem(currentItem.id),
      });
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all">
        <RadioButton value="all">全部</RadioButton>
        <RadioButton value="progress">进行中</RadioButton>
        <RadioButton value="waiting">等待中</RadioButton>
      </RadioGroup>
    </div>
  );

  const MoreBtn = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current);
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();
    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values) => {
    const id = current ? current.id : '';
    setAddBtnblur();
    setDone(true);
    dispatch({
      type: 'labsAndLabList/submit',
      payload: {
        id,
        ...values,
      },
    });
  };

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>

          <Card
            className={styles.listCard}
            bordered={false}
            title="基本列表"
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{
                width: '100%',
                marginBottom: 8,
              }}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined />
              发布实验
            </Button>

            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="complete"
                      onClick={(e) => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      进入实验
                    </a>,
                    <a
                      key="viewScore"
                      onClick={(e) => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      查看成绩
                    </a>,
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.subDescription}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>

      <OperationModal
        done={done}
        current={current}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
export default connect(({ labsAndLabList, loading }) => ({
  labsAndLabList,
  loading: loading.models.labsAndLabList,
}))(LabList);
