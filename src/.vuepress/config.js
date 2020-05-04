const sidebar = {
  guide: [
    {
      title: 'Essentials',
      collapsable: false,
      children: [
        '/guide/installation',
        '/guide/introduction',
        '/guide/a-crash-course',
        '/guide/plugins'
      ]
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
  base: '/vue-test-utils-next-docs/',
  title: 'Vue Test Utils',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue Test Utils (2.0.0-alpha.3)'
    }
  },
  themeConfig: {
    editLinks: true,
    sidebarDepth: 2,
    sidebar: {
      '/guide/': sidebar.guide,
      '/api/': sidebar.api
    },
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'API Reference', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com/vuejs/vue-test-utils-next' }
    ]
  }
}
