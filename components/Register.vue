<template>
  <div class="card modal-auth">
    <div class="columns form-content">
      <div class="column">
        <a class="change" @click="loginModal"
          >{{ $t("auth")["login"] }} <b-icon icon="account"></b-icon
        ></a>
        <div class="left-content">
          <h3>{{ $t("auth")["register"] }}</h3>
          <ValidationObserver v-slot="{ invalid }" ref="formValidator">
            <form>
              <ValidationProvider
                rules="required|max:24"
                :name="$t('fields')['name']"
                v-slot="{ errors, valid }"
                vid="name"
              >
                <b-field
                  :label="$t('fields')['name']"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input
                    v-model="form.name"
                    :placeholder="$t('fields')['name_placeholder']"
                    type="text"
                  ></b-input>
                </b-field>
              </ValidationProvider>
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
                  <b-input
                    :placeholder="$t('fields')['email_placeholder']"
                    type="email"
                    v-model="form.email"
                  ></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider
                rules="required|min:6|max:16"
                :name="$t('fields')['password']"
                v-slot="{ errors, valid }"
                vid="password"
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
                    password-reveal
                  ></b-input>
                </b-field>
              </ValidationProvider>
              <b-button
                @click="register"
                class="button is-primary"
                :loading="loading"
                :disabled="invalid"
                :label="$t('auth')['register']"
              />
            </form>
          </ValidationObserver>
        </div>
      </div>
      <div class="column right-content">
        <h3>{{ $t("auth")["social_title"] }}</h3>
        <p>{{ $t("auth")["social_desc"] }}</p>
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
        name: "",
        email: "",
        password: "",
      },
      loading: false,
    };
  },
  methods: {
    async register() {
      this.error = null;
      this.loading = true;
      try {
        await this.$axios
          .$post("/api/v1/auth/register", {
            ...this.form,
            password_confirmation: this.form.password,
          })
          .then(() => {
            this.$auth.loginWith("laravelJWT", { data: this.form }).then(() => {
              this.$buefy.toast.open({
                message: this.$t("auth")["success_register"],
                type: "is-success",
              });
              this.$parent.avatar =
                process.env.API_URL +
                "/api/v1/avatar/" +
                this.$auth.user.id +
                "?" +
                this.$auth.user.updated_at;
              this.$emit("close");
            });
          })
          .catch((e) => {
            this.$refs.formValidator.setErrors(e.response.data.errors);
            this.loading = false;
          });
      } catch (error) {
        console.log("Login error:", error);
      }
    },
    loginModal() {
      this.$emit("close");
      this.$loginModal(this);
    },
  },
};
</script>
