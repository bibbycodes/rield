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

export declare namespace StrategyManager {
  export type CommonAddressesStruct = {
    vault: PromiseOrValue<string>;
    unirouter: PromiseOrValue<string>;
    owner: PromiseOrValue<string>;
  };

  export type CommonAddressesStructOutput = [string, string, string] & {
    vault: string;
    unirouter: string;
    owner: string;
  };
}

export interface StrategyGMXUniV2Interface extends utils.Interface {
  functions: {
    "acceptTransfer()": FunctionFragment;
    "balanceOf()": FunctionFragment;
    "balanceOfPool()": FunctionFragment;
    "balanceOfWant()": FunctionFragment;
    "balanceTracker()": FunctionFragment;
    "beforeDeposit()": FunctionFragment;
    "callReward()": FunctionFragment;
    "chef()": FunctionFragment;
    "deposit()": FunctionFragment;
    "gasprice()": FunctionFragment;
    "harvest()": FunctionFragment;
    "harvestOnDeposit()": FunctionFragment;
    "lastHarvest()": FunctionFragment;
    "native()": FunctionFragment;
    "nativeToWant()": FunctionFragment;
    "nativeToWantRoute(uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "panic()": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "retireStrat()": FunctionFragment;
    "rewardStorage()": FunctionFragment;
    "rewardsAvailable()": FunctionFragment;
    "setHarvestOnDeposit(bool)": FunctionFragment;
    "setShouldGasThrottle(bool)": FunctionFragment;
    "setUnirouter(address)": FunctionFragment;
    "setVault(address)": FunctionFragment;
    "shouldGasThrottle()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unirouter()": FunctionFragment;
    "unpause()": FunctionFragment;
    "vault()": FunctionFragment;
    "want()": FunctionFragment;
    "wantToken()": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "acceptTransfer"
      | "balanceOf"
      | "balanceOfPool"
      | "balanceOfWant"
      | "balanceTracker"
      | "beforeDeposit"
      | "callReward"
      | "chef"
      | "deposit"
      | "gasprice"
      | "harvest"
      | "harvestOnDeposit"
      | "lastHarvest"
      | "native"
      | "nativeToWant"
      | "nativeToWantRoute"
      | "owner"
      | "panic"
      | "pause"
      | "paused"
      | "renounceOwnership"
      | "retireStrat"
      | "rewardStorage"
      | "rewardsAvailable"
      | "setHarvestOnDeposit"
      | "setShouldGasThrottle"
      | "setUnirouter"
      | "setVault"
      | "shouldGasThrottle"
      | "transferOwnership"
      | "unirouter"
      | "unpause"
      | "vault"
      | "want"
      | "wantToken"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "acceptTransfer",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "balanceOfPool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOfWant",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "balanceTracker",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "beforeDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "callReward",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "chef", values?: undefined): string;
  encodeFunctionData(functionFragment: "deposit", values?: undefined): string;
  encodeFunctionData(functionFragment: "gasprice", values?: undefined): string;
  encodeFunctionData(functionFragment: "harvest", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "harvestOnDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lastHarvest",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "native", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "nativeToWant",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "nativeToWantRoute",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "panic", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "retireStrat",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardStorage",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardsAvailable",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setHarvestOnDeposit",
    values: [PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "setShouldGasThrottle",
    values: [PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "setUnirouter",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setVault",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "shouldGasThrottle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "unirouter", values?: undefined): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(functionFragment: "vault", values?: undefined): string;
  encodeFunctionData(functionFragment: "want", values?: undefined): string;
  encodeFunctionData(functionFragment: "wantToken", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfWant",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "balanceTracker",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "beforeDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "callReward", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "chef", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "gasprice", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "harvest", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "harvestOnDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastHarvest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "native", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "nativeToWant",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nativeToWantRoute",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "panic", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retireStrat",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardStorage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardsAvailable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setHarvestOnDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setShouldGasThrottle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setUnirouter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setVault", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "shouldGasThrottle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unirouter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "vault", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "want", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "wantToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "ChargedFees(uint256,uint256)": EventFragment;
    "Deposit(uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Paused(address)": EventFragment;
    "SetOwner(address)": EventFragment;
    "SetUnirouter(address)": EventFragment;
    "SetVault(address)": EventFragment;
    "StratHarvest(address,uint256,uint256)": EventFragment;
    "Unpaused(address)": EventFragment;
    "Withdraw(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ChargedFees"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetOwner"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetUnirouter"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetVault"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StratHarvest"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}

export interface ChargedFeesEventObject {
  fees: BigNumber;
  amount: BigNumber;
}
export type ChargedFeesEvent = TypedEvent<
  [BigNumber, BigNumber],
  ChargedFeesEventObject
>;

export type ChargedFeesEventFilter = TypedEventFilter<ChargedFeesEvent>;

export interface DepositEventObject {
  tvl: BigNumber;
}
export type DepositEvent = TypedEvent<[BigNumber], DepositEventObject>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface PausedEventObject {
  account: string;
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export interface SetOwnerEventObject {
  owner: string;
}
export type SetOwnerEvent = TypedEvent<[string], SetOwnerEventObject>;

export type SetOwnerEventFilter = TypedEventFilter<SetOwnerEvent>;

export interface SetUnirouterEventObject {
  unirouter: string;
}
export type SetUnirouterEvent = TypedEvent<[string], SetUnirouterEventObject>;

export type SetUnirouterEventFilter = TypedEventFilter<SetUnirouterEvent>;

export interface SetVaultEventObject {
  vault: string;
}
export type SetVaultEvent = TypedEvent<[string], SetVaultEventObject>;

export type SetVaultEventFilter = TypedEventFilter<SetVaultEvent>;

export interface StratHarvestEventObject {
  harvester: string;
  wantTokenHarvested: BigNumber;
  tvl: BigNumber;
}
export type StratHarvestEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  StratHarvestEventObject
>;

export type StratHarvestEventFilter = TypedEventFilter<StratHarvestEvent>;

export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface WithdrawEventObject {
  tvl: BigNumber;
}
export type WithdrawEvent = TypedEvent<[BigNumber], WithdrawEventObject>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface StrategyGMXUniV2 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: StrategyGMXUniV2Interface;

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
    acceptTransfer(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    balanceOf(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOfPool(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOfWant(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceTracker(overrides?: CallOverrides): Promise<[string]>;

    beforeDeposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    callReward(overrides?: CallOverrides): Promise<[BigNumber]>;

    chef(overrides?: CallOverrides): Promise<[string]>;

    deposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    gasprice(overrides?: CallOverrides): Promise<[string]>;

    harvest(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    harvestOnDeposit(overrides?: CallOverrides): Promise<[boolean]>;

    lastHarvest(overrides?: CallOverrides): Promise<[BigNumber]>;

    native(overrides?: CallOverrides): Promise<[string]>;

    nativeToWant(overrides?: CallOverrides): Promise<[string[]]>;

    nativeToWantRoute(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    panic(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    retireStrat(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    rewardStorage(overrides?: CallOverrides): Promise<[string]>;

    rewardsAvailable(overrides?: CallOverrides): Promise<[BigNumber]>;

    setHarvestOnDeposit(
      _harvestOnDeposit: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setShouldGasThrottle(
      _shouldGasThrottle: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setUnirouter(
      _unirouter: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setVault(
      _vault: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    shouldGasThrottle(overrides?: CallOverrides): Promise<[boolean]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    unirouter(overrides?: CallOverrides): Promise<[string]>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    vault(overrides?: CallOverrides): Promise<[string]>;

    want(overrides?: CallOverrides): Promise<[string]>;

    wantToken(overrides?: CallOverrides): Promise<[string]>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  acceptTransfer(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  balanceOf(overrides?: CallOverrides): Promise<BigNumber>;

  balanceOfPool(overrides?: CallOverrides): Promise<BigNumber>;

  balanceOfWant(overrides?: CallOverrides): Promise<BigNumber>;

  balanceTracker(overrides?: CallOverrides): Promise<string>;

  beforeDeposit(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callReward(overrides?: CallOverrides): Promise<BigNumber>;

  chef(overrides?: CallOverrides): Promise<string>;

  deposit(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  gasprice(overrides?: CallOverrides): Promise<string>;

  harvest(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  harvestOnDeposit(overrides?: CallOverrides): Promise<boolean>;

  lastHarvest(overrides?: CallOverrides): Promise<BigNumber>;

  native(overrides?: CallOverrides): Promise<string>;

  nativeToWant(overrides?: CallOverrides): Promise<string[]>;

  nativeToWantRoute(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  panic(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  pause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  retireStrat(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  rewardStorage(overrides?: CallOverrides): Promise<string>;

  rewardsAvailable(overrides?: CallOverrides): Promise<BigNumber>;

  setHarvestOnDeposit(
    _harvestOnDeposit: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setShouldGasThrottle(
    _shouldGasThrottle: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setUnirouter(
    _unirouter: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setVault(
    _vault: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  shouldGasThrottle(overrides?: CallOverrides): Promise<boolean>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  unirouter(overrides?: CallOverrides): Promise<string>;

  unpause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  vault(overrides?: CallOverrides): Promise<string>;

  want(overrides?: CallOverrides): Promise<string>;

  wantToken(overrides?: CallOverrides): Promise<string>;

  withdraw(
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    acceptTransfer(overrides?: CallOverrides): Promise<void>;

    balanceOf(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfPool(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfWant(overrides?: CallOverrides): Promise<BigNumber>;

    balanceTracker(overrides?: CallOverrides): Promise<string>;

    beforeDeposit(overrides?: CallOverrides): Promise<void>;

    callReward(overrides?: CallOverrides): Promise<BigNumber>;

    chef(overrides?: CallOverrides): Promise<string>;

    deposit(overrides?: CallOverrides): Promise<void>;

    gasprice(overrides?: CallOverrides): Promise<string>;

    harvest(overrides?: CallOverrides): Promise<void>;

    harvestOnDeposit(overrides?: CallOverrides): Promise<boolean>;

    lastHarvest(overrides?: CallOverrides): Promise<BigNumber>;

    native(overrides?: CallOverrides): Promise<string>;

    nativeToWant(overrides?: CallOverrides): Promise<string[]>;

    nativeToWantRoute(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    panic(overrides?: CallOverrides): Promise<void>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    retireStrat(overrides?: CallOverrides): Promise<void>;

    rewardStorage(overrides?: CallOverrides): Promise<string>;

    rewardsAvailable(overrides?: CallOverrides): Promise<BigNumber>;

    setHarvestOnDeposit(
      _harvestOnDeposit: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    setShouldGasThrottle(
      _shouldGasThrottle: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    setUnirouter(
      _unirouter: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setVault(
      _vault: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    shouldGasThrottle(overrides?: CallOverrides): Promise<boolean>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    unirouter(overrides?: CallOverrides): Promise<string>;

    unpause(overrides?: CallOverrides): Promise<void>;

    vault(overrides?: CallOverrides): Promise<string>;

    want(overrides?: CallOverrides): Promise<string>;

    wantToken(overrides?: CallOverrides): Promise<string>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ChargedFees(uint256,uint256)"(
      fees?: null,
      amount?: null
    ): ChargedFeesEventFilter;
    ChargedFees(fees?: null, amount?: null): ChargedFeesEventFilter;

    "Deposit(uint256)"(tvl?: null): DepositEventFilter;
    Deposit(tvl?: null): DepositEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    "SetOwner(address)"(owner?: null): SetOwnerEventFilter;
    SetOwner(owner?: null): SetOwnerEventFilter;

    "SetUnirouter(address)"(unirouter?: null): SetUnirouterEventFilter;
    SetUnirouter(unirouter?: null): SetUnirouterEventFilter;

    "SetVault(address)"(vault?: null): SetVaultEventFilter;
    SetVault(vault?: null): SetVaultEventFilter;

    "StratHarvest(address,uint256,uint256)"(
      harvester?: PromiseOrValue<string> | null,
      wantTokenHarvested?: null,
      tvl?: null
    ): StratHarvestEventFilter;
    StratHarvest(
      harvester?: PromiseOrValue<string> | null,
      wantTokenHarvested?: null,
      tvl?: null
    ): StratHarvestEventFilter;

    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;

    "Withdraw(uint256)"(tvl?: null): WithdrawEventFilter;
    Withdraw(tvl?: null): WithdrawEventFilter;
  };

  estimateGas: {
    acceptTransfer(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    balanceOf(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfPool(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfWant(overrides?: CallOverrides): Promise<BigNumber>;

    balanceTracker(overrides?: CallOverrides): Promise<BigNumber>;

    beforeDeposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    callReward(overrides?: CallOverrides): Promise<BigNumber>;

    chef(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    gasprice(overrides?: CallOverrides): Promise<BigNumber>;

    harvest(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    harvestOnDeposit(overrides?: CallOverrides): Promise<BigNumber>;

    lastHarvest(overrides?: CallOverrides): Promise<BigNumber>;

    native(overrides?: CallOverrides): Promise<BigNumber>;

    nativeToWant(overrides?: CallOverrides): Promise<BigNumber>;

    nativeToWantRoute(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    panic(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    retireStrat(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    rewardStorage(overrides?: CallOverrides): Promise<BigNumber>;

    rewardsAvailable(overrides?: CallOverrides): Promise<BigNumber>;

    setHarvestOnDeposit(
      _harvestOnDeposit: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setShouldGasThrottle(
      _shouldGasThrottle: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setUnirouter(
      _unirouter: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setVault(
      _vault: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    shouldGasThrottle(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    unirouter(overrides?: CallOverrides): Promise<BigNumber>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    vault(overrides?: CallOverrides): Promise<BigNumber>;

    want(overrides?: CallOverrides): Promise<BigNumber>;

    wantToken(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptTransfer(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    balanceOf(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOfPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOfWant(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceTracker(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    beforeDeposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    callReward(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    chef(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    gasprice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    harvest(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    harvestOnDeposit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lastHarvest(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    native(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nativeToWant(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nativeToWantRoute(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    panic(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    retireStrat(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    rewardStorage(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardsAvailable(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setHarvestOnDeposit(
      _harvestOnDeposit: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setShouldGasThrottle(
      _shouldGasThrottle: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setUnirouter(
      _unirouter: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setVault(
      _vault: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    shouldGasThrottle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    unirouter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    vault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    want(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    wantToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
