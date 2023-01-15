/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export interface IRouterInterface extends utils.Interface {
  functions: {
    "capPool()": FunctionFragment;
    "currencies(uint256)": FunctionFragment;
    "currenciesLength()": FunctionFragment;
    "darkOracle()": FunctionFragment;
    "getCapRewards(address)": FunctionFragment;
    "getCapShare(address)": FunctionFragment;
    "getDecimals(address)": FunctionFragment;
    "getPool(address)": FunctionFragment;
    "getPoolRewards(address)": FunctionFragment;
    "getPoolShare(address)": FunctionFragment;
    "isSupportedCurrency(address)": FunctionFragment;
    "oracle()": FunctionFragment;
    "trading()": FunctionFragment;
    "treasury()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "capPool"
      | "currencies"
      | "currenciesLength"
      | "darkOracle"
      | "getCapRewards"
      | "getCapShare"
      | "getDecimals"
      | "getPool"
      | "getPoolRewards"
      | "getPoolShare"
      | "isSupportedCurrency"
      | "oracle"
      | "trading"
      | "treasury"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "capPool", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "currencies",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "currenciesLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "darkOracle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getCapRewards",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getCapShare",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getDecimals",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPool",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolRewards",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolShare",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isSupportedCurrency",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "oracle", values?: undefined): string;
  encodeFunctionData(functionFragment: "trading", values?: undefined): string;
  encodeFunctionData(functionFragment: "treasury", values?: undefined): string;

  decodeFunctionResult(functionFragment: "capPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "currencies", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "currenciesLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "darkOracle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCapRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCapShare",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDecimals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPoolRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolShare",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isSupportedCurrency",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "oracle", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "trading", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "treasury", data: BytesLike): Result;

  events: {};
}

export interface IRouter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IRouterInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    capPool(overrides?: CallOverrides): Promise<[string]>;

    currencies(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    currenciesLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    darkOracle(overrides?: CallOverrides): Promise<[string]>;

    getCapRewards(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getCapShare(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getDecimals(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[number]>;

    getPool(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getPoolRewards(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getPoolShare(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    isSupportedCurrency(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    oracle(overrides?: CallOverrides): Promise<[string]>;

    trading(overrides?: CallOverrides): Promise<[string]>;

    treasury(overrides?: CallOverrides): Promise<[string]>;
  };

  capPool(overrides?: CallOverrides): Promise<string>;

  currencies(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  currenciesLength(overrides?: CallOverrides): Promise<BigNumber>;

  darkOracle(overrides?: CallOverrides): Promise<string>;

  getCapRewards(
    currency: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  getCapShare(
    currency: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getDecimals(
    currency: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<number>;

  getPool(
    currency: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  getPoolRewards(
    currency: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  getPoolShare(
    currency: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isSupportedCurrency(
    currency: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  oracle(overrides?: CallOverrides): Promise<string>;

  trading(overrides?: CallOverrides): Promise<string>;

  treasury(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    capPool(overrides?: CallOverrides): Promise<string>;

    currencies(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    currenciesLength(overrides?: CallOverrides): Promise<BigNumber>;

    darkOracle(overrides?: CallOverrides): Promise<string>;

    getCapRewards(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    getCapShare(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDecimals(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<number>;

    getPool(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    getPoolRewards(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    getPoolShare(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isSupportedCurrency(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    oracle(overrides?: CallOverrides): Promise<string>;

    trading(overrides?: CallOverrides): Promise<string>;

    treasury(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    capPool(overrides?: CallOverrides): Promise<BigNumber>;

    currencies(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    currenciesLength(overrides?: CallOverrides): Promise<BigNumber>;

    darkOracle(overrides?: CallOverrides): Promise<BigNumber>;

    getCapRewards(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getCapShare(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDecimals(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPool(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPoolRewards(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPoolShare(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isSupportedCurrency(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    oracle(overrides?: CallOverrides): Promise<BigNumber>;

    trading(overrides?: CallOverrides): Promise<BigNumber>;

    treasury(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    capPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    currencies(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    currenciesLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    darkOracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getCapRewards(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getCapShare(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDecimals(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPool(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPoolRewards(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPoolShare(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isSupportedCurrency(
      currency: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    oracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    trading(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    treasury(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}