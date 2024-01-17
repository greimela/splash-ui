import { Offer } from '~/chia/offer';
import { cats } from '~/cats';
import { BigNumber, util } from 'greenwebjs';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

export async function parseOffer(offer_bech32: string) {
  const offer: Offer = Offer.from_bech32(offer_bech32);
  let status = 'active';
  let containsNft = false;

  const offeredCoins: any[] = [];
  for (const [assetId, offeredCoinsForAsset] of Object.entries(offer.getOfferedCoins())) {
    for (const offeredCoin of offeredCoinsForAsset) {
      // console.log({ assetId, offeredCoin });

      let nft, cat;
      if (assetId.startsWith('nft')) {
        try {
          const nftResponse = await $fetch<any>(`https://api.mintgarden.io/nfts/${assetId}`);
          nft = {
            id: nftResponse.encoded_id,
            name: nftResponse.data?.metadata_json?.name,
            thumbnail_uri: nftResponse.data?.thumbnail_uri,
          };
          containsNft = true;
        } catch (e) {
          return;
        }
      } else if (assetId) {
        //CAT
        const existingCat = cats.find((cat) => cat.id === assetId);
        cat = { tailHash: assetId, symbol: existingCat?.code || 'UNKNOWN' };
      }

      try {
        const coinResult = await $fetch<any>('https://api.mojonode.com/get_coin_record_by_name', {
          method: 'POST',
          body: {
            network: 'mainnet',
            name: util.coin.getName(offeredCoin),
          },
        });
        if (coinResult && coinResult.coin_record && coinResult.coin_record.spent) {
          status = 'spent';
        }
      } catch (e) {}

      // TODO check the input coins for existence to filter out testnet/fake offers

      offeredCoins.push({ amount: offeredCoin.amount, nft, cat });
    }
  }

  const requestedPayments: any[] = [];
  for (const [assetId, assetRequestedPayments] of Object.entries(offer.requestedPayments)) {
    let nft, cat;
    if (assetId.startsWith('nft')) {
      try {
        const nftResponse = await $fetch<any>(`https://api.mintgarden.io/nfts/${assetId}`);
        nft = {
          id: nftResponse.encoded_id,
          name: nftResponse.data?.metadata_json?.name,
          thumbnail_uri: nftResponse.data?.thumbnail_uri,
        };
        containsNft = true;
      } catch (e) {
        return;
      }
    } else if (assetId) {
      //CAT
      const existingCat = cats.find((cat) => cat.id === assetId);
      cat = { tailHash: assetId, symbol: existingCat?.code || 'UNKNOWN' };
    }
    const amount = assetRequestedPayments.reduce((acc, val) => acc.add(val.amount), BigNumber.from(0));
    requestedPayments.push({ assetId, cat, nft, amount });
  }

  return { offer: offer_bech32, offeredCoins, requestedPayments, status, containsNft };
}
