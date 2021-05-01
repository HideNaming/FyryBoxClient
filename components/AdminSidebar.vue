<template>
  <section class="sidebar-layout">
    <b-sidebar
      position="static"
      type="is-light"
      open
    >
      <div class="p-1">
        <b-menu class="is-custom-mobile">
          <b-menu-list>
            <nuxt-link to="/admin/users"><b-menu-item
              active
              label="Пользователи"
              icon="account"
            ></b-menu-item></nuxt-link>
            <nuxt-link to="/admin/categories"><b-menu-item
              label="Категории"
              icon="information-outline"
            ></b-menu-item></nuxt-link>
            <nuxt-link to="/admin/boxes">
            <b-menu-item label="Коробки" icon="box"></b-menu-item>
            </nuxt-link>
            <nuxt-link to="/admin/loot">
            <b-menu-item label="Лут" icon="gift"></b-menu-item>
            </nuxt-link>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
  </section>
</template>