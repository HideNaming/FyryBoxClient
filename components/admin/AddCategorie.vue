<template>
  <div class="modal-card" style="width: auto">
    <div
      class="modal-card-head"
      role="button"
      aria-controls="contentIdForA11y3"
    >
      <p class="modal-card-title">Добавление категории</p>
    </div>
    <div class="modal-card-body">
      <form>
        <div class="content">
          <b-field>
            <b-input v-model="form.name" placeholder="Имя категории"></b-input>
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
        image: null,
      },
      loading: false,
    };
  },
  methods: {
    async Add() {
      let data = new FormData();
      data.append('image', this.form.image)
      data.append('name', this.form.name)
      await this.$axios
        .$post("/api/v1/categories", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
            this.$parent.$parent.Table()
            this.$parent.close()
        })
    },
  },
};
</script>