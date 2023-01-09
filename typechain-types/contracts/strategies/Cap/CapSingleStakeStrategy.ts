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

export interface CapSingleStakeStrategyInterface extends utils.Interface {
  functions: {
    "balanceOf()": FunctionFragment;
    "balanceOfPool()": FunctionFragment;
    "balanceOfWant()": FunctionFragment;
    "beforeDeposit()": FunctionFragment;
    "callReward()": FunctionFragment;
    "deposit()": FunctionFragment;
    "gasprice()": FunctionFragment;
    "harvest()": FunctionFragment;
    "harvestOnDeposit()": FunctionFragment;
    "lastHarvest()": FunctionFragment;
    "nativeToWant()": FunctionFragment;
    "owner()": FunctionFragment;
    "panic()": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "pool()": FunctionFragment;
    "protocolTokenAddress()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "retireStrat()": FunctionFragment;
    "rewards()": FunctionFragment;
    "rewardsAvailable()": FunctionFragment;
    "setDevFee(uint256)": FunctionFragment;
    "setHarvestOnDeposit(bool)": FunctionFragment;
    "setProtocolTokenAddress(address)": FunctionFragment;
    "setProtocolTokenFee(uint256)": FunctionFragment;
    "setShouldGasThrottle(bool)": FunctionFragment;
    "shouldGasThrottle()": FunctionFragment;
    "token()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unpause()": FunctionFragment;
    "vault()": FunctionFragment;
    "want()": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "balanceOf"
      | "balanceOfPool"
      | "balanceOfWant"
      | "beforeDeposit"
      | "callReward"
      | "deposit"
      | "gasprice"
      | "harvest"
      | "harvestOnDeposit"
      | "lastHarvest"
      | "nativeToWant"
      | "owner"
      | "panic"
      | "pause"
      | "paused"
      | "pool"
      | "protocolTokenAddress"
      | "renounceOwnership"
      | "retireStrat"
      | "rewards"
      | "rewardsAvailable"
      | "setDevFee"
      | "setHarvestOnDeposit"
      | "setProtocolTokenAddress"
      | "setProtocolTokenFee"
      | "setShouldGasThrottle"
      | "shouldGasThrottle"
      | "token"
      | "transferOwnership"
      | "unpause"
      | "vault"
      | "want"
      | "withdraw"
  ): FunctionFragment;

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
    functionFragment: "beforeDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "callReward",
    values?: undefined
  ): string;
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
  encodeFunctionData(
    functionFragment: "nativeToWant",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "panic", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(functionFragment: "pool", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "protocolTokenAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "retireStrat",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "rewards", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "rewardsAvailable",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setDevFee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setHarvestOnDeposit",
    values: [PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "setProtocolTokenAddress",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setProtocolTokenFee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setShouldGasThrottle",
    values: [PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "shouldGasThrottle",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(functionFragment: "vault", values?: undefined): string;
  encodeFunctionData(functionFragment: "want", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

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
    functionFragment: "beforeDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "callReward", data: BytesLike): Result;
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
  decodeFunctionResult(
    functionFragment: "nativeToWant",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "panic", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "protocolTokenAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retireStrat",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardsAvailable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setDevFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setHarvestOnDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProtocolTokenAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProtocolTokenFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setShouldGasThrottle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "shouldGasThrottle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "vault", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "want", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "ChargedFees(uint256,uint256)": EventFragment;
    "Deposit(uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Paused(address)": EventFragment;
    "StratHarvest(address,uint256,uint256)": EventFragment;
    "Unpaused(address)": EventFragment;
    "Withdraw(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ChargedFees"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
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

export interface CapSingleStakeStrategy extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CapSingleStakeStrategyInterface;

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
    balanceOf(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOfPool(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOfWant(overrides?: CallOverrides): Promise<[BigNumber]>;

    beforeDeposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    callReward(overrides?: CallOverrides): Promise<[BigNumber]>;

    deposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    gasprice(overrides?: CallOverrides): Promise<[string]>;

    harvest(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    harvestOnDeposit(overrides?: CallOverrides): Promise<[boolean]>;

    lastHarvest(overrides?: CallOverrides): Promise<[BigNumber]>;

    nativeToWant(overrides?: CallOverrides): Promise<[string[]]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    panic(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    pool(overrides?: CallOverrides): Promise<[string]>;

    protocolTokenAddress(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    retireStrat(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    rewards(overrides?: CallOverrides): Promise<[string]>;

    rewardsAvailable(overrides?: CallOverrides): Promise<[BigNumber]>;

    setDevFee(
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setHarvestOnDeposit(
      _harvestOnDeposit: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setProtocolTokenAddress(
      _protocolTokenAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setProtocolTokenFee(
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setShouldGasThrottle(
      _shouldGasThrottle: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    shouldGasThrottle(overrides?: CallOverrides): Promise<[boolean]>;

    token(overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    vault(overrides?: CallOverrides): Promise<[string]>;

    want(overrides?: CallOverrides): Promise<[string]>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  balanceOf(overrides?: CallOverrides): Promise<BigNumber>;

  balanceOfPool(overrides?: CallOverrides): Promise<BigNumber>;

  balanceOfWant(overrides?: CallOverrides): Promise<BigNumber>;

  beforeDeposit(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callReward(overrides?: CallOverrides): Promise<BigNumber>;

  deposit(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  gasprice(overrides?: CallOverrides): Promise<string>;

  harvest(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  harvestOnDeposit(overrides?: CallOverrides): Promise<boolean>;

  lastHarvest(overrides?: CallOverrides): Promise<BigNumber>;

  nativeToWant(overrides?: CallOverrides): Promise<string[]>;

  owner(overrides?: CallOverrides): Promise<string>;

  panic(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  pause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  pool(overrides?: CallOverrides): Promise<string>;

  protocolTokenAddress(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  retireStrat(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  rewards(overrides?: CallOverrides): Promise<string>;

  rewardsAvailable(overrides?: CallOverrides): Promise<BigNumber>;

  setDevFee(
    fee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setHarvestOnDeposit(
    _harvestOnDeposit: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setProtocolTokenAddress(
    _protocolTokenAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setProtocolTokenFee(
    fee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setShouldGasThrottle(
    _shouldGasThrottle: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  shouldGasThrottle(overrides?: CallOverrides): Promise<boolean>;

  token(overrides?: CallOverrides): Promise<string>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  unpause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  vault(overrides?: CallOverrides): Promise<string>;

  want(overrides?: CallOverrides): Promise<string>;

  withdraw(
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    balanceOf(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfPool(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfWant(overrides?: CallOverrides): Promise<BigNumber>;

    beforeDeposit(overrides?: CallOverrides): Promise<void>;

    callReward(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(overrides?: CallOverrides): Promise<void>;

    gasprice(overrides?: CallOverrides): Promise<string>;

    harvest(overrides?: CallOverrides): Promise<void>;

    harvestOnDeposit(overrides?: CallOverrides): Promise<boolean>;

    lastHarvest(overrides?: CallOverrides): Promise<BigNumber>;

    nativeToWant(overrides?: CallOverrides): Promise<string[]>;

    owner(overrides?: CallOverrides): Promise<string>;

    panic(overrides?: CallOverrides): Promise<void>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    pool(overrides?: CallOverrides): Promise<string>;

    protocolTokenAddress(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    retireStrat(overrides?: CallOverrides): Promise<void>;

    rewards(overrides?: CallOverrides): Promise<string>;

    rewardsAvailable(overrides?: CallOverrides): Promise<BigNumber>;

    setDevFee(
      fee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setHarvestOnDeposit(
      _harvestOnDeposit: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    setProtocolTokenAddress(
      _protocolTokenAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setProtocolTokenFee(
      fee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setShouldGasThrottle(
      _shouldGasThrottle: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    shouldGasThrottle(overrides?: CallOverrides): Promise<boolean>;

    token(overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    unpause(overrides?: CallOverrides): Promise<void>;

    vault(overrides?: CallOverrides): Promise<string>;

    want(overrides?: CallOverrides): Promise<string>;

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
    balanceOf(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfPool(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfWant(overrides?: CallOverrides): Promise<BigNumber>;

    beforeDeposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    callReward(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    gasprice(overrides?: CallOverrides): Promise<BigNumber>;

    harvest(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    harvestOnDeposit(overrides?: CallOverrides): Promise<BigNumber>;

    lastHarvest(overrides?: CallOverrides): Promise<BigNumber>;

    nativeToWant(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    panic(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    pool(overrides?: CallOverrides): Promise<BigNumber>;

    protocolTokenAddress(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    retireStrat(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    rewards(overrides?: CallOverrides): Promise<BigNumber>;

    rewardsAvailable(overrides?: CallOverrides): Promise<BigNumber>;

    setDevFee(
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setHarvestOnDeposit(
      _harvestOnDeposit: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setProtocolTokenAddress(
      _protocolTokenAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setProtocolTokenFee(
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setShouldGasThrottle(
      _shouldGasThrottle: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    shouldGasThrottle(overrides?: CallOverrides): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    vault(overrides?: CallOverrides): Promise<BigNumber>;

    want(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOf(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOfPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOfWant(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    beforeDeposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    callReward(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    gasprice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    harvest(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    harvestOnDeposit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lastHarvest(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nativeToWant(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    panic(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    protocolTokenAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    retireStrat(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    rewards(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardsAvailable(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setDevFee(
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setHarvestOnDeposit(
      _harvestOnDeposit: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setProtocolTokenAddress(
      _protocolTokenAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setProtocolTokenFee(
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setShouldGasThrottle(
      _shouldGasThrottle: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    shouldGasThrottle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    vault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    want(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
