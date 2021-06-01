import React, { useRef, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { InputNumber, Button, Divider, Form, Row, Col, notification } from 'antd'
import { connect, useParams } from 'umi'
import { useMount } from 'react-use'
import onError from '@/utils/onError'
import ProTable from '@ant-design/pro-table'

const PORT = 8000

const mapStateToProps = ({ homework, Course, user }) => ({
  hwFileList: homework.hwFileList,
  courseId: Course.currentCourseInfo.courseId,
  grade: homework.grade,
})

const FormatData = (hwFileList) => {
  const formattedHwFileList = []
  for (let i = 0; i < hwFileList.length; i++) {
    formattedHwFileList.push({
      key: hwFileList[i].fileHomeworkId,
      title: hwFileList[i].fileDisplayName,
      name: hwFileList[i].fileUploader,
      grade: hwFileList[i].homeworkScore,
    })
  }
  return formattedHwFileList
}

const HwGrade = ({ hwFileList = [], grade = grade, dispatch = () => { }, courseId = courseId }) => {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [homeworkId, setHomeworkId] = useState(params.homeworkId)

  // 获得当前作业列表
  const getHwFileList = () => {
    dispatch({
      type: 'homework/fetchHwFileList',
      payload: {
        courseId, homeworkId,
      },
      onError,
      onFinish: setLoading.bind(this, false),
    })
  }

  const handleScoreChange = (value, studentId) => {
    const data = {
      homeworkScore: value,
      homeworkIsGradeAvailable: true,
      homeworkTeachersComment: "", 
    }
    dispatch({
      type: 'homework/addGrade',
      payload: {
        courseId, homeworkId, studentId, data,
      },
      onError,
      onSuccess: () => {
        notification.success({
          message: '修改学生成绩成功'
        })
        getHwFileList()
      },
      onFinish: setLoading.bind(this, false),
    })
  }

  useMount(() => {
    getHwFileList()
  })

  const columns = [
    {
      title: '学生名称',
      dataIndex: 'name',
      width: '15%',
      render: (text, index) => {
        return <div>{text}</div>
      },
    },
    {
      title: '作业文件',
      dataIndex: 'title',
      width: '55%',
      render: (_, record) => {
        var addr=`http://localhost:${PORT}/api/v1/lecture/course-homework/${courseId}/homework/${homeworkId}/file/${record.key}`
        return <a href={addr}
        >{record.title}</a>
      },
    },
    {
      title: '分数',
      dataIndex: 'grade',
      width: '15%',
      render: (val) => {
        return <div>{val}</div>
      },
    },
    {
      title: '评分',
      dataIndex: 'opr',
      width: '15%',
      render: (_, record) => (
        <Form
          onFinish={(val) => handleScoreChange(val.grade, record.name)}
        >
          <Row
            style={{
              marginTop: '35px'
            }}
          >
            <Col>
              <Form.Item
                name="grade"
                rules={[{
                  required: true,
                  message: '请输入成绩'
                }]}
              >
              <InputNumber
                min={0} 
                max={100}
              />
              </Form.Item>
            </Col>
            <Col>
              <Divider type="vertical" />
            </Col>
            <Col>
              <Form.Item>
                <Button
                  type="link"
                  htmlType="submit"
                >
                  提交
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
  ]

  return (
    <PageContainer>
      <ProTable
        headerTitle='作业文件列表'
        // actionRef={ref}
        search={false}
        dataSource={FormatData(hwFileList)}
        columns={columns}
      />
    </PageContainer>
  )
}

export default connect(mapStateToProps)(HwGrade)
