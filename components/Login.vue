<template>
  <div class="card modal-auth">
    <div class="columns form-content">
      <div class="column">
        <a class="change" @click="registerModal"
          >{{ $t("auth")["register"] }} <b-icon icon="account"></b-icon
        ></a>
        <div class="left-content">
          <h3>{{ $t("auth")["auth"] }}</h3>
          <ValidationObserver v-slot="{ invalid }">
            <form>
              <ValidationProvider
                rules="required|email"
                name="Email"
                v-slot="{ errors, valid }"
              >
                <b-field
                  label="Email"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input
                    :placeholder="$t('fields')['email_placeholder']"
                    type="email"
                    name="email"
                    v-model="form.email"
                  ></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider
                rules="required"
                :name="$t('auth')['password']"
                v-slot="{ errors, valid }"
              >
                <b-field
                  :label="$t('fields')['password']"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input
                    :placeholder="$t('fields')['password_placeholder']"
                    type="password"
                    v-model="form.password"
                    name="password"
                    password-reveal
                  ></b-input>
                </b-field>
              </ValidationProvider>
              <b-button
                class="button is-primary"
                @click="login"
                :disabled="invalid"
                :loading="loading"
                :label="$t('auth')['login']"
              />
            </form>
          </ValidationObserver>
        </div>
      </div>
      <div class="column right-content">
        <h3>{{ $t("auth")["social_title"] }}</h3>
        <SocialLogin />
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import SocialLogin from "~/components/SocialLogin";

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    SocialLogin,
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      loading: false,
    };
  },
  methods: {
    async login() {
      this.error = null;
      this.loading = true;
      await this.$auth
        .loginWith("laravelJWT", {
          data: {
            ...this.form,
          },
        })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t("auth")["success_login"],
            type: "is-success",
          });
          this.$emit("close");
        })
        .catch((e) => {
          if (e.response.errror == "Unauthorized") {
            this.$buefy.toast.open({
              message: this.$t("auth")["error_login"],
              type: "is-danger",
            });
          } else {
            this.$buefy.toast.open({
              message: this.$t("auth")["error_login_2"],
              type: "is-danger",
            });
          }
          this.loading = false;
        });
    },
    registerModal() {
      this.$emit("close");
      this.$registerModal(this);
    },
  },
};
</script>

