// https://umijs.org/config/
import { defineConfig } from 'umi'
import defaultSettings from './defaultSettings'
import proxy from './proxy'

const { REACT_APP_ENV } = process.env
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              icon: 'smile',
              path: '/user/login',
              component: './user/login',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/labs/list',
            },
            {
              path: '/course',
              name: '课程',
              icon: 'dashboard',
              routes: [
                {
                  path: '/',
                  redirect: '/course/empty',
                },
                {
                  name: '空白页面',
                  icon: 'smile',
                  path: '/course/empty',
                  component: './course/EmptyPage',
                },
              ],
            },
            {
              name: '作业',
              icon: 'highlight',
              path: '/homework',
              routes: [
                {
                  name: '空白页面',
                  icon: 'smile',
                  path: '/homework/empty',
                  component: './homework/EmptyPage',
                },
              ],
            },
            {
              name: '实验',
              icon: 'cluster',
              path: '/labs',
              routes: [
                {
                  path: '/',
                  redirect: '/labs/student/list',
                },
                {
                  name: '实验表格',
                  icon: 'smile',
                  path: '/labs/table',
                  component: './labs/student/LabTable',
                  // authority: ['student'],
                },
                {
                  name: '创建实验',
                  icon: 'smile',
                  path: '/labs/create_lab',
                  component: './labs/teacher/CreateLab',
                  // authority: ['teacher'],
                },
                {
                  name: '实验1',
                  icon: 'smile',
                  path: '/labs/lab',
                  component: './labs/student/Lab',
                  // authority: ['student'],
                },
                {
                  name: '批改实验',
                  icon: 'smile',
                  path: '/labs/mark-lab',
                  component: './labs/teacher/MarkLab',
                  // authority: ['teacher'],
                },
              ],
            },
            {
              name: '对抗系统',
              icon: 'aim',
              path: '/contest',
              authority: ['teacher', 'student'],
              routes: [
                {
                  name: '历史记录',
                  path: '/contest/histroy',
                  component: './contest/student/MatchHistory',
                  authority: ['student'],
                },
                {
                  name: '参加比赛',
                  path: '/contest/match',
                  component: './contest/student/Contest',
                  authority: ['student'],
                },
                {
                  name: '查看成绩',
                  path: '/contest/match-history',
                  component: './contest/teacher/MatchHistory',
                  authority: ['teacher'],
                },
                {
                  name: '创建比赛',
                  path: '/contest/create-contest',
                  component: './contest/teacher/CreateContest',
                  authority: ['teacher'],
                },
                {
                  name: '对抗题库',
                  path: '/contest/questions-bank',
                  component: './contest/teacher/QuestionBank',
                  authority: ['teacher'],
                },
              ],
            },
            {
              name: '资料库',
              icon: 'table',
              path: '/storehouse',
              routes: [
                {
                  path: '/',
                  redirect: '/storehouse/empty',
                },
                {
                  name: '空白页面',
                  icon: 'smile',
                  path: '/storehouse/empty',
                  component: './storehouse/EmptyPage',
                },
              ],
            },
            {
              name: '账户',
              icon: 'user',
              path: '/account',
              routes: [
                {
                  path: '/',
                  redirect: '/account/center',
                },
                {
                  name: '个人中心',
                  icon: 'smile',
                  path: '/account/center',
                  component: './account/center',
                },
                {
                  name: '个人设置',
                  icon: 'smile',
                  path: '/account/settings',
                  component: './account/settings',
                },
              ],
            },
            {
              path: '/announcement',
              name: '公告',
              icon: 'profile',
              routes: [
                {
                  name: '公告列表',
                  path: '/announcement/anc-list',
                  component: './announcement/teacher/AncList',
                  // authority: ['teacher'],
                },
                {
                  name: '公告详情（放此处仅为调试方便）',
                  path: '/announcement/anc-info',
                  component: './announcement/teacher/AncInfo',
                },
              ],
            },
            {
              name: 'result',
              icon: 'CheckCircleOutlined',
              path: '/result',
              routes: [
                {
                  path: '/',
                  redirect: '/result/success',
                },
                {
                  name: 'success',
                  icon: 'smile',
                  path: '/result/success',
                  component: './result/success',
                },
                {
                  name: 'fail',
                  icon: 'smile',
                  path: '/result/fail',
                  component: './result/fail',
                },
              ],
            },
            {
              name: 'exception',
              icon: 'warning',
              path: '/exception',
              routes: [
                {
                  path: '/',
                  redirect: '/exception/403',
                },
                {
                  name: '403',
                  icon: 'smile',
                  path: '/exception/403',
                  component: './exception/403',
                },
                {
                  name: '404',
                  icon: 'smile',
                  path: '/exception/404',
                  component: './exception/404',
                },
                {
                  name: '500',
                  icon: 'smile',
                  path: '/exception/500',
                  component: './exception/500',
                },
              ],
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
})
