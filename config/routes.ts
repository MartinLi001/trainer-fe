const taskDetailsPageRoutes = [
  {
    path: './people/:type/:batchId/:batchName',
    component: './People/AddPeople/index',
  },
  {
    path: './CodingMock/details',
    component: './Task/mock/details/index',
  },
  { path: './:type/:taskId', component: './Task/index' },
  { path: './Mock/Short/addQuestion', component: './Task/ShortMock/addQuestion/index' },
  {
    path: './ShortAnswerMock/:taskId/group/:groupId',
    component: './Task/ShortMock/GroupDetail/index',
  },
  {
    path: './kpi/:batchId/:traineeId',
    name: 'kpi',
    component: './Kpi/detail',
  },
];
export default [
  // {
  //   path: '/demo',
  //   name: 'demo',
  //   hideInMenu: true,
  //   component: './Admin',
  //   // hideInMenu: true,
  // },
  {
    path: '/summary',
    name: 'summary',
    icon: 'icon-dashboard-line',
    component: './HomePage/index',
  },
  {
    path: '/coding',
    name: 'coding',
    icon: 'icon-a-Iconscode',
    access: 'checkAccessFun',
    accessKey: 'trainingTrainerCoderPuzzleManagement',
    routes: [
      { path: '/coding', component: './CodingQuestion/index' },
      { path: '/coding/coder', component: './CoderSetting' },
      { path: '/coding/add/:id', component: './CodingQuestion/AddQuestion/pageAddNew' },
      { path: '/coding/edit/:id', component: './CodingQuestion/AddQuestion/index' }, // 无用
      { path: '/coding/:id', component: './CodingQuestion/QuestionDetail/index' },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/question',
    name: 'question',

    icon: 'icon-question-answer-line',
    access: 'checkAccessFun',
    accessKey: 'trainingTrainerQuestionManagement',
    routes: [
      { path: '/question', component: './Question/index' },
      { path: '/question/questionadd/:id', component: './AddQuestion/index' },
      { path: '/question/:id', component: './QuestionDetail/index' },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/myBatch',
    name: 'myBatch',
    icon: 'HeartOutlined',
    access: 'checkAccessFun',
    accessKey: 'trainingTrainerBatchManagement',
    hideChildrenInMenu: true,
    routes: [
      {
        path: '/myBatch',
        component: './MyBatch',
        exact: true,
      },
      ...taskDetailsPageRoutes,
      { component: './404' },
    ],
  },
  {
    path: '/Category',
    name: 'allBatch',
    icon: 'icon-computer-line',
    access: 'checkAccessFun',
    accessKey: 'trainingTrainerBatchManagement',
    routes: [
      { path: '/Category', component: './AllBatch/Category' },
      {
        path: '/Category/Batches',
        routes: [
          {
            path: '/Category/Batches',
            component: './AllBatch/Batch',
          },
          { path: '/Category/Batches/tasks', component: './MyBatch' },
          {
            path: '/Category/Batches/tasks/people/:type/:batchId/:batchName',
            component: './People/AddPeople/index',
          },
          ...taskDetailsPageRoutes,
        ],
      },
      // { path: '/batch/:type', component: './Course' },
      // { path: '/batch/:type/:taskId', component: './Task' },
      { component: './404' },
    ],
  },
  {
    path: '/Subscription',
    name: 'subscription',
    icon: 'icon-file-zip-line',
    access: 'checkAccessFun',
    breadcrumbName: 'Subscription Management',
    accessKey: 'trainingTrainerBatchManagement',
    routes: [
      { path: '/Subscription', component: './Subscription' },
      {
        path: '/Subscription/Create',
        breadcrumbName: 'Create Subscription',
        component: './Subscription/Create',
      },
      {
        path: '/Subscription/edit/:id',
        breadcrumbName: 'Update Subscription',
        component: './Subscription/Edit',
      },
      {
        path: '/Subscription/Success/:id',
        breadcrumbName: 'Subscription Created',
        component: './Subscription/Success',
      },
      { component: './404' },
    ],
  },
  {
    path: '/codingLanguage',
    name: 'CodingLanguage',
    icon: 'icon-a-IconsJavascript',
    access: 'checkAccessFun',
    accessKey: 'trainingTrainerCodingLanguageManagement',
    component: './CodingLanguage',
  },
  {
    path: '/tagManagement',
    component: './TagManagement/index',
    // routes: [
    //   { path: '/tagManagement', component: './TagManagement/index' },
    //   {
    //     component: './404',
    //   },
    // ],
  },
  {
    path: '/register',
    name: 'register',
    component: './Register',
    layout: false,
    hideInMenu: true,
  },
  // {
  //   path: '/coder',
  //   name: 'coder',
  //   component: './CodeerSetting',
  //   // layout: false,
  //   hideInMenu: true,
  // },
  {
    path: '/problems/:questionId/:activeKey',
    component: './IDE',
    layout: false,
  },
  {
    path: '/',
    redirect: '/summary',
  },
  {
    component: './404',
  },
];
