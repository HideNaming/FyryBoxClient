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
              <a class="navigate active">{{ $t("profile")["profile"] }}</a>
              <nuxt-link class="navigate" to="/profile/auction">
                {{ $t("menu")["auction"] }}
              </nuxt-link>
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
              <div class="columns">
                <ValidationObserver
                  v-slot="{ invalid }"
                  ref="formValidatorData"
                  tag="form"
                  class="column is-half"
                >
                  <div class="title">{{ $t("profile")["title_info"] }}</div>
                  <ValidationProvider
                    rules="required|max:24"
                    :name="$t('fields')['fullname']"
                    v-slot="{ errors, valid }"
                    vid="name"
                  >
                    <b-field
                      :type="{ 'is-danger': errors[0], 'is-success': valid }"
                      :message="errors"
                      :label="$t('fields')['fullname']"
                    >
                      <b-input v-model="form1.name"></b-input>
                    </b-field>
                  </ValidationProvider>
                  <b-field :label="$t('fields')['address']">
                    <b-input v-model="form1.address"></b-input>
                  </b-field>
                  <b-field :label="$t('fields')['city']">
                    <b-input v-model="form1.city"></b-input>
                  </b-field>
                  <b-field :label="$t('fields')['region']">
                    <b-input v-model="form1.region"></b-input>
                  </b-field>
                  <b-field :label="$t('fields')['country']">
                    <b-input v-model="form1.country"></b-input>
                  </b-field>
                  <b-field :label="$t('fields')['index']">
                    <b-input v-model="form1.index"></b-input>
                  </b-field>
                  <ValidationProvider
                    rules="required|email"
                    name="Email"
                    vid="email"
                    v-slot="{ errors, valid }"
                  >
                    <b-field
                      label="Email"
                      :type="{ 'is-danger': errors[0], 'is-success': valid }"
                      :message="errors"
                    >
                      <b-input v-model="form1.email"></b-input>
                    </b-field>
                  </ValidationProvider>
                  <b-button
                    @click="changeData()"
                    :loading="loading1"
                    :disabled="invalid"
                    class="button is-primary"
                    :label="$t('profile')['action_save']"
                  />
                </ValidationObserver>
                <ValidationObserver
                  v-slot="{ invalid }"
                  ref="formValidatorData"
                  tag="form"
                  class="column is-half"
                >
                  <div class="title">{{ $t("profile")["title_safety"] }}</div>
                  <ValidationProvider
                    rules="required"
                    :name="$t('fields')['password_old']"
                    vid="password"
                    v-slot="{ errors, valid }"
                  >
                    <b-field
                      :type="{ 'is-danger': errors[0], 'is-success': valid }"
                      :message="errors"
                      :label="$t('fields')['password_old']"
                    >
                      <b-input
                        type="password"
                        v-model="form2.password"
                        placeholder="••••••••••••••••••••••••"
                        password-reveal
                      ></b-input>
                    </b-field>
                  </ValidationProvider>
                  <ValidationProvider
                    rules="required|min:6"
                    :name="$t('fields')['password_new']"
                    vid="new_password"
                    v-slot="{ errors, valid }"
                  >
                    <b-field
                      :type="{ 'is-danger': errors[0], 'is-success': valid }"
                      :message="errors"
                      :label="$t('fields')['password_new']"
                    >
                      <b-input
                        type="password"
                        v-model="form2.new_password"
                        placeholder="••••••••••••••••••••••••"
                        password-reveal
                      ></b-input>
                    </b-field>
                  </ValidationProvider>
                  <ValidationProvider
                    rules="required|confirmed:new_password"
                    :name="$t('fields')['password_new_confirm']"
                    vid="confirm_password"
                    v-slot="{ errors, valid }"
                  >
                    <b-field
                      :type="{ 'is-danger': errors[0], 'is-success': valid }"
                      :message="errors"
                      :label="$t('fields')['password_new_confirm']"
                    >
                      <b-input
                        type="password"
                        v-model="form2.confirm_password"
                        placeholder="••••••••••••••••••••••••"
                        password-reveal
                      ></b-input>
                    </b-field>
                  </ValidationProvider>
                  <b-button
                    :loading="loading2"
                    @click="changePassword"
                    :disabled="invalid"
                    class="button is-primary"
                    :label="$t('profile')['action_change']"
                  />
                </ValidationObserver>
              </div>
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
      title: `${this.$t('menu')['profile']} » ${process.env.PARTNER}`,
    };
  },
  data() {
    return {
      form1: {
        name: this.$auth.user.name,
        email: this.$auth.user.email,
        address: this.$auth.user.address,
        city: this.$auth.user.city,
        region: this.$auth.user.region,
        country: this.$auth.user.country,
        index: this.$auth.user.index,
      },
      backend: process.env.API_URL,
      loading1: false,
      form2: {
        password: null,
        new_password: null,
        confirm_password: null,
      },
      loading2: false,
    };
  },
  methods: {
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
    async changeData() {
      this.loading1 = true;
      await this.$axios
        .$post("/api/v1/auth/changedata", this.form1)
        .then(() => {
          (async () => {
            await this.$auth.fetchUser();
            this.loading1 = false;
            this.$buefy.toast.open({
              message: this.$t("profile")["save_success"],
              type: "is-success",
            });
          })();
        })
        .catch((e) => {
          this.$refs.formValidatorData.setErrors(e.response.data.errors);
          this.loading1 = false;
        });
    },
    async changePassword() {
      this.loading2 = true;
      await this.$axios
        .$post("/api/v1/auth/changepassword", this.form2)
        .then(() => {
          (async () => {
            await this.$auth
              .logout()
              .then(() => {
                this.$auth.logout();
                this.$store.commit("PERMISSIONS", []);
                this.$buefy.toast.open({
                  message: this.$t("profile")["change_success"],
                  type: "is-success",
                });
              })
              .catch((e) => {});
          })();
        })
        .catch((e) => {
          this.$refs.formValidatorData.setErrors(e.response.data.errors);
          this.loading2 = false;
        });
    },
  },
};
</script>