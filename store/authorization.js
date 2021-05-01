export const actions = {
  async oauth(ctx, { provider }) {
    const { data } = await this.$axios.post(`/api/v1/oauth/${provider}`)

    return data.url
  },
}