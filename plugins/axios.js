export default function ({ app, $axios, redirect }) {
    $axios.interceptors.request.use((config) => {
        if (app.i18n.locale) {
            $axios.setHeader('Accept-Language', app.i18n.locale)
        }
        return config;
    });
}
