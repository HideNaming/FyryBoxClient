<template>
  <div class="footer-frame">
    <div class="head">
      <div class="container">
        <h4>{{$t('footer')['payment']}}</h4>
        <div class="payments">
          <div><img src="~assets/images/master-card.png" /></div>
          <div><img src="~assets/images/visa.png" /></div>
          <div><img src="~assets/images/qiwi.png" /></div>
          <div><img src="~assets/images/yandex.png" /></div>
          <div><img src="~assets/images/mobile.png" /></div>
          <div><img src="~assets/images/free-kassa.png" /></div>
        </div>
        <div class="columns content">
          <div class="column is-three-fifths cats-left">
            <div class="links">
              <a @click="Garantii">{{ $t("menu")["garantii"] }}</a>
              <a @click="Agreement">{{$t('footer')['agreement']}}</a>
              <nuxt-link to="/auction">{{ $t("menu")["auction"] }}</nuxt-link>
            </div>
          </div>
          <div class="column">
            <div class="social">
              <a href="#"><img src="~assets/icons/vk.svg" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="end container">
      {{$t('footer')['copyright']}}
    </div>
  </div>
</template>

<script>
import Agreement from "~/components/Agreement";
import Garantii from "~/components/Garantii";

export default {
  methods: {
    Agreement() {
      this.$buefy.modal.open({
        parent: this,
        component: Agreement,
      });
    },
    Garantii() {
      this.$buefy.modal.open({
        parent: this,
        component: Garantii,
      });
    },
  },
};
</script>