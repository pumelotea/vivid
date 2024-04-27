module.exports = {
  title: 'VividEditor',
  description: '一个基于tiptap和naviue的现代编辑器',
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
