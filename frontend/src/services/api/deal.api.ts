import { Deal, NftExchangeOfferStatus } from "../../Data/DTOs/Deal";
import { Http } from "../Http";

export interface GetDealQueryParams {
  page: number;
  count: number;
  status?: NftExchangeOfferStatus;
  requestedNfts?: string;
  offeredNfts?: string;
  offerorUser?: string;
}

// TODO: 예외처리 추가
export const DealApis = {
  getNftExchangeOffers: async (params: GetDealQueryParams) => {
    try {
      const offers = await Http.get<{ list: Deal[]; total: number }>(
        "/v1/nft-exchange",
        params
      );

      return offers;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  getMyOffers: async (params: GetDealQueryParams) => {
    try {
      const offers = await Http.get<{ list: Deal[]; total: number }>(
        "/v1/nft-exchange/my",
        params
      );
      //console.log(offers);

      return offers;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  getDetails: async (id: string) => {
    try {
      const offer = await Http.get<Deal>(`/v1/nft-exchange/${id}`, {});
      return offer;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  acceptNftExchangeOffer: async (id: string) => {
    try {
      await Http.post(`/v1/nft-exchange/accept/${id}`, {});
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  cancelNftExchangeOffer: async (id: string) => {
    try {
      await Http.delete(`/v1/nft-exchange/cancel/${id}`, {});
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
};
