<template>
  <div>
    <HeaderMini />
    <div class="container">
      <div class="columns profile">
        <div class="column is-one-quarter">
          <div class="block">
            <div class="content">
              <div
                v-bind:style="{ 'background-image': 'url(' + avatar + ')' }"
                class="avatar"
              >
                <div class="upload">
                  <div @click="$refs.file.click()" class="action"></div>
                  <input
                    @change="FileUpload"
                    type="file"
                    ref="file"
                    style="display: none"
                  />
                </div>
              </div>
              <nuxt-link class="navigate" to="/profile">{{
                $t("profile")["profile"]
              }}</nuxt-link>
              <a class="navigate active">{{ $t("menu")["auction"] }}</a>
              <nuxt-link class="navigate" to="/profile/delivery">{{
                $t("profile")["delivery"]
              }}</nuxt-link>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="block">
            <div class="head"></div>
            <div class="content">
              <b-table :data="data" :loading="preLoading" :mobile-cards="false">
                <b-table-column label="Товар" v-slot="props">
                  <nuxt-link :to="'/auction/lot/' + props.row.lot.id">{{
                    props.row.lot.loot.name
                  }}</nuxt-link>
                </b-table-column>
                <b-table-column label="Ставка" v-slot="props">
                  {{ props.row.price }} {{ $t("global")["currency"] }}.
                </b-table-column>
                <b-table-column
                  field="delivery"
                  :label="$t('profile')['delivery_status']"
                  v-slot="props"
                >
                  <b-tag type="is-info" v-if="props.row.status == null">
                    {{ $t("auction")["status_time"] }}
                  </b-tag>
                  <b-tag type="is-danger" v-else-if="props.row.status == 'lose'"
                    >{{ $t("auction")["status_lose"] }}</b-tag
                  >
                  <b-tag
                    type="is-success"
                    v-else-if="props.row.status == 'success'"
                    >{{ $t("auction")["status_win"] }}</b-tag
                  >
                </b-table-column>
                <b-table-column :label='$t("auction")["finished"]' v-slot="props">
                  <no-ssr>
                    <vac :end-time="Number(props.row.lot.finished) * 1000">
                      <template v-slot:process="{ timeObj }">
                        {{ timeObj.h }}:{{ timeObj.m }}:{{ timeObj.s }}
                      </template>
                      <span slot="finish"
                        ><template v-if="props.row.lot.finish == null"
                          >{{ $t("auction")["status_process"] }}</template
                        >
                        <template v-else>{{ $t("auction")["status_finish"] }}</template></span
                      >
                    </vac>
                  </no-ssr>
                </b-table-column>
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  head() {
    return {
      title: `${this.$t('menu')['auction']} » ${process.env.PARTNER}`,
    };
  },
  data() {
    return {
      avatar:
        process.env.API_URL +
        "/api/v1/avatar/" +
        this.$auth.user.id +
        "?" +
        this.$auth.user.updated_at,
      loading: false,
      data: [],
      checkedRows: [],
      preLoading: true,
    };
  },
  methods: {
    async Table() {
      this.preLoading = true;
      await this.$axios.get("/api/v1/auction/personal").then((response) => {
        this.data = response.data;
        this.preLoading = false;
      });
    },
    async FileUpload() {
      let formData = new FormData();
      formData.append("file", this.$refs.file.files[0]);
      this.$axios
        .post("/api/v1/auth/imageupload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          (async () => {
            await this.$auth.fetchUser();
            this.loading1 = false;
            this.avatar =
              process.env.API_URL +
              "/api/v1/avatar/" +
              this.$auth.user.id +
              "?" +
              this.$auth.user.updated_at;
            this.$children.forEach((value, index) => {
              if (value.$options._componentTag == "HeaderMini") {
                this.$children[index].avatar =
                  process.env.API_URL +
                  "/api/v1/avatar/" +
                  this.$auth.user.id +
                  "?" +
                  this.$auth.user.updated_at;
              }
            });
            this.$buefy.toast.open({
              message: this.$t("profile")["avatar_success"],
              type: "is-success",
            });
          })();
        })
        .catch((e) => {
          this.$buefy.toast.open({
            message: this.$t("profile")["avatar_error"],
            type: "is-danger",
          });
        });
    },
  },
  mounted() {
    this.Table();
    this.socket = this.$nuxtSocket({
      channel: `/`,
    });
    this.socket.on(`auction:AuctionLot`, (msg, cb) => {
      var value = this.data.find((e) => e.lot.id === msg.data.id);
      var key = Object.keys(this.data).find((key) => this.data[key] === value);
      if (typeof key !== "undefined") {
        this.Table();
        (async () => {
          await this.$auth.fetchUser();
        })();
      }
    });
  },
};
</script>