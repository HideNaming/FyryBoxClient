<template>
  <section>
    <HeaderMini />
    <div class="container">
      <div class="auction-header"></div>
      <div class="auction-content">
        <no-ssr>
          <h2>{{ $t("auction")["title_1"] }}</h2>
          <b-carousel-list :data="auction_top" :items-to-show="items">
            <template #item="list">
              <div class="auction-lot top">
                <div class="ac-column">
                  <div class="title">{{ list.loot.name }}</div>
                  <div class="price" v-if="list.finish == null">
                    {{ $t("auction")["price_curnet"] }}:
                    <i>{{ list.price }} {{ $t("global")["currency"] }}.</i>
                  </div>
                  <div class="price" v-else>
                    {{ $t("auction")["price_finish"] }}:
                    <i>{{ list.price }} {{ $t("global")["currency"] }}.</i>
                  </div>
                  <div class="price-two" v-if="list.finish == null">
                    {{ $t("auction")["price_start"] }}: {{ list.start }}
                    {{ $t("global")["currency"] }}.
                  </div>
                  <div class="price-two" v-if="list.finish == null">
                    {{ $t("auction")["price_stap"] }}: {{ list.stap }}
                    {{ $t("global")["currency"] }}.
                  </div>
                  <div class="last_rate">
                    <div class="info">{{ $t("auction")["last_rate"] }}:</div>
                    <div v-if="list.rate == null" class="name">
                      {{ $t("auction")["not_rates"] }}
                    </div>
                    <div v-else class="name">{{ list.rate }}</div>
                  </div>
                  <nuxt-link :to="'/auction/lot/' + list.id"
                    ><div class="action">
                      {{ $t("auction")["more"] }}
                    </div></nuxt-link
                  >
                </div>
                <div class="ac-column right">
                  <div class="timer-frame">
                    <div class="head">{{ $t("auction")["finished"] }}:</div>
                    <div class="timer">
                      <img src="/icons/watch.svg" />
                      <vac :end-time="Number(list.finished) * 1000">
                        <template v-slot:process="{ timeObj }">
                          <span
                            >{{ timeObj.h
                            }}<i>{{ $t("gloabl")["hour"] }}</i></span
                          >:<span
                            >{{ timeObj.m
                            }}<i>{{ $t("gloabl")["min"] }}</i></span
                          >:<span
                            >{{ timeObj.s
                            }}<i>{{ $t("gloabl")["sec"] }}</i></span
                          >
                        </template>
                        <span class="small" slot="finish">
                          <template v-if="list.finish == null">{{
                            $t("auction")["status_process"]
                          }}</template>
                          <template v-else>{{
                            $t("auction")["status_finish"]
                          }}</template>
                        </span>
                      </vac>
                    </div>
                  </div>
                  <img
                    class="image"
                    :src="backend + '/images/' + list.loot.image"
                  />
                </div>
              </div>
            </template>
          </b-carousel-list>
        </no-ssr>
      </div>
      <div class="auction-content" id="auction">
        <h2>{{ $t("auction")["title_2"] }}</h2>
        <div
          class="auction-lot"
          v-for="list in auction_list.data"
          :key="list.id"
        >
          <div class="ac-column">
            <div class="title">{{ list.loot.name }}</div>
            <div class="price" v-if="list.finish == null">
              {{ $t("auction")["price_curnet"] }}:
              <i>{{ list.price }} {{ $t("global")["currency"] }}.</i>
            </div>
            <div class="price" v-else>
              {{ $t("auction")["price_finish"] }}:
              <i>{{ list.price }} {{ $t("global")["currency"] }}.</i>
            </div>
            <div class="price-two" v-if="list.finish == null">
              {{ $t("auction")["price_start"] }}: {{ list.start }}
              {{ $t("global")["currency"] }}.
            </div>
            <div class="price-two" v-if="list.finish == null">
              {{ $t("auction")["price_stap"] }}: {{ list.stap }}
              {{ $t("global")["currency"] }}.
            </div>
            <div class="last_rate">
              <div class="info">{{ $t("auction")["last_rate"] }}:</div>
              <div v-if="list.rate == null" class="name">
                {{ $t("auction")["not_rates"] }}
              </div>
              <div v-else class="name">{{ list.rate }}</div>
            </div>
            <nuxt-link :to="'/auction/lot/' + list.id"
              ><div class="action">{{ $t("auction")["more"] }}</div></nuxt-link
            >
          </div>
          <div class="ac-column right">
                  <div class="timer-frame">
                    <div class="head">{{ $t("auction")["finished"] }}:</div>
                    <div class="timer">
                      <img src="/icons/watch.svg" />
                      <vac :end-time="Number(list.finished) * 1000">
                        <template v-slot:process="{ timeObj }">
                          <span
                            >{{ timeObj.h
                            }}<i>{{ $t("gloabl")["hour"] }}</i></span
                          >:<span
                            >{{ timeObj.m
                            }}<i>{{ $t("gloabl")["min"] }}</i></span
                          >:<span
                            >{{ timeObj.s
                            }}<i>{{ $t("gloabl")["sec"] }}</i></span
                          >
                        </template>
                        <span class="small" slot="finish">
                          <template v-if="list.finish == null">{{
                            $t("auction")["status_process"]
                          }}</template>
                          <template v-else>{{
                            $t("auction")["status_finish"]
                          }}</template>
                        </span>
                      </vac>
                    </div>
                  </div>
                  <img
                    class="image"
                    :src="backend + '/images/' + list.loot.image"
                  />
                </div>
        </div>
      </div>
      <b-pagination
        @change="paginate"
        :total="auction_list.total"
        v-model="auction_list.current_page"
        :per-page="auction_list.per_page"
      >
      </b-pagination>
      <b-loading
        :is-full-page="true"
        v-model="loading"
        :can-cancel="false"
      ></b-loading>
    </div>
  </section>
</template>

<script>
export default {
  head() {
    return {
      title: `${this.$t('menu')['auction']} » ${process.env.PARTNER}`,
    };
  },
  data() {
    return {
      backend: process.env.API_URL,
      items: 1,
      loading: true,
      auction_top: [],
      auction_list: {
        data: [],
        current_page: 1,
        total: 1,
        per_page: 1,
      },
    };
  },
  methods: {
    async paginate() {
      this.loading = true;
      await this.$axios
        .get("/api/v1/auction/", {
          params: {
            page: this.auction_list.current_page,
          },
        })
        .then((response) => {
          this.auction_list = response.data;
          this.loading = false;
          this.$scrollTo("#auction");
          window.history.pushState(
            "",
            "",
            "/auction/" + this.auction_list.current_page
          );
        });
    },
  },
  async fetch() {
    console.log(this.$route.params.page);
    this.auction_top = await this.$http.$get("/api/v1/auction/top");
    this.auction_list = await this.$http.$get(
      "/api/v1/auction?page=" + this.$route.params.page
    );
    this.loading = false;
  },
  fetchOnServer: true,
  mounted() {
    if (window.innerWidth >= 1000) this.items = 2;
    if (window.innerWidth >= 1400) this.items = 3;
    this.socket = this.$nuxtSocket({
      channel: `/`,
    });
    this.socket.on(`auction:AuctionLot`, (msg, cb) => {
      var value = this.auction_list.data.find((e) => e.id === msg.data.id);
      var key = Object.keys(this.auction_list.data).find(
        (key) => this.auction_list.data[key] === value
      );
      if (typeof key !== "undefined") {
        this.$set(this.auction_list.data, key, msg.data);
      }

      var value = this.auction_top.find((e) => e.id === msg.data.id);
      var key = Object.keys(this.auction_top).find(
        (key) => this.auction_top[key] === value
      );
      if (typeof key !== "undefined") {
        this.$set(this.auction_top, key, msg.data);
      }
    });
  },
};
</script>