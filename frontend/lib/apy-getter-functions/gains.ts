import axios, {AxiosResponse} from "axios";

export interface GainsAprResponse {
  vaultTvl:            string;
  vaultCurrentBalance: string;
  vaultApr:            number;
  sssApr:              number;
  sssTvl:              number;
  sssBaseApr:          number;
}

export const getGainsApr = async () => {
  const res: AxiosResponse<GainsAprResponse> = await axios.get('https://backend-arbitrum.gains.trade/apr', {
    headers: {
      "accept": "*/*",
      "accept-language": "en-GB,en;q=0.9",
      "if-none-match": "W/\"c1-UmlYmAkh5x8jccAwvP/bhoYIs/k\"",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  })
  return res.data.sssBaseApr
}
