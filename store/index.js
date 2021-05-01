export const state = () => ({
    permissions: [],
    roles: []
})

export const mutations = {
    PERMISSIONS(state, value) {
        state.permissions = value
    },
    ROLES(state, value) {
        state.roles = value
    },
}