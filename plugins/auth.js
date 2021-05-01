const TrackChanges = require('track-changes-js');
const trackChanges = new TrackChanges();
import Login from "~/components/Login";
import Register from "~/components/Register";

export default ({ store, $auth, $axios, $store }, inject) => {
    inject('registerModal', (obj) => {
        obj.$buefy.modal.open({
            parent: obj,
            component: Register,
            hasModalCard: true
        });
    });
    inject('loginModal', (obj) => {
        obj.$buefy.modal.open({
            parent: obj,
            component: Login,
            hasModalCard: true
        });
    });

    LoadPermissions($auth, $axios, store)
    try {
        trackChanges.addObserver('authObserver', () => $auth.loggedIn)
    } catch (e) { }
    trackChanges.addHandler('authObserver', () => {
        LoadPermissions($auth, $axios, store)
    })
}

async function LoadPermissions($auth, $axios, store) {
    if ($auth.loggedIn) {
        await $axios.get("/api/v1/auth/permissions").then((response) => {
            store.commit('PERMISSIONS', response.data.permissions)
            store.commit('ROLES', response.data.roles)
        })
    }
}




