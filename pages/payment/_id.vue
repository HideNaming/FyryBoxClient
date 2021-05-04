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
<style lang="sass">
.list-complete-item
    transition: all 1s
    display: inline-block
    margin-right: 10px

.list-complete-enter, .list-complete-leave-to, .list-complete-leave-active
    opacity: 0
    transform: translateY(30px)

.list-complete-leave-active
    position: absolute

.payments-cont
    margin-bottom: 200px
.payments-pg
    background: #2B2B2B
    box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.1)
    border-radius: 5px 5px 0 0
    margin-top: 10px
    .columns
        margin: 0
    .column
        padding: 0
    .methods
        .head
            margin: 20px 50px
            font-weight: bold
            font-size: 16px
            text-transform: uppercase
            color: #FFFFFF
            @media screen and (max-width: 600px)
                padding-top: 20px
                margin-top: 0
        .pay-methods
            display: flex
            flex-wrap: wrap
            justify-content: center
            padding: 10px
            div
                background: #2B2B2B
                box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.1)
                border-radius: 5px
                width: 200px
                height: 120px
                margin: 10px 15px
                display: flex
                justify-content: center
                align-items: center
                cursor: pointer
                transition-duration: .2s
                border: 2px solid rgba(0, 0, 0, 0)
                box-sizing: border-box
                @media screen and (max-width: 600px)
                    width: 160px
                    height: 90px
                img
                    max-width: 80%
                    marhin-left: 10px
                &:hover,
                &.active
                    background: linear-gradient(90deg, rgba(255, 207, 0, 0.53) 0%, rgba(0, 0, 0, 0) 100%), #2B2B2B
                    border: 2px solid #FFCF00
                    box-sizing: border-box
                    box-shadow: 0px 0px 20px 2px rgba(255, 207, 0, 0.1)
                    border-radius: 5px
        .pay-cats
            background: #2B2B2B
            display: flex
            flex-wrap: wrap
            justify-content: center
            div
                background: rgba(0, 0, 0, 0.2)
                color: rgba(255,255,255,0.75)
                border-radius: 20px 5px
                padding: 5px 20px
                font-size: 16px
                font-weight: bold
                text-transform: uppercase
                cursor: pointer
                margin: 10px
                &:hover,
                &.active
                    background: linear-gradient(271.83deg, #FF8F00 0%, #FFCF00 100%)
                    color: rgba(0,0,0,0.75)
                @media screen and (max-width: 600px)
                    font-size: 14px
    .info
        padding: 40px 30px
        .head
            font-weight: bold
            font-size: 18px
            text-transform: uppercase
            color: #FFFFFF
        .body
            font-weight: bold
            font-size: 14px
            color: #FF8F00
            margin-bottom: 20px
.payment-dark
    background: #252525
.payment-down
    border-radius: 0 0 5px 5px
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    padding: 10px
    padding-left: calc(25% + 40px)
    @media screen and (max-width: 600px)
        padding-left: 0
        flex-wrap: wrap
    .text
        font-weight: bold
        font-size: 20px
        color: #FFFFFF
        margin-right: 40px
        @media screen and (max-width: 600px)
            margin-right: 0
            margin-bottom: 10px
    .action
        background: linear-gradient(92.92deg, #FF8F00 0%, #FFCF00 100%)
        border-radius: 10px
        font-weight: bold
        font-size: 20px
        text-transform: uppercase
        color: rgba(0, 0, 0, 0.75)
        padding: 5px 20px
        cursor: pointer
        transition-duration: .2s
        border: none
        &:hover
            filter: brightness(110%)
</style>
