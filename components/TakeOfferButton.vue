<script setup>
import { ArrowDownTrayIcon } from '@heroicons/vue/24/solid';
import { ClipboardDocumentIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
import { useGoby } from '~/composables/useGoby';

const { goby, takeOffer: takeOfferInGoby } = useGoby();

const { offer } = defineProps({
  offer: Object,
});

const downloadOffer = () => {
  const c = document.createElement('a');
  // const offered_part = offer.summary_with_cat_info.offered
  //   .map((c) => `${c.amount / c.mojos_per_coin}${c.cat_code}`)
  //   .join('_');
  // const requested_part = offer.summary_with_cat_info.requested
  //   .map((c) => `${c.amount / c.mojos_per_coin}${c.cat_code}`)
  //   .join('_');
  c.download = `splash-ui.offer`;

  const t = new Blob([offer.offer], {
    type: 'text/plain',
  });
  c.href = window.URL.createObjectURL(t);
  c.click();
};

const takeOffer = () => {
  if (goby.value.isGobyInstalled) {
    takeOfferInGoby(offer);
  } else {
    downloadOffer(offer);
  }
};

const copied = ref(false);
const copyOffer = () => {
  navigator.clipboard.writeText(offer.offer);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1000);
};
</script>
<template>
  <span class="relative inline-flex rounded-md shadow-sm">
    <button
      type="button"
      @click="takeOffer"
      :class="[
        'rounded-l-md relative inline-flex border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500',
      ]"
    >
      <img v-if="goby.isGobyInstalled" class="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" src="/goby-logo.svg" />
      <ArrowDownTrayIcon v-else class="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
      {{ goby.isGobyInstalled ? 'Take Offer' : 'Download Offer' }}
    </button>
    <button
      type="button"
      v-if="goby.isGobyInstalled"
      @click="downloadOffer"
      class="relative -ml-px inline-flex items-center border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
    >
      <span class="sr-only">Download Offer</span>
      <ArrowDownTrayIcon class="h-4 w-4" aria-hidden="true" />
    </button>
    <button
      type="button"
      @click="copyOffer"
      class="relative -ml-px inline-flex items-center border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
    >
      <span class="sr-only">Copy Offer</span>
      <CheckCircleIcon v-if="copied" class="h-4 w-4" aria-hidden="true" />
      <ClipboardDocumentIcon v-else class="h-4 w-4" aria-hidden="true" />
    </button>
    <NuxtLink
      :to="`https://dexie.space/offers/${offer.id}`"
      target='_blank'
      class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
    >
      <img class='h-4 w-4' alt='dexie logo' src='https://dexie.space/favicon.ico'>
    </NuxtLink>
  </span>
</template>
