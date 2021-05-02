<template>
  <div class="garantii">
    <h2>{{ $t("garantii")["head"] }}</h2>
    <hr />
    <div class="g-cards">
      <div class="g-card">
        <div class="amount">25000+</div>
        <div class="info">{{ $t("garantii")["delivery_slogan"] }}</div>
        <img class="icon track" src="/icons/truck-big.svg" />
      </div>
      <div class="g-card">
        <div class="amount">10000+</div>
        <div class="info">
          {{ $t("garantii")["otzivi_slogan"] }}
        </div>
        <img class="icon piple" src="/icons/piple-big.svg" />
      </div>
      <div class="g-card">
        <div class="amount">100000+</div>
        <div class="info">{{ $t("garantii")["box_slogan"] }}</div>
        <img class="icon gift" src="/icons/giftbox.svg" />
      </div>
      <div class="g-card">
        <div class="new">new</div>
        <div class="amount">5000+</div>
        <div class="info">{{ $t("garantii")["auction_slogan"] }}</div>
        <img class="icon piple" src="/icons/trade.svg" />
      </div>
    </div>
    <div class="mini-cards">
      <div class="mini-card">
        <div class="title">
          <b-icon icon="thumb-up-outline" size="is-small"></b-icon>
          {{ $t("garantii")["feature_1_title"] }}
        </div>
        <div class="info">
          {{ $t("garantii")["feature_1_desc"] }}
        </div>
      </div>
      <div class="mini-card">
        <div class="title">
          <b-icon icon="barcode" size="is-small"></b-icon>
          {{ $t("garantii")["feature_2_title"] }}
        </div>
        <div class="info">
          {{ $t("garantii")["feature_2_desc"] }}
        </div>
      </div>
      <div class="mini-card">
        <div class="title">
          <b-icon icon="face-agent" size="is-small"></b-icon>
          {{ $t("garantii")["feature_3_title"] }}
        </div>
        <div class="info">
          {{ $t("garantii")["feature_3_desc"] }}
        </div>
      </div>
      <div class="mini-card">
        <div class="title">
          <b-icon icon="truck-delivery" size="is-small"></b-icon>
          {{ $t("garantii")["feature_4_title"] }}
        </div>
        <div class="info">
          {{ $t("garantii")["feature_4_desc"] }}
        </div>
      </div>
      <div class="mini-card">
        <div class="title">
          <b-icon icon="piggy-bank" size="is-small"></b-icon>
          {{ $t("garantii")["feature_5_title"] }}
        </div>
        <div class="info">
          {{ $t("garantii")["feature_5_desc"] }}
        </div>
      </div>
      <div class="mini-card">
        <div class="title">
          <b-icon icon="security" size="is-small"></b-icon>
          {{ $t("garantii")["feature_6_title"] }}
        </div>
        <div class="info">
          {{ $t("garantii")["feature_6_desc"] }}
        </div>
      </div>
    </div>
  </div>
</template>