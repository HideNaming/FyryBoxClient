<template>
  <div>
    <div class="main_header">
      <div class="nav is-mini">
        <b-navbar wrapper-class="container">
          <template #brand>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
              <img
                class="brand-logo"
                src="~assets/images/logo.png"
                alt="FurryBox"
              />
            </b-navbar-item>
          </template>
          <template #end>
            <div class="buttons">
              <b-navbar-item @click="Garantii">
                <span>{{ $t("menu")["garantii"] }}</span>
              </b-navbar-item>
              <b-navbar-item @click="Otzivi">
                <span>{{ $t("menu")["otzivi"] }}</span>
              </b-navbar-item>
              <nuxt-link to="/auction"
                ><b-navbar-item>
                  <span class="header_auction">{{ $t("menu")["auction"] }} <i>New</i></span>
                </b-navbar-item></nuxt-link
              >
              <b-dropdown
                v-if="$auth.loggedIn"
                position="is-bottom-left"
                :triggers="['hover']"
              >
                <template #trigger>
                  <div class="mini-profile">
                    <div
                      :style="{ 'background-image': 'url(' + avatar + ')' }"
                      class="img"
                    ></div>
                    <div class="content">
                      <h4>
                        {{ $t("menu")["miniprofile_hi"] }},
                        {{ $auth.user.name }}
                      </h4>
                      <span
                        >{{ $t("global")["balance"] }}:
                        {{ $auth.user.money }} {{ $t("global")["currency"] }}.
                        <a @click="payment"
                          >{{$t('payment')['add']}}
                          <b-icon
                            icon="credit-card-plus-outline"
                            size="is-small"
                          >
                          </b-icon></a
                      ></span>
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
                      <img src="~assets/icons/settings.svg" />
                      <span>{{ $t("menu")["profile"] }}</span>
                    </div>
                  </NuxtLink>
                  <NuxtLink to="/profile/auction">
                    <div class="link">
                      <img src="~assets/icons/auction.svg" />
                      <span>{{ $t("menu")["auction"] }}</span>
                    </div>
                    </NuxtLink>
                  <NuxtLink to="/profile/delivery">
                    <div class="link">
                      <img src="~assets/icons/delivery.svg" />
                      <span>{{ $t("menu")["delivery"] }}</span>
                    </div>
                  </NuxtLink>
                  <NuxtLink to="/admin">
                    <div
                      v-if="$store.state.roles.includes('Admin')"
                      class="link"
                    >
                      <span class="panel">Админ-Панель</span>
                    </div>
                  </NuxtLink>
                  <div class="link" @click="logout()">
                    <img src="~assets/icons/logout.svg" />
                    <span>{{ $t("menu")["logout"] }}</span>
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
              <!--img class="icon" src="~assets/icons/lang.svg" /-->
            </div>
          </template>
        </b-navbar>
      </div>
    </div>
  </div>
</template>

<script>
import Payment from "~/components/Payment";
import Garantii from "~/components/Garantii";

export default {
  data() {
    return {
      avatar: null,
    };
  },
  mounted() {
    if (this.$auth.loggedIn) {
      this.avatar =
        process.env.API_URL +
        "/api/v1/avatar/" +
        this.$auth.user.id +
        "?" +
        this.$auth.user.updated_at;
    }
  },
  methods: {
    Garantii() {
      this.$buefy.modal.open({
        parent: this,
        component: Garantii,
      });
    },
    Otzivi() {
      this.$router.push({ path: "/", query: { otzivi: true } });
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
    async logout() {
      console.log(this.$auth.$storage);
      await this.$auth
        .logout()
        .then(() => {
          this.$auth.logout();
          this.$store.commit("PERMISSIONS", []);
          this.$buefy.toast.open({
            message: $t("auth")["success_logout"],
            type: "is-success",
          });
        })
        .catch((e) => {});
    },
  },
};
</script>


