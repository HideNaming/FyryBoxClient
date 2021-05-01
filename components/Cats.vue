<template>
  <div>
    <div class="cats">
      <div class="container">
        <div class="cats-left">
          <h1>{{$t('box')['cats_title']}}</h1>
          <div class="cats-list">
            <div
              v-if="!preLoading"
              class="block"
              :class="[null === filterCategory ? 'active' : '']"
              @click="filter(null)"
            >
              <img src="~assets/icons/all.svg" /><br />
              <span>{{$t('box')['cats']['all']}}</span>
            </div>
            <div
              class="block"
              v-for="item in categories"
              :key="item.id"
              :class="[item.id === filterCategory ? 'active' : '']"
              @click="filter(item.id)"
            >
              <img :src="backend + '/images/' + item.image" /><br />
              <span>{{$t('box')['cats'][item.name]}}</span>
            </div>
            <b-skeleton
              v-if="preLoading"
              :count="3"
            ></b-skeleton>
          </div>
        </div>
      </div>
    </div>
    <div class="boxes">
      <b-loading :is-full-page="false" v-model="preLoading"></b-loading>
      <div
        v-for="item in sortBoxes"
        :key="item.id"
        :class="'box ' + item.category_id"
      >
        <span v-if="item.sale > 0" class="sale">-{{ item.sale }}%</span>
        <img :src="backend + '/images/' + item.image" />
        <div class="info">
          <b>{{ $t('box')['boxes'][item.name] }}</b
          ><br />
          <span>
            <b>{{ item.price - (item.price * item.sale) / 100 }}</b> {{$t('global')['currency']}}
            <sup v-if="item.sale > 0">{{ item.price }} {{$t('global')['currency']}}</sup>
          </span>
          <nuxt-link :to="'/box/' + item.slug" no-prefetch>
            <div class="action">{{$t('box')['open']}}</div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      boxes: [],
      sortBoxes: [],
      filterCategory: null,
      backend: process.env.API_URL,
      stats: {
        gift: null,
      },
      preLoading: true,
    };
  },
  methods: {
    filter(filter) {
      this.filterCategory = filter;
      if (filter == null) return (this.sortBoxes = this.boxes);
      this.sortBoxes = this.boxes.filter((v) => v.category_id === filter);
    },
  },
  async fetch() {
    this.boxes = this.sortBoxes = await this.$http.$get("/api/v1/boxes/");
    this.categories = await this.$http.$get("/api/v1/categories/");
    this.preLoading = false;
    if (this.$route.query.otzivi == 'true') {
      this.$scrollTo('#comments_otzivi')
    }
  },
  fetchOnServer: true,
};
</script>