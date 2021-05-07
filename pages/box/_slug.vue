<template>
  <section>
    <HeaderMini />
    <div class="box-window">
      <div class="header">
        <div class="title">{{ $t("box")["boxes"][box.name] }}</div>
        <div class="columns info">
          <div class="column left">
            <div class="stats">
              <img src="/icons/eye.svg" />
              <span
                ><b
                  ><animated-number
                    :value="box.views"
                    :formatValue="formatTween"
                    :duration="1000"
                /></b>
                {{ $t("box")["views"] }}</span
              >
            </div>
          </div>
          <div class="column is-one-quarter center">
            <img v-if="!preLoading" :src="backend + '/images/' + box.image" />
          </div>
          <div class="column right">
            <div class="stats">
              <img src="/icons/money-bag.svg" />
              <span
                ><b
                  ><animated-number
                    :value="box.opens"
                    :formatValue="formatTween"
                    :duration="1000"
                /></b>
                {{ $t("box")["opens"] }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="roll-core">
        <marquee-text class="roll" :duration="duration" :paused="paused">
          <div v-if="!preLoading" class="content-roll">
            <div class="drop" v-for="item in roll">
              <img :src="backend + '/images/' + box.loot[item].image" />
            </div>
          </div>
        </marquee-text>
        <div v-if="!preLoading" class="roll-frame">
          <div class="arrow top"></div>
          <div class="arrow bottom"></div>
        </div>
        <div v-if="!preLoading" class="roll-action">
          <div class="title">{{ $t("box")["change_top_gift"] }}</div>
          <div class="boost">
            <div @click="change = 1" :class="[change == 1 ? 'active' : '']">
              <span>x1</span>
            </div>
            <div class="deciminal"></div>
            <div @click="change = 2" :class="[change == 2 ? 'active' : '']">
              <span>x2</span>
            </div>
            <div class="deciminal"></div>
            <div @click="change = 3" :class="[change == 3 ? 'active' : '']">
              <span>x3</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!preLoading" class="container box-content">
        <div class="actions">
          <b-button
            :disabled="paused"
            :loading="loading"
            v-if="$auth.loggedIn"
            @click="scroll"
            class="button open is-primary"
          >
            <div v-if="box.sale > 0" class="sale">
              {{ Math.round(box.price * changes[change] * 100) / 100 }} руб
            </div>
            <span
              >{{ $t("box")["open_behind"] }}
              {{
                Math.round(
                  (box.price * changes[change] -
                    (box.price * changes[change] * box.sale) / 100) *
                    100
                ) / 100
              }}
              руб</span
            >
          </b-button>
          <b-button
            v-else
            @click="registerModal"
            class="button open is-primary"
          >
            <span>{{ $t("auth")["auth"] }}</span>
          </b-button>
          <b-button
            @click="demo_scroll"
            :disabled="paused"
            :loading="loading"
            class="button demo is-primary"
          >
            <span>{{ $t("box")["demo_title"] }}</span>
          </b-button>
        </div>
        <div class="last_gift" v-if="typeof last_top_gift.loot !== 'undefined'">
          <div class="title">{{ $t("box")["last_top_gift"] }}</div>
          <div class="content">
            <a>
              <img
                class="img"
                :src="backend + '/images/' + last_top_gift.loot.image"
              />
            </a>
            <div class="text">
              <div class="info">
                <div class="item">{{ last_top_gift.loot.name }}</div>
                <div class="price">
                  {{ Math.round(last_top_gift.loot.price) }} <i>руб</i>
                </div>
              </div>
              <div class="name">
                {{ $t("box")["last_top_gift_name"] }}:
                <i>{{ last_top_gift.name }}</i>
              </div>
              <div class="time">
                <i class="icon icon-clock"></i>
                <span
                  ><b-icon icon="clock-time-four-outline" size="is-small">
                  </b-icon>
                  {{ last_top_gift.time }}</span
                >
              </div>
            </div>
          </div>
          <!--div>{{last_top_gift.id}}</div-->
        </div>
        <div class="loot">
          <div
            class="drop lock-mode"
            v-for="(item, index) in box.loot"
            :key="item.id"
          >
            <b-tooltip
              class="change"
              :label="$t('box')['add_change']"
              type="is-dark"
              position="is-top"
            >
              <img
                @click="
                  change = 3;
                  changeItem = item.id;
                "
                src="/icons/plus.svg"
              />
            </b-tooltip>
            <div @click="infoModal(index)">
              <span v-if="Boolean(item.stock) !== false" class="stock"
                ><img src="/icons/stock.svg" />
                {{ $t("box")["stock"] }}</span
              >
              <img class="img" :src="backend + '/images/' + item.image" />
              <div class="info">
                <div class="name">{{ item.name }}</div>
                <div class="price">
                  {{ item.price }} {{ $t("global")["currency"] }}
                </div>
              </div>
            </div>
            <div
              v-if="changeItem == item.id && change == 3"
              class="lock_screen"
            >
              <div class="change-screen">
                <div class="icon-ch"></div>
                <div class="text">{{ $t("box")["change_added"] }}</div>
              </div>
            </div>
            <div v-if="Boolean(item.stock) === false" class="lock_screen">
              <div class="change-screen">
                <div class="not-stock">{{ $t("box")["not_stock"] }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-loading
        :is-full-page="true"
        v-model="preLoading"
        :can-cancel="false"
      ></b-loading>
  </section>
</template>

<style lang="sass">
.nav
  background-color: transparent !important
</style>

<script>
import Payment from "~/components/Payment";
import Prize from "~/components/Prize";
import DropInfo from "~/components/DropInfo";
import AnimatedNumber from "animated-number-vue";

export default {
  head() {
    return {
      title: this.title,
    };
  },
  components: {
    AnimatedNumber,
  },
  data() {
    return {
      box: {
        name: false,
        loot: [],
      },
      title: `${this.$t("global")["loading"]} » ${process.env.PARTNER}`,
      roll: [],
      info: [],
      last_top_gift: [],
      change: 1,
      changeItem: null,
      change_item: null,
      changes: {
        1: 1,
        2: 1.2,
        3: 1.5,
      },
      prize: {
        item: [],
        type: null,
      },
      paused: false,
      loading: false,
      preLoading: true,
      duration: 900,
      backend: process.env.API_URL,
    };
  },
  methods: {
    formatTween(value) {
      return value.toFixed(0);
    },
    rollActive() {
      this.paused = true;
      var mobile = 1;
      if (window.innerWidth <= 600) mobile = 0.2;
      var drop = $(
        "div.marquee-text-text:nth-child(1) > div:nth-child(1) > div:nth-child(100)"
      ).offset().left;
      var arrow = $("div.arrow:nth-child(1)").offset().left;
      $(".marquee-text-content").css(
        "transition",
        "all 8s cubic-bezier(0.0125, 0.1, 0.1, 1) 0s"
      );
      $(".marquee-text-content").css(
        "transform",
        "translate3d(-" +
          (drop - arrow + 10 * mobile - Math.random() * 30 * mobile) +
          "px, 0px, 0px)"
      );
    },
    rollDeactive() {
      setTimeout(() => {
        this.paused = false;
      }, 500);
      $(".marquee-text-content").css(
        "transform",
        "translate3d(100px, 0px, 0px)"
      );
      $(".marquee-text-content").css(
        "transition",
        "all 0.5s cubic-bezier(0.0125, 0.1, 0.1, 1) 0s"
      );
      this.roll = Array.from({ length: 200 }, () => this.CheckStock());
    },
    async demo_scroll() {
      this.loading = true;
      await this.$axios
        .get("/api/v1/open/demo/" + this.box.id)
        .then((response) => {
          this.rollActive();
          $(
            "div.marquee-text-text:nth-child(1) > div:nth-child(1) > div:nth-child(100) > img:nth-child(1)"
          ).attr("src", this.backend + "/images/" + response.data["image"]);
          this.loading = false;
          this.prize = {
            item: response.data,
            type: "demo",
          };
          setTimeout(() => {
            this.$buefy.modal.open({
              parent: this,
              customClass: "prize-modal",
              component: Prize,
              onCancel: () => this.rollDeactive(),
            });
          }, 8000);
        });
    },
    async scroll() {
      this.loading = true;
      await this.$axios
        .get("/api/v1/open/" + this.box.id, {
          params: {
            change: this.change,
          },
        })
        .then((response) => {
          this.rollActive();
          $(
            "div.marquee-text-text:nth-child(1) > div:nth-child(1) > div:nth-child(100) > img:nth-child(1)"
          ).attr("src", this.backend + "/images/" + response.data["image"]);
          this.loading = false;
          this.prize = {
            item: response.data,
            type: "real",
          };
          (async () => {
            await this.$auth.fetchUser();
          })();
          setTimeout(() => {
            this.$buefy.modal.open({
              parent: this,
              customClass: "prize-modal",
              component: Prize,
              onCancel: () => this.rollDeactive(),
            });
          }, 8000);
        })
        .catch((response) => {
          (async () => {
            await this.$auth.fetchUser();
          })();
          this.loading = false;
          this.$buefy.snackbar.open({
            message: this.$t("global")["notenought"],
            actionText: this.$t("payment")["add"],
            type: 'is-warning',
            onAction: () => {
              this.$buefy.modal.open({
                parent: this,
                component: Payment,
              });
            },
          });
        });
    },
    registerModal() {
      this.$registerModal(this);
    },
    infoModal(id) {
      this.info = this.box.loot[id];
      this.$buefy.modal.open({
        parent: this,
        component: DropInfo,
      });
    },
    CheckStock() {
      var item = Math.floor(Math.random() * Object.keys(this.box.loot).length);
      if (Boolean(this.box.loot[item].stock) === false) this.CheckStock();
      return item;
    },
  },
  async fetch() {
    this.box = await this.$http.$get(
      "/api/v1/boxes/" + this.$route.params.slug
    );
    this.title = `${this.$t("box")["boxes"][this.box.name]} » ${process.env.PARTNER}`
    this.last_top_gift = await this.$http.$get(
      "/api/v1/open/last_top_gift/" + this.$route.params.slug
    );
    console.log(this.last_top_gift);
    this.opens = this.box.opens;
    this.roll = Array.from({ length: 200 }, () => this.CheckStock());
    this.preLoading = false;
  },
  fetchOnServer: true,
  mounted() {
    this.socket = this.$nuxtSocket({
      channel: `/`,
    });
    this.socket.on(`box.${this.$route.params.slug}:Box`, (msg, cb) => {
      this.box.opens = msg.data.opens;
      this.box.views = msg.data.views;
    });
  },
};
</script>