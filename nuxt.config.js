const path = require('path');

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Steemdunk',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#ffffff' },
      { property: 'og:title', content: 'Steemdunk' },
      { property: 'og:site_name', content: 'Steemdunk' },
      { property: 'og:description', content: 'Automate common tasks on the STEEM blockchain without any hassle.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://steemdunk.xyz/og-10.jpg' },
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'mask-icon', color: '#5bbad5', href: '/safari-pinned-tab.svg' },

      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/vuetify',
    '~/plugins/rpc'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    ['nuxt-ts', {
      tsconfig: path.join(__dirname, 'tsconfig.json')
    }],
    '~/modules/setup-env',
    '@nuxtjs/axios',
  ],

  /*
  ** Watch additional files
  */
  watch: [
    __dirname + '/src/**'
  ],

  /*
  ** Axios configuration
  */
  axios: {
    // Can be overridden with API_URL_BROWSER
    browserBaseURL: 'http://localhost:3001',
    // Can be overridden with API_URL
    baseURL: (() => {
      if (process.env.NODE_ENV === 'production') {
        return 'https://api.steemdunk.xyz';
      } else {
        return 'http://localhost:3001';
      }
    })(),
    proxyHeaders: false,
    retry: { retries: 3 }
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, cxt) {
    }
  }
}
