const sidebar = {
  guide: [
    {
      title: 'Essentials',
      collapsable: false,
      children: [
        '/guide/installation',
        '/guide/introduction',
        '/guide/a-crash-course'
      ]
    }
  ]
}

module.exports = {
  base: '/vue-test-utils-next-docs/',
  title: 'Vue Test Utils',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue Test Utils'
    }
  },
  themeConfig: {
    editLinks: true,
    sidebarDepth: 2,
    sidebar: {
      '/guide/': sidebar.guide
    },
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'API Reference', link: '/api/' }
    ]
  }
}
