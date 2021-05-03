<template>
  <div>
    <div class="payment-core">
      <div class="title">Пополнение баланса</div>
      <div class="content">
        <ValidationObserver ref="observer" v-slot="{ invalid }">
          <div
            class="first-bonus"
            v-if="
              new Date($auth.user.created_at).getTime() + 43200000 >=
                new Date().getTime() && $auth.user.orders.length == 0
            "
          >
            <div class="info">
              <i>+20% к сумме пополнения</i> - ваш персональный<br />
              бонус на первый депозит
            </div>
            <no-ssr>
              <div class="timer-frame">
                <div class="name">Бонус действителен</div>
                <div class="timer">
                  <img src="/icons/watch.svg" />
                  <vac
                    :end-time="
                      new Date($auth.user.created_at).getTime() + 43200000
                    "
                  >
                    <template v-slot:process="{ timeObj }">
                      <span>{{ timeObj.h }}<i>Часы</i></span
                      >:<span>{{ timeObj.m }}<i>Мин</i></span
                      >:<span>{{ timeObj.s }}<i>Сек</i></span>
                    </template>
                  </vac>
                </div>
              </div>
            </no-ssr>
          </div>
          <div class="columns">
            <div class="column is-half">
              <form>
                <ValidationProvider
                  rules="required|numeric|min_value:1|max_value:100000"
                  name="ПОПОЛНЯЕТЕ"
                  v-slot="{ errors, valid }"
                >
                  <b-field
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    :message="errors"
                    label="ПОПОЛНЯЕТЕ"
                  >
                    <b-input
                      v-model="payment"
                      @input="calculate_event()"
                      @change="calculate_event()"
                    ></b-input>
                  </b-field>
                </ValidationProvider>
              </form>
            </div>
            <div class="column">
              <div class="payment-bonus-title">Получаете</div>
              <div class="payment-bonus">
                <div class="amount">{{ calculate.all }} руб</div>
                <span>Бонус +{{ calculate.bonus }} руб</span>
              </div>
            </div>
          </div>
          <div class="bonuses">
            <div
              v-for="bonus in bonuses"
              class="bonus"
              :key="bonus.input"
              @click="
                payment = bonus.input;
                calculate_event();
              "
            >
              От {{ bonus.input }} руб
              <div class="percent">+{{ bonus.bonus }}%</div>
            </div>
          </div>
          <div class="action">
            <b-button
              class="button is-primary"
              @click="paymentMethod()"
              :disabled="invalid"
              :loading="loading"
              label="Пополнить"
            />
          </div>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import vueAwesomeCountdown from "vue-awesome-countdown";
Vue.use(vueAwesomeCountdown, "vac");

export default {
  data() {
    return {
      payment: 100,
      calculate: {
        all: 0,
        bonus: 0,
      },
      loading: false,
      bonuses: [
        {
          input: 300,
          bonus: 5,
        },
        {
          input: 500,
          bonus: 10,
        },
        {
          input: 1000,
          bonus: 20,
        },
        {
          input: 2000,
          bonus: 30,
        },
        {
          input: 3000,
          bonus: 40,
        },
        {
          input: 5000,
          bonus: 50,
        },
      ],
    };
  },
  methods: {
    async paymentMethod() {
      this.loading = true;

      await this.$axios
        .$post("/api/v1/payment", {
          amount: this.payment,
          partner: process.env.PARTNER,
        })
        .then((response) => {
          this.loading = false;
          window.location.replace(response);
        })
        .catch(() => {
          this.loading = false;
        });
    },

    calculate_event() {
      var calc = this.payment;
      var bonus_percent = 0;
      setTimeout(async () => {
        const isValid = await this.$refs.observer.validate();
        if (isValid) {
          this.bonuses.forEach((value) => {
            if (this.payment >= value.input) bonus_percent = value.bonus / 100;
          });
          if (
            new Date(this.$auth.user.created_at).getTime() + 43200000 >=
              new Date().getTime() &&
            this.$auth.user.orders.length == 0
          ) {
            bonus_percent += 0.2;
          }

          calc = Number(calc * bonus_percent) + Number(calc);

          this.calculate.bonus = parseFloat((calc - this.payment).toFixed(2));
          this.calculate.all = calc.toFixed(2);
        }
      }, 50);
    },
  },
  mounted() {
    this.calculate_event();
  },
};
</script>

