<template>
  <div>
    <div class="main_header">
      <div class="nav">
        <b-navbar wrapper-class="container">
          <template #brand>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
              <img
                class="brand-logo"
                src="/images/logo.png"
                alt="FurryBox"
              />
            </b-navbar-item>
          </template>
          <template #end>
            <div class="buttons">
              <b-navbar-item @click="Garantii"> <span>{{ $t("menu")["garantii"] }}</span> </b-navbar-item>
              <b-navbar-item v-scroll-to="'#comments_otzivi'"> <span>{{ $t("menu")["otzivi"] }}</span> </b-navbar-item>
              <nuxt-link to="/auction"><b-navbar-item> <span class="header_auction">{{ $t("menu")["auction"] }} <i>New</i></span> </b-navbar-item></nuxt-link>
              <b-dropdown
                v-if="$auth.loggedIn"
                position="is-bottom-left"
              >
                <template #trigger>
                  <div class="mini-profile">
                    <div :style="{ 'background-image': 'url(' + `${backend}/api/v1/avatar/${$auth.user.id}?${$auth.user.updated_at}` + ')' }" class="img"></div>
                    <div class="content">
                      <h4>{{$t('menu')['miniprofile_hi']}}, {{ $auth.user.name }}</h4>
                      <span>{{$t('global')['balance']}}: {{ $auth.user.money }} руб. <a @click="payment">{{ $t("payment")["add"] }} <b-icon
                icon="credit-card-plus-outline"
                size="is-small">
            </b-icon></a></span>
                    </div>
                  </div>
                </template>
                <b-dropdown-item
                  aria-role="menu-item"
                  :focusable="false"
                  custom
                  paddingless
                >
                  <NuxtLink to="/profile">
                    <div class="link">
                      <img src="/icons/settings.svg" />
                      <span>{{$t('menu')['profile']}}</span>
                    </div>
                    </NuxtLink>
                    <NuxtLink to="/profile/auction">
                    <div class="link">
                      <img src="/icons/auction.svg" />
                      <span>{{ $t("menu")["auction"] }}</span>
                    </div>
                    </NuxtLink>
                    <NuxtLink to="/profile/delivery">
                    <div class="link">
                      <img src="/icons/delivery.svg" />
                      <span>{{$t('menu')['delivery']}}</span>
                    </div>
                    </NuxtLink>
                  <NuxtLink to="/admin">
                    <div
                      v-if="$store.state.roles.includes('Admin')"
                      class="link"
                    >
                      <span class="panel" no-prefetch>Админ-Панель</span>
                    </div>
                  </NuxtLink>
                  <div class="link" @click="logout()">
                    <img src="/icons/logout.svg" />
                    <span>{{$t('menu')['logout']}}</span>
                  </div>
                </b-dropdown-item>
              </b-dropdown>
              <b-navbar-item v-else tag="div">
                <b-button
                  class="button is-primary"
                  @click="registerModal"
                  :label="$t('auth')['auth']"
                />
              </b-navbar-item>
              <!--img class="icon" src="/icons/lang.svg" /-->
            </div>
          </template>
        </b-navbar>
      </div>
      <div class="bg">
        <div class="container">
          <div class="columns">
            <div class="column is-half">
              <div class="content-frame">
                <a href="https://vk.com/furybox_ru?w=wall-204398736_68" target="_blank">
                <div class="media-player">
                  <img src="/icons/play.svg" class="play" />
                  <img
                    src="/images/header-image.png"
                    class="header-image is-hidden-touch"
                  />
                </div>
                </a>
              </div>
            </div>
            <div class="column">
              <div class="content-frame">
                <div class="header-title">
                  <span>{{$t('main')['header_title']}}</span><br />
                  <small
                    >{{$t('main')['header_desc']}}</small
                  >
                </div>
                <div class="statistic is-hidden-touch">
                  <div class="block">
                    <img src="/icons/bag.svg" />
                    <div>
                      <b><animated-number
                          :value="stats.award"
                          :formatValue="formatTween"
                          :duration="1500" /></b
                      ></b><br />
                      <span>{{$t('main')['stat_award']}}</span>
                    </div>
                  </div>
                  <div class="block">
                    <img src="/icons/users.svg" />
                    <div>
                      <b
                        ><animated-number
                          :value="stats.online"
                          :formatValue="formatTween"
                          :duration="1500" /></b
                      ><br />
                      <span>{{$t('main')['stat_online']}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="feed">
    <div class="title-block">
      <h4>{{$t('main')['feed_title']}}:</h4>
    </div>
    <div class="live">
      <nuxt-link v-for="item in stats.feed" :key="item.id" :to="'/box/' + item.box.slug">
      <div class="block">
        <div class="left">
          <div class="bottom">
            <p>
              <img :src="backend + '/images/' + item.box.image" />
                <b>{{item.loot.name}}</b>
                {{item.name}}
            </p>
          </div>
        </div>
        <div class="right" :style="{ 'background-image': 'url('+backend + '/images/' + item.loot.image+')' }">
        </div>
      </div>
      </nuxt-link>
    </div>
  </div>
  </div>
</template>

<script>
import AnimatedNumber from "animated-number-vue";
import Payment from "~/components/Payment";
import Garantii from "~/components/Garantii";

export default {
  components: {
    AnimatedNumber,
  },
  data() {
    return {
      backend: process.env.API_URL,
      stats: {
        online: 0,
        award: 0,
        feed: [],
      },
    };
  },
  methods: {
    Garantii() {
      this.$buefy.modal.open({
        parent: this,
        component: Garantii,
      });
    },
    payment() {
      this.$buefy.modal.open({
        parent: this,
        component: Payment,
      });
    },
    registerModal() {
      this.$registerModal(this);
    },
    formatTween(value) {
      return value.toFixed(0);
    },
    async logout() {
      await this.$auth
        .logout()
        .then(() => {
          this.$auth.logout();
          this.$store.commit("PERMISSIONS", []);
          this.$buefy.toast.open({
            message: this.$t("auth")["success_logout"],
            type: "is-success",
          });
        })
        .catch((e) => {});
    },
  },
  async fetch() {
    var stats = await this.$http.$get("/api/v1/stats/");
    this.stats = stats.stat;
  },
  fetchOnServer: true,
  mounted() {
    this.socket = this.$nuxtSocket({
      channel: `/`,
    });
    this.socket.on(`stat-chanel:StatsEvent`, (msg, cb) => {
      this.stats.online = msg.online;
      msg.feed.forEach((element) => {
        setTimeout(() => {
          this.stats.feed.unshift(element);
          this.stats.feed.pop();
        }, 3000);
      });
    });
  },
};
</script>

