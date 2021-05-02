var webpack = require('webpack');

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.PARTNER,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' },
    ],
  },

  ssr: false,

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "~assets/main.sass"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~plugins/marquee.client.js",
    "~plugins/io.client.js"
    //{ src: '~/plugins/chart.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    '@nuxt/http',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'nuxt-buefy',
    '@nuxtjs/dotenv',
    'nuxt-socket-io',
    //'@nuxtjs/recaptcha',
    'vue-scrollto/nuxt',
    ['@mole-inc/nuxt-validate', {
      lang: 'ru',
      nuxti18n: {
        locale: {
          'ru-RU': 'ru'
        }
      }
    }],
    ['nuxt-i18n', {
      locales: [
        {
          code: 'ru',
          name: 'Русский',
          file: 'ru-RU.js'
        }
      ],
      detectBrowserLanguage: {
        useCookie: true,
        alwaysRedirect: true,
        cookieKey: 'lang',
        onlyOnRoot: true
      },
      lazy: true,
      langDir: 'lang/',
      defaultLocale: 'ru'
    }],
  ],

  io: {
    sockets: [{
      name: 'main',
      url: process.env.WEBSOCKET_HOST
    }]
  },

  axios: {
    baseURL: process.env.API_URL,
  },

  /*recaptcha: {
    siteKey: process.env.RECAPTCHA_SITEKEY,
    version: 3,
  },*/

  auth: {
    plugins: [{ src: '~/plugins/axios', ssr: true }, '~/plugins/auth'],
    strategies: {
      laravelJWT: {
        provider: 'laravel/jwt',
        url: process.env.API_URL,
        endpoints: {
          login: { url: '/api/v1/auth/login', method: 'post' },
          refresh: { url: '/api/v1/auth/logout', method: 'post' },
          user: { url: '/api/v1/auth/me', method: 'post' },
          logout: { url: '/api/v1/auth/logout', method: 'post' }
        },
        token: {
          property: 'access_token',
          maxAge: 60 * 60
        },
        refreshToken: {
          maxAge: 20160 * 60
        },
      },
    },
  },

  router: {
    prefetchLinks: false,
    prefetchPayloads: false
  },


  build: {
    vendor: ["jquery"],
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery"
      })
    ],
    extend(config, { isClient }) {
      if (isClient) {
        config.performance.hints = false;
      }
    },
  },
}
