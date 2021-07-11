/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, SettingDrawer } from '@ant-design/pro-layout'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, connect, history } from 'umi'
import { Result, Button, Spin } from 'antd'
import Authorized from '@/utils/Authorized'
import RightContent from '@/components/GlobalHeader/RightContent'
import { getAuthorityFromRouter } from '@/utils/utils'
import logo from '../assets/logo.svg'
import onError from '@/utils/onError'

const noMatch = (
  <Result
    status={403}
    title='403'
    subTitle='Sorry, you are not authorized to access this page.'
    extra={
      <Button type='primary'>
        <Link to='/user/login'>Go Login</Link>
      </Button>
    }
  />
)
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    }
    return Authorized.check(item.authority, localItem, null)
  })

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} 同济大学软件学院`}
    links={[
      {
        key: 'frontend',
        title: '前端开发',
        href: 'https://github.com/hengqu4/SEproject',
        blankTarget: true,
      },
      {
        key: 'backend',
        title: '后端开发',
        href: 'https://github.com/TJCatFood/backend',
        blankTarget: true,
      },
      {
        key: 'service',
        title: '联系方式',
        href: 'https://sse.tongji.edu.cn/',
        blankTarget: true,
      },
      {
        key: 'ICP',
        title: '沪ICP备2021010257号 ',
        href: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=2021010257',
        blankTarget: true,
      },
    ]}
  />
)

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    currentUser: { id: userId = -1 },
    currentCourse: { courseId = -1 },
    location = {
      pathname: '/',
    },
    route,
  } = props
  /**
   * constructor
   */

  const [contentLoading, setContentLoading] = useState(false)

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      })
    }
  }, [dispatch])
  /**
   * init variables
   */

  useEffect(() => {
    if (userId >= 0) {
      setContentLoading(true)
      dispatch({
        type: 'Course/getAllCourses',
        onError,
        onFinish: () => setContentLoading(false),
      })
    }
  }, [userId, dispatch])

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      })
    }
  } // get children authority

  const authorized = useMemo(
    () =>
      getAuthorityFromRouter(route.routes, location.pathname || '/') || {
        authority: undefined,
      },
    [route, location],
  )
  // const {} = useIntl();

  const contentDom = useMemo(() => {
    if (contentLoading) return <Spin />
    if (courseId < 0) {
      return <Result status='warning' title='你还没有课程' />
    }

    return (
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    )
  }, [contentLoading, courseId, authorized, children])

  return (
    <>
      <ProLayout
        logo={logo}
        onCollapse={handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>
        }}
        breadcrumbRender={(routers = []) => [
          // {
          //   path: '/',
          //   breadcrumbName: '首页',
          // },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0
          // return first ? <Link to={paths.join('/')}>{route.breadcrumbName}</Link> : <span>{route.breadcrumbName}</span>
          return first ? (
            <span to={paths.join('/')}>{route.breadcrumbName}</span>
          ) : (
            <span>{route.breadcrumbName}</span>
          )
        }}
        footerRender={() => defaultFooterDom}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        {contentDom}
      </ProLayout>
      <SettingDrawer
        settings={settings}
        onSettingChange={(config) =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />
    </>
  )
}

export default connect(({ global, settings, Course, user }) => ({
  collapsed: global.collapsed,
  settings,
  currentUser: user.currentUser,
  currentCourse: Course.currentCourseInfo,
}))(BasicLayout)
