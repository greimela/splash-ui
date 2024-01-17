<script setup lang="ts">
import { ref } from 'vue';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { parseOffer } from '~/chia/offer-parser';

const props = defineProps({
  onlyShowActiveOffers: { default: true },
});
const { onlyShowActiveOffers } = toRefs(props);

const offers = ref<any[]>([]);

const isConnected = ref(false);

let socket: Socket | undefined;

onMounted(async () => {
  socket = io(`${location.protocol === 'https:' ? 'wss://' : 'ws://'}${location.host}`);
  socket.on('connect', () => {
    isConnected.value = true;
  });
  socket.on('offer', async (offerString: string) => {
    try {
      console.log('Frontend received: ', offerString);
      offers.value.unshift(await parseOffer(offerString));
    } catch (e) {
      console.error(e);
    }
  });
});

onUnmounted(() => {
  socket?.disconnect();
});

</script>
<template>
  <div>
    <div class="flex justify-center">
      <div v-if="isConnected" class="flex items-center gap-2 text-sm text-gray-700 font-semibold text-emerald-600">
        <div class="relative inline-flex">
          <span class="flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
          </span>
        </div>
        Socket connected
      </div>
      <div v-else class="flex items-center gap-2 text-sm text-gray-700 font-semibold text-gray-600">
        <div class="relative inline-flex">
          <span class="flex h-3 w-3">
            <span class="relative inline-flex rounded-full h-3 w-3 bg-gray-600"></span>
          </span>
        </div>
        Socket disconnected
      </div>
    </div>
    <div class="mt-8 grid gap-8">
      <div v-for="offer in offers" :key="offer.id">
        <OfferCard :offer="offer" />
      </div>
      <div class="text-center" v-if="offers.length === 0">Waiting for offers...</div>
    </div>
  </div>
</template>