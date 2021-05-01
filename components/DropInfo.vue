<template>
  <div class="dropi">
    <div class="columns">
      <div class="column is-half preview">
        <img
          :src="
            $parent.$parent.backend +
            '/images/' +
            $parent.$parent.info.image
          "
        />
      </div>
      <div class="column">
        <p class="title">{{ $parent.$parent.info.name }}</p>
        <div class="price">{{$t('global')['cost']}}: {{ $parent.$parent.info.price }} {{$t('global')['currency']}}</div>
        <div class="stock">
          <img src="~assets/icons/stock_green.svg" />{{$t('box')['stock']}}
        </div>
        <ul class="text">
          <li v-for="item in $parent.$parent.info.detail.split(/\r?\n/)">
            <b-icon icon="check" size="is-small"> </b-icon> {{ item }}
          </li>
        </ul>
        <b-button class="button is-primary" :label="$t('box')['add_change']" />
      </div>
    </div>
  </div>
</template>