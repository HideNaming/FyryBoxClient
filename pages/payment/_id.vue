<template>
  <div>
    <HeaderMini />
    <div class="container payments-cont">
      <div class="columns payments-pg">
        <div class="column is-one-quarter info">
          <div class="head">Ваш заказ:</div>
          <div class="body">Пополнение счёта #{{ order.id }}</div>
          <div class="head">Сумма к оплате:</div>
          <div class="body">{{ order.amount }} руб.</div>
          <div class="head">Кэшбек:</div>
          <div class="body">{{ order.cashback }} руб.</div>
        </div>
        <div class="column payment-dark methods">
          <div class="head">Пожалуйста, выберите удобный способ оплаты</div>
          <div class="pay-cats">
            <div
              @click="cat = 'popular'"
              :class="['popular' === cat ? 'active' : '']"
            >
              Популярное
            </div>
            <div @click="cat = null" :class="[null === cat ? 'active' : '']">
              Все способы
            </div>
            <div
              @click="cat = 'money'"
              :class="['money' === cat ? 'active' : '']"
            >
              Электронные деньги
            </div>
            <div
              @click="cat = 'crypto'"
              :class="['crypto' === cat ? 'active' : '']"
            >
              Криптовалюта
            </div>
          </div>
          <transition-group name="list-complete" class="pay-methods" tag="div">
            <div
              v-for="(item, index) in methods"
              :key="item.name"
              @click="method = index"
              :class="[index == method ? 'active' : '']"
              v-if="item.cats.includes(cat) || cat == null"
            >
              <img :src="'/payments/' + item.image" />
            </div>
          </transition-group>
        </div>
      </div>
      <div class="columns" v-if="method != null">
        <div class="payment-dark payment-down">
          <div class="text">Вы выбрали: {{ methods[method].name }}</div>
          <b-button class="action" @click="redirect" :loading="loading"
            >Перейти к оплате</b-button
          >
        </div>
      </div>
    </div>
    <b-loading
      :is-full-page="true"
      v-model="preLoading"
      :can-cancel="false"
    ></b-loading>
  </div>
</template>
<script>
export default {
  methods: {
    async redirect() {
      this.loading = true;
      await this.$axios
        .$post("/api/v1/payment/link", {
          method: this.methods[this.method].method,
          id: this.order.id,
          payment_id: this.methods[this.method].id,
        })
        .then((response) => {
          this.loading = false;
          window.location.replace(response);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  data() {
    return {
      loading: false,
      order: [],
      cat: null,
      preLoading: true,
      method: null,
      methods: [
        {
          name: "VISA, MasterCard",
          image: "cards.png",
          method: "qiwi",
          id: "card",
          cats: ["popular"],
        },
        {
          name: "Qiwi кошелёк",
          image: "qiwi.png",
          method: "qiwi",
          id: "qw",
          cats: ["money", "popular"],
        },
        {
          name: "Yandex Деньги/ЮMoney",
          image: "yandex.png",
          method: "freekassa",
          id: "45",
          cats: ["money", "popular"],
        },
        {
          name: "Сбербанк Онлайн",
          image: "sberbank.png",
          method: "freekassa",
          id: "80",
          cats: ["money"],
        },
        {
          name: "Bitcoin",
          image: "bitcoin.png",
          method: "freekassa",
          id: "116",
          cats: ["crypto"],
        },
        {
          name: "Etherium",
          image: "etherium.png",
          method: "freekassa",
          id: "163",
          cats: ["crypto"],
        },
        {
          name: "Tether",
          image: "tether.png",
          method: "freekassa",
          id: "181",
          cats: ["crypto"],
        },
        {
          name: "Monero",
          image: "monero.png",
          method: "freekassa",
          id: "172",
          cats: ["crypto"],
        },
        {
          name: "Dogecoin",
          image: "dogecoin.png",
          method: "freekassa",
          id: "168",
          cats: ["crypto"],
        },
        {
          name: "Steam Pay",
          image: "steam.png",
          method: "freekassa",
          id: "154",
          cats: ["money", "popular"],
        },
        {
          name: "Мегафон",
          image: "megafon.png",
          method: "freekassa",
          id: "82",
          cats: ["money"],
        },
        {
          name: "Beeline",
          image: "beeline.png",
          method: "freekassa",
          id: "83",
          cats: ["money"],
        },
      ],
    };
  },
  head() {
    return {
      title: `Пополнение баланса » ${process.env.PARTNER}`,
    };
  },
  async fetch() {
    this.order = await this.$http.$get(
      "/api/v1/payment/" + this.$route.params.id
    );
    this.preLoading = false;
  },
  fetchOnServer: true,
};
</script>