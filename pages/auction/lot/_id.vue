<template>
  <section>
    <HeaderMini />
    <div class="container" v-if="!preLoading">
      <div class="auction-header"></div>
      <div class="auction-lot">
        <div class="columns">
          <div class="column is-one-third ac-left">
            <div class="title">{{ $t("auction")["box"] }}</div>
            <img :src="backend + '/images/' + lot.box.image" />
            <div class="title">{{ $t("box")["boxes"][lot.box.name] }}</div>
            <div class="price">
              {{ $t("auction")["price"] }}:
              <i>{{ lot.box.price }} {{ $t("global")["currency"] }}.</i>
            </div>
            <nuxt-link :to="'/box/' + lot.box.slug"
              ><button class="button is-primary">
                {{ $t("box")["open"] }}
              </button></nuxt-link
            >
          </div>
          <div class="column ac-right">
            <div class="title">
              <h2>{{ lot.loot.name }}</h2>
              <div class="result">{{ $t("auction")["finished"] }}:</div>
              <div class="timer">
                <img src="~assets/icons/watch.svg" />
                <no-ssr>
                  <vac
                    v-if="lot.finished"
                    :end-time="Number(lot.finished) * 1000"
                    ref="vac1"
                  >
                    <template v-slot:process="{ timeObj }">
                      <span
                        >{{ timeObj.h }}<i>{{ $t("global")["hour"] }}</i></span
                      >:<span
                        >{{ timeObj.m }}<i>{{ $t("global")["min"] }}</i></span
                      >:<span
                        >{{ timeObj.s }}<i>{{ $t("global")["sec"] }}</i></span
                      >
                    </template>
                    <template slot="finish" class="small">
                      <template v-if="lot.finish == null">{{
                        $t("auction")["status_process"]
                      }}</template>
                      <template v-else>{{
                        $t("auction")["status_finish"]
                      }}</template>
                    </template>
                  </vac>
                </no-ssr>
              </div>
            </div>
            <div class="columns">
              <div class="column is-two-thirds">
                <ul class="text">
                  <li v-for="item in lot.loot.detail.split(/\r?\n/)">
                    <b-icon icon="check" size="is-small"> </b-icon> {{ item }}
                  </li>
                </ul>
                <ValidationObserver
                  v-if="lot.finish == null"
                  ref="observer"
                  v-slot="{ invalid }"
                  tag="form"
                >
                  <div class="columns">
                    <div class="column is-three-fifths">
                      <ValidationProvider
                        :rules="
                          'required|numeric|min_value:' +
                          minimal +
                          '|max_value:500000'
                        "
                        name="ПОПОЛНЯЕТЕ"
                        v-slot="{ errors, valid }"
                      >
                        <b-field
                          :type="{
                            'is-danger': errors[0],
                            'is-success': valid,
                          }"
                          :message="errors"
                          label="Сумма"
                        >
                          <b-input v-model="user_price"></b-input>
                        </b-field>
                      </ValidationProvider>
                    </div>
                    <div class="column">
                      <b-button
                        v-if="$auth.loggedIn"
                        class="action"
                        :disabled="invalid"
                        :loading="loading"
                        @click="RateAct"
                        :label="$t('auction')['rate_add']"
                      />
                      <b-button
                        v-else
                        class="action"
                        :disabled="invalid"
                        :loading="loading"
                        @click="registerModal"
                        :label="$t('auth')['auth']"
                      />
                    </div>
                  </div>
                </ValidationObserver>
              </div>
              <div class="column cc">
                <img :src="backend + '/images/' + lot.loot.image" />
              </div>
            </div>
            <div class="columns price-col">
              <div class="column is-half">
                <div class="price" v-if="lot.finish == null">
                  {{ $t("auction")["price_curnet"] }}:
                  <i>{{ lot.price }} {{ $t("global")["currency"] }}.</i>
                </div>
                <div class="price" v-else>
                  {{ $t("auction")["price_finish"] }}:
                  <i>{{ lot.price }} {{ $t("global")["currency"] }}.</i>
                </div>
                <div class="price-two" v-if="lot.finish == null">
                  {{ $t("auction")["price_start"] }}: {{ lot.start }}
                  {{ $t("global")["currency"] }}.
                </div>
                <div class="price-two" v-if="lot.finish == null">
                  {{ $t("auction")["price_stap"] }}: {{ lot.stap }}
                  {{ $t("global")["currency"] }}.
                </div>
              </div>
              <div class="column">
                <div class="price-store">
                  {{ $t("auction")["price_shop"] }}: {{ lot.loot.price }}
                  {{ $t("global")["currency"] }}.
                </div>
                <div class="price-percent">
                  {{ $t("auction")["price_percent"] }}: ~{{ benefit }}%
                </div>
              </div>
            </div>
            <div class="status">
              <div class="author">
                {{ $t("auction")["last_rate"] }}:
                <i v-if="lot.rate == null">{{ $t("auction")["not_rates"] }}</i>
                <i else>{{ lot.rate }}</i>
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

<script>
import Payment from "~/components/Payment";

export default {
  head() {
    return {
      title: this.title,
    };
  },
  data() {
    return {
      lot: {
        box: [],
        loot: {
          detail: "",
        },
      },
      title: `${this.$t("global")["loading"]} » ${process.env.PARTNER}`,
      user_price: 0,
      benefit: 0,
      minimal: 0,
      preLoading: true,
      loading: true,
      backend: process.env.API_URL,
    };
  },
  methods: {
    async RateAct() {
      this.loading = true;
      await this.$axios
        .$post("/api/v1/auction/rate", {
          payment: this.user_price,
          id: this.lot.id,
        })
        .then(() => {
          this.loading = false;
          this.$buefy.toast.open({
            message: this.$t("auction")["success"],
            type: "is-success",
          });
          (async () => {
            await this.$auth.fetchUser();
          })();
        })
        .catch((e) => {
          if (e.response.data.error == "NotEnought") {
            this.$buefy.snackbar.open({
              message: this.$t("global")["notenought"],
              actionText: this.$t("payment")["add"],
              type: "is-warning",
              onAction: () => {
                this.$buefy.modal.open({
                  parent: this,
                  component: Payment,
                });
              },
            });
          } else {
            this.$buefy.notification.open({
              duration: 5000,
              message: this.$t("auction")["error"],
              position: "is-bottom-right",
              type: "is-danger",
              hasIcon: true,
            });
          }
          this.loading = false;
        });
    },
    registerModal() {
      this.$registerModal(this);
    },
  },
  async fetch() {
    this.lot = await this.$http.$get(
      "/api/v1/auction/get/" + this.$route.params.id
    );
    this.title = `${this.lot.loot.name} » ${process.env.PARTNER}`;
    this.benefit = Math.ceil(Number(this.lot.benefit) * 100);
    this.user_price = Math.ceil(Number(this.lot.price) + Number(this.lot.stap));
    if (this.lot.rate == null)
      this.user_price = Math.ceil(Number(this.lot.price));
    this.minimal = this.user_price;
    this.loading = false;
    this.preLoading = false;
  },
  fetchOnServer: true,
  mounted() {
    this.socket = this.$nuxtSocket({
      channel: `/`,
    });
    this.socket.on(`auction:AuctionLot`, (msg, cb) => {
      if (msg.data.id == this.lot.id) {
        this.lot = msg.data;
        this.user_price = Math.ceil(
          Number(this.lot.price) + Number(this.lot.stap)
        );
        (async () => {
          await this.$auth.fetchUser();
        })();
      }
    });
  },
};
</script>