<template>
  <div class="social-group">
    <div class="vk" @click="socialLogin('vkontakte')">
      <div class="icon"><img src="/icons/vk_white.svg" /></div>
      <span>{{ $t('auth')['vk'] }}</span>
    </div>
    <!--div class="steam" @click="socialLogin('steam')">
      <div class="icon"><img src="/icons/steam.svg" /></div>
      <span>{{ $t('auth')['steam'] }}</span>
    </div-->
    <div class="discord" @click="socialLogin('discord')">
      <div class="icon"><img src="/icons/discord.svg" /></div>
      <span>{{ $t('auth')['discord'] }}</span>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    window.addEventListener("message", this.onMessage, false);
  },
  beforeDestroy() {
    window.removeEventListener("message", this.onMessage);
  },

  methods: {
    async socialLogin(provider) {
      const newWindow = openWindow("", "");
      const url = await this.$store.dispatch("authorization/oauth", {
        provider: provider,
      });
      newWindow.location.href = url;
    },
    async onMessage(e) {
      await this.$auth
        .loginWith("laravelJWT", {
          data: {
            token: e.data.token,
          },
        })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('auth')['success_login'],
            type: "is-success",
          });
          this.$parent.$emit("close");
        });
    },
  },
};

function openWindow(url, title, options = {}) {
  if (typeof url === "object") {
    options = url;
    url = "";
  }
  options = { url, title, width: 600, height: 720, ...options };
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screen.left;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screen.top;
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    window.screen.width;
  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    window.screen.height;
  options.left = width / 2 - options.width / 2 + dualScreenLeft;
  options.top = height / 2 - options.height / 2 + dualScreenTop;
  const optionsStr = Object.keys(options)
    .reduce((acc, key) => {
      acc.push(`${key}=${options[key]}`);
      return acc;
    }, [])
    .join(",");
  const newWindow = window.open(url, title, optionsStr);
  if (window.focus) {
    newWindow.focus();
  }
  return newWindow;
}
</script>