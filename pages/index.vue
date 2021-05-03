<template>
  <div>
    <Header />
    <Cats />
    <div class="delivery">
      <img src="/icons/truck.svg" />
      <span
        >{{ $t("main")["delivery_desc_1"] }}
        <span class="orange">{{ $t("main")["delivery_desc_2"] }}</span></span
      >
    </div>
    <div class="container" id="comments_otzivi">
      <div class="columns info-index">
        <div class="column is-half">
          <h3>Отзывы</h3>
          <div class="comments">
            <div class="content" id="comments">
              <div class="comment-wrapper">
                <img class="avatar" src="/images/avatar.svg" />
                <div class="comment">
                  <div class="name">Милан Васильев | 3 дня назад</div>
                  <div class="text">спасибки вам)</div>
                  <div class="media"></div>
                </div>
              </div>
              <div class="comment-wrapper">
                <img class="avatar" src="/images/avatar.svg" />
                <div class="comment">
                  <div class="name">Дина Емельянова | 3 дня назад</div>
                  <div class="text">все пришло спасибо xD</div>
                  <div class="media"></div>
                </div>
              </div>
              <div class="comment-wrapper">
                <img class="avatar" src="/avatars/3.jpg" />
                <div class="comment">
                  <div class="name">Алёна Лебедева | 2 дня назад</div>
                  <div class="text">Отличный сайт</div>
                  <div class="media"></div>
                </div>
              </div>
              <div class="comment-wrapper">
                <img class="avatar" src="/images/avatar.svg" />
                <div class="comment">
                  <div class="name">Руслан Молчанов | 2 дня назад</div>
                  <div class="text">спасибки вам)</div>
                  <div class="media">
                    <img src="/media/2.jpg" />
                  </div>
                </div>
              </div>
              <div class="comment-wrapper">
                <img class="avatar" src="/avatars/2.jpg" />
                <div class="comment">
                  <div class="name">Захар Суворов | 2 дня назад</div>
                  <div class="text">Сайт клёвый</div>
                  <div class="media"></div>
                </div>
              </div>
              <div class="comment-wrapper">
                <img class="avatar" src="/images/avatar.svg" />
                <div class="comment">
                  <div class="name">Абрам Васильев | День назад</div>
                  <div class="text">
                    Это лучший сайт!!!!! Доставили за 10 дней!!
                  </div>
                  <div class="media">
                    <img src="/media/iphone.jpg" />
                  </div>
                </div>
              </div>
              <div class="comment-wrapper">
                <img class="avatar" src="/images/avatar.svg" />
                <div class="comment">
                  <div class="name">Гаврил Сысоев | 8 часов назад</div>
                  <div class="text">я согласен, прикольный сайт</div>
                  <div class="media"></div>
                </div>
              </div>
              <div class="comment-wrapper">
                <img class="avatar" src="/avatars/1.jpg" />
                <div class="comment">
                  <div class="name">Dahlia Veum | 3 часа назад</div>
                  <div class="text">
                    Коллекцию гаджетов недавно пополнил смартфон Samsung
                    благодаря этому сайту)
                  </div>
                  <div class="media"></div>
                </div>
              </div>
            </div>
            <div v-if="!$auth.loggedIn">
              <div class="actions">
                <b-button
                  class="button is-primary"
                  @click="registerModal"
                  label="Авторизация"
                />
              </div>
              <h4>{{ $t("main")["comment_auth"] }}</h4>
            </div>
            <h4 v-else>{{ $t("main")["comment_auth_error"] }}</h4>
          </div>
        </div>
        <div class="column" id="work_it">
          <h3>{{ $t("main")["work_it"] }}</h3>
          <b-collapse
            class="card"
            animation="slide"
            v-for="(collapse, index) of collapses"
            :key="index"
            :open="isOpen == index"
            @open="isOpen = index"
          >
            <template #trigger="props">
              <div class="card-header" role="button">
                <p class="card-header-title">
                  {{ collapse.title }}
                </p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
                  </b-icon>
                </a>
              </div>
            </template>
            <div class="card-content">
              <div class="content">
                {{ collapse.text }}
              </div>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Header from "~/components/Header";
import Cats from "~/components/Cats";

export default Vue.extend({
  components: {
    Header,
    Cats,
  },
  mounted() {
    var container = this.$el.querySelector("#comments");
    container.scrollTop = container.scrollHeight;
  },
  methods: {
    registerModal() {
      this.$registerModal(this);
    },
  },
  data() {
    return {
      isOpen: 0,
      collapses: [
        {
          title: this.$t("main")["collapse"]["title_1"],
          text: this.$t("main")["collapse"]["desc_1"],
        },
        {
          title: this.$t("main")["collapse"]["title_2"],
          text: this.$t("main")["collapse"]["desc_2"],
        },
        {
          title: this.$t("main")["collapse"]["title_3"],
          text: this.$t("main")["collapse"]["desc_3"],
        },
        {
          title: this.$t("main")["collapse"]["title_4"],
          text: this.$t("main")["collapse"]["desc_4"],
        },
        {
          title: this.$t("main")["collapse"]["title_5"],
          text: this.$t("main")["collapse"]["desc_5"],
        },
        {
          title: this.$t("main")["collapse"]["title_6"],
          text: this.$t("main")["collapse"]["desc_6"],
        },
        {
          title: this.$t("main")["collapse"]["title_7"],
          text: this.$t("main")["collapse"]["desc_7"],
        },
        {
          title: this.$t("main")["collapse"]["title_8"],
          text: this.$t("main")["collapse"]["desc_8"],
        },
        {
          title: this.$t("main")["collapse"]["title_9"],
          text: this.$t("main")["collapse"]["desc_9"],
        },
      ],
    };
  },
});
</script>