<template>
  <div class="modal-card" style="width: auto">
    <div
      class="modal-card-head"
      role="button"
      aria-controls="contentIdForA11y3"
    >
      <p class="modal-card-title">Добавление дропа</p>
    </div>
    <div class="modal-card-body">
      <form>
        <div class="content">
          <b-field>
            <b-input v-model="form.name" placeholder="Имя дропа"></b-input>
          </b-field>
          <b-field>
            <b-input
              v-model="form.price"
              step="0.01"
              placeholder="Цена"
            ></b-input>
          </b-field>
          <b-field>
            <b-select
              placeholder="Выберите коробку"
              :loading="preLoading"
              v-model="form.box_id"
              :disabled="preLoading"
              expanded
            >
              <option v-for="item in boxes" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </b-select>
          </b-field>
          <b-field>
            <b-switch v-model="form.stock">Есть в наличии</b-switch>
          </b-field>
          <b-field label="Информация">
            <b-input  v-model="form.detail" maxlength="450" type="textarea"></b-input>
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
        image: null,
        box_id: null,
        stock: true,
        detail: ""
      },
      boxes: [],
      loading: false,
      preLoading: true,
    };
  },
  mounted() {
    this.Load();
  },
  methods: {
    async Load() {
      await this.$axios.$get("/api/v1/boxes/").then((response) => {
        this.boxes = response;
        this.preLoading = false;
      });
    },
    async Add() {
      let data = new FormData();
      data.append("image", this.form.image);
      data.append("box_id", this.form.box_id);
      data.append("detail", this.form.detail);
      data.append("price", this.form.price);
      data.append("stock", this.form.stock);
      data.append("name", this.form.name);
      await this.$axios
        .$post("/api/v1/loot", data, {
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