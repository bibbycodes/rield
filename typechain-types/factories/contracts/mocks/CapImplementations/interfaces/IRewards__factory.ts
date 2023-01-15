/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IRewards,
  IRewardsInterface,
} from "../../../../../contracts/mocks/CapImplementations/interfaces/IRewards";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "notifyRewardReceived",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "updateRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IRewards__factory {
  static readonly abi = _abi;
  static createInterface(): IRewardsInterface {
    return new utils.Interface(_abi) as IRewardsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRewards {
    return new Contract(address, _abi, signerOrProvider) as IRewards;
  }
}
