<template>
  <div class="footer-frame">
    <div class="head">
      <div class="container">
        <h4>{{$t('footer')['payment']}}</h4>
        <div class="payments">
          <div><img src="/images/master-card.png" /></div>
          <div><img src="/images/visa.png" /></div>
          <div><img src="/images/qiwi.png" /></div>
          <div><img src="/images/yandex.png" /></div>
          <div><img src="/images/mobile.png" /></div>
          <div><img src="/images/free-kassa.png" /></div>
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
              <a href="#"><img src="/icons/vk.svg" /></a>
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