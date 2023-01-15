/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface PoolInterface extends utils.Interface {
  functions: {
    "UNIT()": FunctionFragment;
    "creditUserProfit(address,uint256)": FunctionFragment;
    "currency()": FunctionFragment;
    "deposit(uint256)": FunctionFragment;
    "getCurrencyBalance(address)": FunctionFragment;
    "getUtilization()": FunctionFragment;
    "maxCap()": FunctionFragment;
    "minDepositTime()": FunctionFragment;
    "openInterest()": FunctionFragment;
    "owner()": FunctionFragment;
    "rewards()": FunctionFragment;
    "router()": FunctionFragment;
    "setOwner(address)": FunctionFragment;
    "setParams(uint256,uint256,uint256,uint256)": FunctionFragment;
    "setRouter(address)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "trading()": FunctionFragment;
    "utilizationMultiplier()": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
    "withdrawFee()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "UNIT"
      | "creditUserProfit"
      | "currency"
      | "deposit"
      | "getCurrencyBalance"
      | "getUtilization"
      | "maxCap"
      | "minDepositTime"
      | "openInterest"
      | "owner"
      | "rewards"
      | "router"
      | "setOwner"
      | "setParams"
      | "setRouter"
      | "totalSupply"
      | "trading"
      | "utilizationMultiplier"
      | "withdraw"
      | "withdrawFee"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "UNIT", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "creditUserProfit",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "currency", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrencyBalance",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getUtilization",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "maxCap", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "minDepositTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "openInterest",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "rewards", values?: undefined): string;
  encodeFunctionData(functionFragment: "router", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setOwner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setParams",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setRouter",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "trading", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "utilizationMultiplier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFee",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "UNIT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "creditUserProfit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "currency", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCurrencyBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUtilization",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "maxCap", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "minDepositTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "openInterest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "router", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setParams", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setRouter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "trading", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "utilizationMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFee",
    data: BytesLike
  ): Result;

  events: {
    "Deposit(address,address,uint256,uint256)": EventFragment;
    "Withdraw(address,address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}

export interface DepositEventObject {
  user: string;
  currency: string;
  amount: BigNumber;
  clpAmount: BigNumber;
}
export type DepositEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  DepositEventObject
>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface WithdrawEventObject {
  user: string;
  currency: string;
  amount: BigNumber;
  clpAmount: BigNumber;
}
export type WithdrawEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  WithdrawEventObject
>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface Pool extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PoolInterface;

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
    UNIT(overrides?: CallOverrides): Promise<[BigNumber]>;

    creditUserProfit(
      destination: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    currency(overrides?: CallOverrides): Promise<[string]>;

    deposit(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getCurrencyBalance(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getUtilization(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxCap(overrides?: CallOverrides): Promise<[BigNumber]>;

    minDepositTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    openInterest(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    rewards(overrides?: CallOverrides): Promise<[string]>;

    router(overrides?: CallOverrides): Promise<[string]>;

    setOwner(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setParams(
      _minDepositTime: PromiseOrValue<BigNumberish>,
      _utilizationMultiplier: PromiseOrValue<BigNumberish>,
      _maxCap: PromiseOrValue<BigNumberish>,
      _withdrawFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setRouter(
      _router: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    trading(overrides?: CallOverrides): Promise<[string]>;

    utilizationMultiplier(overrides?: CallOverrides): Promise<[BigNumber]>;

    withdraw(
      currencyAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdrawFee(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  UNIT(overrides?: CallOverrides): Promise<BigNumber>;

  creditUserProfit(
    destination: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  currency(overrides?: CallOverrides): Promise<string>;

  deposit(
    amount: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getCurrencyBalance(
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUtilization(overrides?: CallOverrides): Promise<BigNumber>;

  maxCap(overrides?: CallOverrides): Promise<BigNumber>;

  minDepositTime(overrides?: CallOverrides): Promise<BigNumber>;

  openInterest(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  rewards(overrides?: CallOverrides): Promise<string>;

  router(overrides?: CallOverrides): Promise<string>;

  setOwner(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setParams(
    _minDepositTime: PromiseOrValue<BigNumberish>,
    _utilizationMultiplier: PromiseOrValue<BigNumberish>,
    _maxCap: PromiseOrValue<BigNumberish>,
    _withdrawFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setRouter(
    _router: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  trading(overrides?: CallOverrides): Promise<string>;

  utilizationMultiplier(overrides?: CallOverrides): Promise<BigNumber>;

  withdraw(
    currencyAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdrawFee(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    UNIT(overrides?: CallOverrides): Promise<BigNumber>;

    creditUserProfit(
      destination: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    currency(overrides?: CallOverrides): Promise<string>;

    deposit(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getCurrencyBalance(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUtilization(overrides?: CallOverrides): Promise<BigNumber>;

    maxCap(overrides?: CallOverrides): Promise<BigNumber>;

    minDepositTime(overrides?: CallOverrides): Promise<BigNumber>;

    openInterest(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    rewards(overrides?: CallOverrides): Promise<string>;

    router(overrides?: CallOverrides): Promise<string>;

    setOwner(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setParams(
      _minDepositTime: PromiseOrValue<BigNumberish>,
      _utilizationMultiplier: PromiseOrValue<BigNumberish>,
      _maxCap: PromiseOrValue<BigNumberish>,
      _withdrawFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setRouter(
      _router: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    trading(overrides?: CallOverrides): Promise<string>;

    utilizationMultiplier(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      currencyAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawFee(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "Deposit(address,address,uint256,uint256)"(
      user?: PromiseOrValue<string> | null,
      currency?: PromiseOrValue<string> | null,
      amount?: null,
      clpAmount?: null
    ): DepositEventFilter;
    Deposit(
      user?: PromiseOrValue<string> | null,
      currency?: PromiseOrValue<string> | null,
      amount?: null,
      clpAmount?: null
    ): DepositEventFilter;

    "Withdraw(address,address,uint256,uint256)"(
      user?: PromiseOrValue<string> | null,
      currency?: PromiseOrValue<string> | null,
      amount?: null,
      clpAmount?: null
    ): WithdrawEventFilter;
    Withdraw(
      user?: PromiseOrValue<string> | null,
      currency?: PromiseOrValue<string> | null,
      amount?: null,
      clpAmount?: null
    ): WithdrawEventFilter;
  };

  estimateGas: {
    UNIT(overrides?: CallOverrides): Promise<BigNumber>;

    creditUserProfit(
      destination: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    currency(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getCurrencyBalance(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUtilization(overrides?: CallOverrides): Promise<BigNumber>;

    maxCap(overrides?: CallOverrides): Promise<BigNumber>;

    minDepositTime(overrides?: CallOverrides): Promise<BigNumber>;

    openInterest(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    rewards(overrides?: CallOverrides): Promise<BigNumber>;

    router(overrides?: CallOverrides): Promise<BigNumber>;

    setOwner(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setParams(
      _minDepositTime: PromiseOrValue<BigNumberish>,
      _utilizationMultiplier: PromiseOrValue<BigNumberish>,
      _maxCap: PromiseOrValue<BigNumberish>,
      _withdrawFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setRouter(
      _router: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    trading(overrides?: CallOverrides): Promise<BigNumber>;

    utilizationMultiplier(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      currencyAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdrawFee(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    UNIT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    creditUserProfit(
      destination: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    currency(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getCurrencyBalance(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUtilization(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxCap(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    minDepositTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    openInterest(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewards(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    router(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setOwner(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setParams(
      _minDepositTime: PromiseOrValue<BigNumberish>,
      _utilizationMultiplier: PromiseOrValue<BigNumberish>,
      _maxCap: PromiseOrValue<BigNumberish>,
      _withdrawFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setRouter(
      _router: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    trading(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    utilizationMultiplier(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdraw(
      currencyAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdrawFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}