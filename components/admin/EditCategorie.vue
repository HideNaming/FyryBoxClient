<template>
  <div class="modal-card" style="width: auto">
    <div
      class="modal-card-head"
      role="button"
      aria-controls="contentIdForA11y3"
    >
      <p class="modal-card-title">
        <template v-if="!preLoading">Редактирование категории</template>
        <b-skeleton size="is-large" :active="preLoading"></b-skeleton>
      </p>
    </div>
    <div class="modal-card-body">
      <form>
        <div class="content">
          <b-field v-if="!preLoading">
            <b-input v-model="form.name" placeholder="Имя категории"></b-input>
          </b-field>
          <b-field
            class="file is-primary"
            :class="{ 'has-name': !!form.image }"
          >
            <b-upload
              id="image"
              v-model="form.image"
              class="file-label"
              v-if="!preLoading"
            >
              <span class="file-cta">
                <b-icon class="file-icon" icon="upload"></b-icon>
                <span class="file-label">Загрузите картинку</span>
              </span>
              <span class="file-name" v-if="form.image">
                {{ form.image.name }}
              </span>
            </b-upload>
          </b-field>
          <b-skeleton
            size="is-large"
            :active="preLoading"
            :count="2"
          ></b-skeleton>
        </div>
      </form>
    </div>
    <footer class="modal-card-foot">
      <a @click="Edit" class="card-footer-item">
        <template v-if="!preLoading">Сохранить</template>
        <b-skeleton size="is-large" :active="preLoading"></b-skeleton>
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
      preLoading: true,
    };
  },
  mounted() {
    this.Load();
  },
  methods: {
    async Load() {
      await this.$axios
        .$get("/api/v1/categories/" + this.$parent.$parent.edit + "/edit")
        .then((response) => {
          this.form.name = response.name;
          this.preLoading = false;
        });
    },
    async Edit() {
      let data = new FormData();
      data.append("image", this.form.image);
      data.append("name", this.form.name);
      data.append('_method', 'PATCH');
      await this.$axios
        .$post("/api/v1/categories/" + this.$parent.$parent.edit, data, {
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