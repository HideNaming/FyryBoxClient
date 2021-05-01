<template>
  <div class="modal-card" style="width: auto">
    <div
      class="modal-card-head"
      role="button"
      aria-controls="contentIdForA11y3"
    >
      <p class="modal-card-title">Добавление коробки</p>
    </div>
    <div class="modal-card-body">
      <form>
        <div class="content">
          <b-field>
            <b-input v-model="form.name" placeholder="Имя коробки"></b-input>
          </b-field>
          <b-field>
            <b-input
              v-model="form.price"
              step="0.01"
              placeholder="Цена"
            ></b-input>
          </b-field>
          <b-field>
            <b-input v-model="form.sale" placeholder="Скидка в %"></b-input>
          </b-field>
          <b-field>
            <b-select
              placeholder="Выберите категорию"
              :loading="preLoading"
              v-model="form.category"
              :disabled="preLoading"
              expanded
            >
              <option v-for="item in categories" :key="item" :value="item.id">
                {{ item.name }}
              </option>
            </b-select>
          </b-field>
          <b-field
            class="file is-primary"
            :class="{ 'has-name': !!form.image }"
          >
            <b-upload id="image" v-model="form.image" class="file-label">
              <span class="file-cta">
                <b-icon class="file-icon" icon="upload"></b-icon>
                <span class="file-label">Загрузите картинку</span>
              </span>
              <span class="file-name" v-if="form.image">
                {{ form.image.name }}
              </span>
            </b-upload>
          </b-field>
        </div>
      </form>
    </div>
    <footer class="modal-card-foot">
      <a @click="Add" class="card-footer-item">
        <template>Добавить</template>
      </a>
      <a @click="$parent.close()" class="card-footer-item">
        <template>Отмена</template>
      </a>
    </footer>
    <b-loading
      :can-cancel="false"
      :is-full-page="false"
      v-model="loading"
    ></b-loading>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: null,
        price: null,
        sale: null,
        image: null,
        category: null,
      },
      categories: [],
      loading: false,
      preLoading: true,
    };
  },
  mounted() {
    this.Load();
  },
  methods: {
    async Load() {
      await this.$axios.$get("/api/v1/categories/").then((response) => {
        this.categories = response;
        this.preLoading = false;
      });
    },
    async Add() {
      let data = new FormData();
      data.append("image", this.form.image);
      data.append("category_id", this.form.category);
      data.append("price", this.form.price);
      data.append("sale", this.form.sale);
      data.append("name", this.form.name);
      await this.$axios
        .$post("/api/v1/boxes", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          this.$parent.$parent.Table();
          this.$parent.close();
        });
    },
  },
};
</script>