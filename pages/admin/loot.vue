<template>
  <div>
    <HeaderMini />
    <div class="container">
      <div class="columns">
        <div class="column">
          <b-button @click="Add" type="is-warning" class="btn_fullwidth"
            >Добавить дроп</b-button
          >
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
            <b-table-column field="id" label="Действия" v-slot="props">
              <b-button type="is-success" @click="Edit(props.row)"
                >Редактировать</b-button
              >
              <b-button type="is-danger" @click="Delete(props.row)"
                >Удалить</b-button
              >
            </b-table-column>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from "~/components/AdminSidebar";
import Add from "~/components/admin/AddLoot";
import Edit from "~/components/admin/EditLoot";

export default {
  middleware: 'auth',
  components: {
    AdminSidebar,
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
      edit: null,
    };
  },
  methods: {
    async Table() {
      await this.$axios
        .get("/api/v1/loot", {
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
          console.log(response.data.categoryes);
          this.loading = false;
        });
    },
    Load() {
      console.log("dfghfd");
    },
    Add() {
      this.$buefy.modal.open({
        parent: this,
        canCancel: [],
        component: Add,
      });
    },
    Edit(data) {
      this.edit = data.id;
      this.$buefy.modal.open({
        parent: this,
        canCancel: [],
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
    Delete(data) {
      this.$buefy.dialog.confirm({
        title: "Удалить дроп?",
        message:
          "Данный дроп будет <b>удалёна</b> без возможности возврата.",
        confirmText: "Удалить",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          await this.$axios.delete("/api/v1/loot/" + data.id).then(() => {
            this.$buefy.toast.open("Дроп удалён");
            this.Table();
          });
        },
      });
    },
  },
  beforeMount() {
    this.Table();
  },
};
</script>