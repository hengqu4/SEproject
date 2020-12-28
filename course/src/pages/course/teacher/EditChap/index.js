import React, {useState} from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Input, Button, } from 'antd';
import { connect } from 'umi'
import { useMount } from 'react-use';
import {Link} from 'react-router-dom'
import onError from '@/utils/onError';
import { values } from 'lodash';
import { string } from 'prop-types';
import { value } from 'numeral';

const mapStateToProps = ({ lecture }) => ({
  lecList: lecture.lecList,
})

const FormatData = (lecList) => {
  const formattedLecList = []
  for (let i = 0; i < lecList.length; i++) {
    formattedLecList.push({
      key: lecList[i].courseChapterId,
      title: lecList[i].courseChapterTitle,
      link: lecList[i].courseChapterMoocLink,
    })
  }
  return formattedLecList
}

const LecInfo = ({ lecList = [], dispatch = () => {} }) => {
  const [lecInfo, setLecInfo] = useState({courseId: 0, courseChapterTitle: "string", courseChapterMoocLink: "string"})
  const [loading, setLoading] = useState(true)

  //获得当前小节信息列表
  const getLecList = (courseId) => {
    dispatch({
      type: 'lecture/fetchLecList',
      payload: {
        courseId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  //新建某小节信息
  const addLecInfo = (courseId) => {
    console.log(lecInfo)
    dispatch({
      type: 'lecture/addLecInfo',
      payload: {
        courseId, lecInfo,
      },
      onFinish: setLoading.bind(this, false),
    })
  }

  useMount(() => {
    getLecList(1)
  })

  

  const onChange = (value) => {
    console.log(value)
    lecInfo.courseChapterTitle = value
  }

  const handleLecInfo = (values) => {
    var id = 1;
    const list = FormatData(lecList);
    for (let i = 0; i < lecList.length; i++) {
      if(id <= list[i].key)
        id = list[i].key + 1
    }
    lecInfo.courseChapterId = id
    lecInfo.courseChapterTitle = "bhjhi"
    lecInfo.courseChapterMoocLink = "http://Gzhxjcj"
    console.log(lecInfo.courseChapterTitle)
    console.log(list)
    addLecInfo(1);
  }

  return (
    <PageContainer>
      <div
        style={{
          height: '100vh',
          background: '#fff',
        }}
      >
      <div style={{ paddingTop: '40px', margin:'40px'}}>
        <Form
        name="basic"
        initialValues={{ remember: true }}
        >
          <Form.Item
            label="小节名称"
            name="title"
            style={{width: '80%'}}
            rules={[{ required: true, message: '请输入名称！' }]}
          >
            <Input />
                {/* <Input placeholder={data.title}/> */}
          </Form.Item>
          <Form.Item
            label="小节链接"
            name="link"
            style={{width: '80%'}}
            rules={[{ required: true, message: '请输入链接！' }]}
          >
            <Input />
                {/* <Input placeholder={data.link}/> */}
          </Form.Item>
          {/* </Form><Form.Item {...tailLayout}> */}
          <Form.Item>
            <Button>
              <Link to='/course/chap-list'>
                取消
              </Link>
            </Button>&nbsp;&nbsp;&nbsp;
            <Button 
              type="primary"
              htmlType="submit"
              onClick={() => {
                handleLecInfo()
              }}
            >
              <Link to='/course/chap-list'>
                保存
              </Link>
            </Button>
          </Form.Item>
        </Form>
        </div>
      </div>
    </PageContainer>
  )
}

export default connect(mapStateToProps)(LecInfo)



const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};