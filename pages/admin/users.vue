<template>
  <div>
    <HeaderMini />
    <div class="container">
      <div class="columns">
        <div class="column">
          <b-button type="is-warning" class="btn_fullwidth">Добавить</b-button>
          <AdminSidebar />
        </div>
        <div class="column is-four-fifths">
          <b-table
            :data="data"
            :loading="loading"
            :total="total"
            paginated
            backend-pagination
            :per-page="perPage"
            @page-change="onPageChange"
            backend-sorting
            :default-sort="[sortField, sortOrder]"
            @sort="onSort"
          >
            <b-table-column
              sortable
              field="id"
              label="ID"
              v-slot="props"
              width="60"
              numeric
            >
              {{ props.row.id }}
            </b-table-column>
            <b-table-column sortable field="name" label="Имя" v-slot="props">
              {{ props.row.name }}
            </b-table-column>
            <b-table-column sortable field="email" label="Email" v-slot="props">
              {{ props.row.email }}
            </b-table-column>
            <b-table-column field="id" label="Действия" v-slot="props">
              <b-button type="is-success" @click="Edit()"
                >Редактировать</b-button
              >
              <b-button type="is-danger" @click="Delete()">Удалить</b-button>
            </b-table-column>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from "~/components/AdminSidebar";
import Edit from "~/components/admin/Edit";

export default {
  middleware: 'auth',
  components: {
    AdminSidebar,
    Edit,
  },
  data() {
    return {
      total: 10,
      data: [],
      sortField: "id",
      sortOrder: "ASC",
      loading: true,
      currentPage: 1,
      perPage: 10,
    };
  },
  methods: {
    async Table() {
      await this.$axios
        .get("/api/v1/users", {
          params: {
            perPage: this.perPage,
            page: this.currentPage,
            sortField: this.sortField,
            sortOrder: this.sortOrder,
          },
        })
        .then((response) => {
          this.data = response.data.data;
          this.total = response.data.total;
          this.loading = false;
        });
    },
    LoadUser() {
      console.log("dfghfd");
    },
    Edit() {
      this.$buefy.modal.open({
        parent: this,
        component: Edit,
      });
    },
    onPageChange(page) {
      this.loading = true;
      this.currentPage = page;
      this.Table();
    },
    onSort(field, order) {
      this.loading = true;
      this.sortField = field;
      this.sortOrder = order;
      this.Table();
    },
    Delete() {
      this.$buefy.dialog.confirm({
        title: "Удалить аккаунт?",
        message: "Данный аккаунт будет <b>удалён</b> без возможности отмены.",
        confirmText: "Удалить",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.$buefy.toast.open("Account deleted!"),
      });
    },
  },
  beforeMount() {
    this.Table();
  },
};
</script>