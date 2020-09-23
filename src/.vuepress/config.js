const sidebar = {
  guide: [
    {
      title: 'Essentials',
      collapsable: false,
      children: [
        '/v2/guide/installation',
        '/v2/guide/introduction',
        '/v2/guide/a-crash-course',
        '/v2/guide/conditional-rendering',
        '/v2/guide/event-handling',
        '/v2/guide/passing-data',
        '/v2/guide/forms'
      ]
    },
    {
      title: 'Vue Test Utils in depth',
      collapsable: false,
      children: [
        '/v2/guide/slots',
        '/v2/guide/async-suspense',
        '/v2/guide/http-requests',
        '/v2/guide/transitions',
        '/v2/guide/component-instance',
        '/v2/guide/reusability-composition',
        '/v2/guide/vuex',
        '/v2/guide/vue-router',
        '/v2/guide/third-party',
        '/v2/guide/stubs-shallow-mount'
      ]
    },
    {
      title: 'Extending Vue Test Utils',
      collapsable: false,
      children: ['/v2/guide/plugins', '/v2/guide/community-learning']
    },
    {
      title: 'Migration to Vue Test Utils 2',
      collapsable: false,
      children: ['/v2/guide/migration']
    },
    {
      title: 'API Reference',
      collapsable: false,
      children: ['/v2/api/']
    }
  ],
  api: [
    {
      title: 'API Reference',
      collapsable: false,
      children: ['/v2/api/']
    }
  ]
}

module.exports = {
  base: '/',
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
      '/v2/guide/': sidebar.guide,
      '/v2/api/': sidebar.api
    },
    nav: [
      { text: 'Guide', link: '/v2/guide/introduction' },
      { text: 'API Reference', link: '/v2/api/' },
      { text: 'Migration from VTU 1', link: '/v2/guide/migration' },
      { text: 'GitHub', link: 'https://github.com/vuejs/vue-test-utils-next' }
    ]
  }
}
