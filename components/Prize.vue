<template>
  <div class="prize">
    <p class="title">{{ $t('box')['prize_title'] }}</p>
    <p class="prize">{{ $parent.$parent.prize.item["name"] }}</p>
    <p class="price">
      {{ $t('global')['cost'] }}: {{ $parent.$parent.prize.item["price"] }} {{ $t('global')['currency'] }}
    </p>
    <div class="prize-icon">
      <img
        :src="
          $parent.$parent.backend +
          '/images/' +
          $parent.$parent.prize.item['image']
        "
      />
    </div>
    <div v-if="!$auth.loggedIn">
      <div class="info"> 
        {{ $t('box')['demo_info'] }}
      </div>
      <b-button
        class="button is-primary"
        @click="registerModal"
        :label="$t('auth')['auth']"
      />
    </div>
    <div v-else-if="$parent.$parent.prize.type == 'demo'" class="info">
      {{$t('box')['demo_info']}}
    </div>
    <div v-else>
      <b-button
        class="button is-primary"
        @click="sell"
        :label="$t('box')['trade']+ ' ' + $parent.$parent.prize.item['price'] + ' ' + $t('global')['currency']"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    registerModal() {
      this.$parent.$parent.rollDeactive();
      this.$registerModal(this);
      this.$emit("close");
    },
    sell() {
      this.$buefy.dialog.confirm({
        message: this.$t('global')['confirm'],
        onConfirm: async () => {
          this.loading = true;
          await this.$axios
            .get("/api/v1/cart/sell/" + this.$parent.$parent.prize.item["id"])
            .then((response) => {
              (async () => {
                await this.$auth.fetchUser();
              })();
              this.loading = false;
              this.$parent.$parent.rollDeactive();
              this.$parent.$parent.$buefy.notification.open({
                duration: 5000,
                message: `${this.$t('box')['trade_success']} "${this.$parent.$parent.prize.item["name"]}" ${ this.$t('preposition')['behind']} ${this.$parent.$parent.prize.item["price"]} ${ this.$t('global')['currency']}`,
                position: "is-bottom-right",
                type: "is-success",
                hasIcon: true,
              });
              this.$emit("close");
            })
            .catch((response) => {
              (async () => {
                await this.$auth.fetchUser();
              })();
              this.loading = false;
              this.$parent.$parent.rollDeactive();
              this.$emit("close");
            });
        },
      });
    },
  },
};
</script>