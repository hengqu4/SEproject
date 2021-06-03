import { Tooltip, Tag, Select, Form, Divider } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { connect, SelectLang } from 'umi'
import Avatar from './AvatarDropdown'
import styles from './index.less'
import { useMount } from 'react-use'
import { getAuthority } from '@/utils/authority'
import onError from '@/utils/onError'

const { Option } = Select

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
}


const GlobalHeaderRight = (props) => {
  const { theme, layout } = props
  const { courseList } = props
  const { courseId } = props
  let className = styles.right

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`
  }

  useMount(() => {
    const { dispatch } = props 
    dispatch({
      type: 'Course/getCourseListAndSetFirstCourseInfo',
      onError,
    })
  })

  const handleSelectChange = (v) => {
    const { dispatch } = props
    dispatch({
      type: 'Course/getCurrentCourseInfoStudent',
      payload: {
        courseId: v,
      },
    })
  }

  const getUserAuthority = () => {
    const currentUserAuthority = getAuthority()[0]
    switch (currentUserAuthority) {
      case 'student':
        return "学生"
      case 'principal':
        return "责任教师"
      case 'teacher':
        return "教师"
      case 'teachingAssistant':
        return "助教"
      default:
        return "error"
    }
  }

  return (
    <div className={className}>
      <Form style={{paddingTop: '7.5px'}}>
        <Form.Item
          name="course"
          label="当前课程"
          style={{marginRight:'10px'}}
        >
          <Select
            // defaultValue = { courseName }
            onChange = {(v) => handleSelectChange(v)}
          >
          {
            courseList.map((i) => (
              <Option value={i.courseId} >{i.courseName}</Option>
            ))
          }
          </Select>
        </Form.Item>
      </Form>
      
      <span> 您的身份为: {getUserAuthority()} </span>
      <Divider type="vertical" />
      <Avatar menu />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
    </div>
  )
}

export default connect(({ settings, Course }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  courseList: Course.courseList,
  courseId: Course.currentCourseInfo.courseId,
}))(GlobalHeaderRight)
