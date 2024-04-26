module.exports = {
  title: 'Vivid UI', //TODO: CHANGE_ME
  description: 'Vivid是一个组件集合',
  themeConfig: {
    editLink: {
      //TODO: CHANGE_ME
      pattern: 'https://github.com/linusborg/vue-lib-monorepo-template/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    lastUpdated: 'Last Updated',
    nav: [
      { text: 'Installation', link: '/guide/installation' },
      {
        text: 'Guide',
        link: '/guide/getting-started',
      },
      {
        text: 'API',
        link: '/api',
      },
    ],
    sidebar: {
      '/guide/': getGuideSidebar(),
      '/api/': getApiSidebar(),
    },
  },
}

function getGuideSidebar() {
  return [{ text: 'Getting Started', link: '/guide/getting-started' }]
}
function getApiSidebar() {
  return []
}
