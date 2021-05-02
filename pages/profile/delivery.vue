<template>
  <div>
    <HeaderMini />
    <div class="container">
      <div class="columns profile">
        <div class="column is-one-quarter">
          <div class="block">
            <div class="content">
              <div
                v-bind:style="{ 'background-image': 'url(' + `${backend}/api/v1/avatar/${$auth.user.id}?${$auth.user.updated_at}` + ')' }"
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
              <nuxt-link class="navigate" to="/profile/auction">
                {{ $t("menu")["auction"] }}
              </nuxt-link>
              <a class="navigate active">{{ $t("profile")["delivery"] }}</a>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="block">
            <div class="head"></div>
            <div class="content">
              <b-table
                :data="data"
                :loading="preLoading"
                checkable
                :mobile-cards="false"
                :is-row-checkable="(row) => row.delivery === null"
                :checked-rows.sync="checkedRows"
              >
                <b-table-column
                  sortable
                  field="id"
                  label="ID"
                  v-slot="props"
                  width="60"
                  numeric
                >
                  {{ props.row.id }}
                </b-table-column>
                <b-table-column
                  sortable
                  field="name"
                  :label="$t('profile')['delivery_name']"
                  v-slot="props"
                >
                  {{ props.row.name }}
                </b-table-column>
                <b-table-column
                  field="delivery"
                  :label="$t('profile')['delivery_status']"
                  v-slot="props"
                >
                  <b-tag type="is-info" v-if="props.row.delivery == null">{{
                    $t("profile")["delivery_null"]
                  }}</b-tag>
                  <b-tag
                    type="is-warning"
                    v-else-if="props.row.delivery == 'process'"
                    >{{ $t("profile")["delivery_process"] }}</b-tag
                  >
                  <b-tag
                    type="is-success"
                    v-else-if="props.row.delivery == 'success'"
                    >{{ $t("profile")["delivery_success"] }}</b-tag
                  >
                  <b-tag type="is-info" v-else
                    >{{ $t("profile")["delivery_truck"] }}:
                    {{ props.row.delivery }}</b-tag
                  >
                </b-table-column>
              </b-table>
              <b-button
                @click="DeliVery"
                :disabled="checkedRows.length == 0"
                :loading="loading"
                class="button is-primary"
                label="Заказать доставку"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Payment from "~/components/Payment";
export default {
  middleware: "auth",
  head() {
    return {
      title: `${this.$t('menu')['delivery']} » ${process.env.PARTNER}`,
    };
  },
  data() {
    return {
      backend: process.env.API_URL,
      loading: false,
      data: [],
      checkedRows: [],
      preLoading: true,
    };
  },
  methods: {
    DeliVery() {
      if (
        this.$auth.user.address == null ||
        this.$auth.user.city == null ||
        this.$auth.user.country == null ||
        this.$auth.user.index == null
      ) {
        return this.$buefy.notification.open({
          duration: 5000,
          message: this.$t("profile")["delivery_error_1"],
          position: "is-bottom-right",
          type: "is-danger",
          hasIcon: true,
        });
      }
      this.$buefy.dialog.confirm({
        title: this.$t("global")["confirm_title"],
        message: this.$t("profile")["delivery_message"],
        confirmText: this.$t("profile")["delivery_confirm"],
        type: "is-warning",
        onConfirm: async () => {
          this.loading = true;
          await this.$axios
            .$post("/api/v1/cart/delivery", { data: this.checkedRows })
            .then(() => {
              (async () => {
                await this.$auth.fetchUser();
                this.loading = false;
                this.Table();
                this.$buefy.toast.open({
                  message: this.$t("profile")["delivery_success"],
                  type: "is-success",
                });
              })();
            })
            .catch((e) => {
              if (e.response.data.error == "Count") {
                this.$buefy.notification.open({
                  duration: 5000,
                  message: this.$t("profile")["delivery_error_2"],
                  position: "is-bottom-right",
                  type: "is-danger",
                  hasIcon: true,
                });
              } else {
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
              }
              this.loading = false;
            });
        },
      });
    },
    async Table() {
      this.preLoading = true;
      await this.$axios.get("/api/v1/cart/list").then((response) => {
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
  },
};
</script>