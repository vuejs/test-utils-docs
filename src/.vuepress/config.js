const sidebar = {
  guide: [
    {
      title: 'Essentials',
      collapsable: false,
      children: [
        '/guide/installation',
        '/guide/introduction',
        '/a-crash-course',
        '/conditional-rendering',
        '/event-handling',
        '/passing-data',
        '/forms'
      ]
    },
    {
      title: 'Vue Test Utils in depth',
      collapsable: false,
      children: [
        '/slots',
        '/async-suspense',
        '/http-requests',
        '/transitions',
        '/component-instance',
        '/reusability-composition',
        '/vuex',
        '/vue-router',
        '/third-party',
        '/stubs-shallow-mount'
      ]
    },
    {
      title: 'Extending Vue Test Utils',
      collapsable: false,
      children: ['/plugins', '/community-learning']
    },
    {
      title: 'Migration to Vue Test Utils 2',
      collapsable: false,
      children: ['/migration']
    },
    {
      title: 'API Reference',
      collapsable: false,
      children: ['/api/']
    }
  ],
  api: [
    {
      title: 'API Reference',
      collapsable: false,
      children: ['/api/']
    }
  ]
}

module.exports = {
  base: '/v2/',
  title: 'Vue Test Utils',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue Test Utils (2.0.0-beta.0)'
    }
  },
  themeConfig: {
    editLinks: true,
    sidebarDepth: 2,
    sidebar: {
      '/': sidebar.guide,
      '/api/': sidebar.api
    },
    nav: [
      { text: 'Guide', link: '/introduction' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Migration from VTU 1', link: '/migration' },
      { text: 'GitHub', link: 'https://github.com/vuejs/vue-test-utils-next' }
    ]
  }
}
