import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Link, SelectLang, useIntl, connect } from 'umi'
import React from 'react'
import logo from '../assets/logo.svg'
import styles from './UserLayout.less'

const UserLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props
  const { routes = [] } = route
  const {
    children,
    location = {
      pathname: '',
    },
  } = props
  // const {} = useIntl();
  const { breadcrumb } = getMenuData(routes)
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  })
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to='/'>
                <img alt='logo' className={styles.logo} src={logo} />
                <span className={styles.title}>软件工程经济学虚拟仿真实验平台</span>
              </Link>
            </div>
            <div className={styles.desc}>软件项目与过程管理</div>
          </div>
          {children}
        </div>
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
      </div>
    </HelmetProvider>
  )
}

export default connect(({ settings }) => ({ ...settings }))(UserLayout)
