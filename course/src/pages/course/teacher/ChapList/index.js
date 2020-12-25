import React, { useCallback, useRef, useState } from 'react'
import {connect} from 'umi'
import { PageContainer } from '@ant-design/pro-layout';
import {Input, Button, Table, Space} from 'antd'
import { useMount } from 'react-use';
import onError from '@/utils/onError';
import ProTable from '@ant-design/pro-table';

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

const LecList = ({
  lecList = [],
  dispatch = () => {}
}) => {
  const [loading, setLoading] = useState(true)
  const ref = useRef()

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

  useMount(() => {
    getLecList(1)
  })
  
  const columns = [
    {
      title: '小节名称',
      dataIndex: 'title',
      render: (text, index) => {
        return <a>{text}</a>
      },
    },
    {
      title: '小节链接',
      dataIndex: 'link',
      render: (text, index) => {
        return <a>{text}</a>
      },
    },
    {
      title: '操作',
      dataIndex: 'opr',
      valueType: 'option',
      render: () => (
        <Space size="middle">
          <a>编辑</a>
          <a>删除</a>
        </Space>
      )
    }
  ]

  return (
    <PageContainer>
      <ProTable
        headerTitle='小节信息'
        // actionRef={ref}
        // search={false}
        dataSource={FormatData(lecList)}
        columns={columns}
      />

    </PageContainer>
  )
}

export default connect(mapStateToProps)(LecList)

// const Bread = () => {
// return (
//     <PageContainer>
//       <div
//         style={{
//           height: '100vh',
//           background: '#fff',
//         }}
//       >
//         <div style={{ width: '100%', textAlign: 'center', paddingTop: '40px' }}>
//           <Table dataSource={data} style={{ width: '80%', margin: 'auto'}}>
//             <Column title='小节名称' dataIndex='title' key='title' />
//             <Column
//             title= '小节链接'
//             key='content'
//             render={dataSource => (
//               <Space size="middle">
//                 <a href={dataSource.content}>{dataSource.content}</a>
//               </Space>
//             )} />
//             <Column
//               title='操作'
//               key='opr'
//               render={() => (
//                 <a href='http://localhost:8000/course/ed-chap'>
//                   编辑
//                 </a>
//               )}
//             />
//           </Table>
//         </div>
//       </div>
//     </PageContainer>
//   )
// }