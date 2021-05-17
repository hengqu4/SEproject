// https://umijs.org/config/
import { defineConfig } from 'umi'
import defaultSettings from './defaultSettings'
import proxy from './proxy' // const { REACT_APP_ENV } = process.env

export const ip =
  process.env.NODE_ENV === 'development' ? process.env.DEV_SERVER_IP : process.env.SERVER_IP
export const port = +process.env.PORT

console.log(`address: ${ip}:${port}`)

export const ip = process.env.DEV_SERVER_IP;
export const port = +process.env.PORT || 8000;
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
              name: '注册结果',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: '注册',
              path: '/user/register',
              component: './user/register',
            },
            {
              name: '登录',
              icon: 'smile',
              path: '/user/login',
              component: './user/Login',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/SecurityLayout',
          routes: [
            {
              path: '/',
              component: '../layouts/BasicLayout',
              Routes: ['src/pages/Authorized'],
              authority: ['principal', 'teacher', 'teachingAssistant', 'student'],
              routes: [
                {
                  path: '/',
                  redirect: '/contest',
                },
                // {
                //   name: '课程模块',
                //   path: '/course',
                //   icon: 'book',
                //   authority: ['teacher', 'teachingAssistant', 'student', 'principal'],
                //   routes: [
                //     {
                //       path: '/',
                //       redirect: '/course/course-list',
                //     },
                //     {
                //       name: '课程列表',
                //       icon: 'smile',
                //       path: '/course/course-list-teacher',
                //       component: './course/course-list-teacher',
                //       authority: ['teacher', 'teachingAssistant'],
                //     },
                //     {
                //       name: '课程列表',
                //       icon: 'smile',
                //       path: '/course/course-list',
                //       component: './course/course-list-principal',
                //       authority: ['principal'],
                //     },
                //     {
                //       name: '课程编辑',
                //       icon: 'smile',
                //       path: '/course/course-edit',
                //       component: './course/course-edit',
                //       authority: ['principal'],
                //     },
                //     {
                //       name: '绑定教师',
                //       icon: 'smile',
                //       path: '/course/course-bind',
                //       component: './course/course-bind',
                //       authority: ['principal'],
                //     },
                //     {
                //       name: '课程信息',
                //       icon: 'smile',
                //       path: '/course/course-info',
                //       component: './course/course-info',
                //       authority: ['student'],
                //     },
                //     {
                //       name: '章节列表',
                //       path: '/course/chap-list',
                //       component: './course/teacher/ChapList',
                //       authority: ['principal', 'teacher', 'teachingAssistant'],
                //     },
                //     {
                //       name: '章节列表',
                //       path: '/course/chap-ls',
                //       component: './course/student/ChapList',
                //       authority: ['student'],
                //     },
                //     {
                //       name: '添加章节信息',
                //       path: '/course/chap-add',
                //       hideInMenu: true,
                //       component: './course/teacher/AddChap',
                //       authority: ['principal', 'teacher', 'teachingAssistant'],
                //     },
                //     {
                //       name: '编辑章节信息',
                //       path: '/course/chap-edit/:courseChapterId',
                //       hideInMenu: true,
                //       component: './course/teacher/EditChap',
                //       authority: ['principal', 'teacher', 'teachingAssistant'],
                //     },
                //   ],
                // },
                // {
                //   path: '/grade',
                //   name: '成绩模块',
                //   icon: 'dashboard',
                //   routes: [
                //     {
                //       path: '/',
                //       redirect: '/grade/analysis',
                //     },
                //     {
                //       name: '成绩看板',
                //       icon: 'smile',
                //       path: '/grade/analysis',
                //       component: './dashboard/teacherDashboard',
                //     },
                //     {
                //       name: '我的成绩',
                //       icon: 'smile',
                //       path: '/grade/mygrade',
                //       component: './dashboard/studentDashboard',
                //     },
                //   ],
                // },
                {
                  name: '作业',
                  icon: 'highlight',
                  path: '/homework',
                  routes: [
                    {
                      name: '作业列表',
                      icon: 'smile',
                      path: '/homework/hw-list',
                      component: './homework/teacher/HwList',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                    {
                      name: '作业列表',
                      icon: 'smile',
                      path: '/homework/hw-ls',
                      component: './homework/student/HwList',
                      authority: ['student'],
                    },
                    {
                      name: '作业详情',
                      path: '/homework/hw-list/hw-info/:homeworkId',
                      hideInMenu: true,
                      component: './homework/teacher/HwInfo',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                    {
                      name: '作业详情',
                      path: '/homework/hw-ls/hw-info/:homeworkId',
                      hideInMenu: true,
                      component: './homework/student/HwInfo',
                      authority: ['student'],
                    },
                    {
                      name: '新建作业',
                      path: '/homework/hw-list/hw-add',
                      hideInMenu: true,
                      component: './homework/teacher/HwAdd',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                    {
                      name: '编辑作业详情',
                      path: '/homework/hw-list/hw-edit/:homeworkId',
                      hideInMenu: true,
                      component: './homework/teacher/HwEdit',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                  ],
                },
                {
                  name: '实验',
                  icon: 'cluster',
                  path: '/labs',
                  authority: ['principal', 'teacher', 'teachingAssistant', 'student'],
                  routes: [
                    {
                      path: '/',
                      redirect: '/labs',
                      authority: ['student'],
                    },
                    {
                      name: '实验列表',
                      path: '/labs/list',
                      component: './labs/student/LabTable',
                      authority: ['principal', 'teacher', 'teachingAssistant', 'student'],
                    },
                    {
                      name: '实验详情',
                      path: '/labs/lab/:courseId/:courseCaseId',
                      hideInMenu: true,
                      component: './labs/student/Lab',
                      authority: ['student'],
                    },
                    {
                      name: '创建实验',
                      path: '/labs/create',
                      hideInMenu: true,
                      component: './labs/teacher/CreateLab',
                      authority: ['principal', 'teacher'],
                    },
                    {
                      name: '实验分析',
                      icon: 'smile',
                      path: '/labs/analyse',
                      component: './labs/teacher/AnalyseLab',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                    {
                      name: '提交列表',
                      icon: 'smile',
                      path: '/labs/pending-list/:courseCaseId',
                      hideInMenu: true,
                      component: './labs/teacher/PendingList',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                    {
                      name: '批改实验',
                      path: '/labs/mark/:courseCaseId/:submissionCaseId',
                      hideInMenu: true,
                      component: './labs/teacher/MarkLab',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                    {
                      name: '所有实验',
                      path: '/labs/all',
                      // hideInMenu: true,
                      component: './labs/teacher/AllLabList',
                      authority: ['principal', 'teacher'],
                    },
                  ],
                },
                {
                  name: '对抗系统',
                  icon: 'aim',
                  path: '/contest',
                  authority: ['principal', 'teacher', 'teachingAssistant', 'student'],
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
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                    {
                      name: '创建比赛',
                      path: '/contest/create-contest',
                      component: './contest/teacher/CreateContest',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                    {
                      name: '对抗题库',
                      path: '/contest/questions-bank',
                      component: './contest/teacher/QuestionBank',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                  ],
                },
                {
                  name: '资料库',
                  icon: 'table',
                  path: '/storehouse',
                  component: './storehouse/Overview',
                  authority: ['teacher'],
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
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                    {
                      name: '公告列表',
                      path: '/announcement/anc-ls',
                      component: './announcement/student/AncList',
                      authority: ['student'],
                    },
                    {
                      name: '公告详情',
                      path: '/announcement/anc-list/anc-info/:announcementId',
                      hideInMenu: true,
                      component: './announcement/teacher/AncInfo',
                      authority: ['principal', 'teacher', 'teachingAssistant', 'student'],
                    },
                    {
                      name: '编辑公告详情',
                      path: '/announcement/anc-list/anc-edit/:announcementId',
                      hideInMenu: true,
                      component: './announcement/teacher/AncEdit',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                    {
                      name: '新建公告',
                      path: '/announcement/anc-list/anc-add',
                      hideInMenu: true,
                      component: './announcement/teacher/AncAdd',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                  ],
                },
                {
                  name: '用户系统',
                  icon: 'user',
                  path: '/account',
                  routes: [
                    {
                      path: '/',
                      redirect: '/account/center',
                    }, // {
                    //   name: 'center',
                    //   icon: 'smile',
                    //   path: '/account/center',
                    //   component: './account/center',
                    // },
                    {
                      name: '账号设置',
                      icon: 'smile',
                      path: '/account/settings',
                      component: './account/settings',
                    },
                    {
                      name: '导入多个账号',
                      icon: 'smile',
                      path: '/account/importmutiaccount',
                      component: './account/InputMutiAccount',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                    {
                      name: '导入一个账号',
                      icon: 'smile',
                      path: '/account/importsingleaccount',
                      component: './account/ImportSingleAccount',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                  ],
                },
                {
                  path: '/file',
                  name: '文件',
                  icon: 'profile',
                  routes: [
                    {
                      name: '文件列表',
                      path: '/file/file-list',
                      component: './file/teacher/FileList',
                      authority: ['principal', 'teacher', 'teachingAssistant'],
                    },
                    {
                      name: '文件列表',
                      path: '/file/file-ls',
                      component: './file/student/FileList',
                      authority: ['student'],
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
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Proxy for integrated test
  proxy: {
    '/api/v1': {
      target: `http://${ip}:${port}`,
      changeOrigin: true,
    },
  },
  mock: false,
  define: {
    SERVER_IP: ip,
    WEBSOCKET_PORT: process.env.WEBSOCKET_PORT,
  },
})
