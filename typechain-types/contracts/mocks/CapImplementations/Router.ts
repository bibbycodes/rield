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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface RouterInterface extends utils.Interface {
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
    "owner()": FunctionFragment;
    "setCapRewards(address,address)": FunctionFragment;
    "setCapShare(address,uint256)": FunctionFragment;
    "setContracts(address,address,address,address,address)": FunctionFragment;
    "setCurrencies(address[])": FunctionFragment;
    "setDecimals(address,uint8)": FunctionFragment;
    "setOwner(address)": FunctionFragment;
    "setPool(address,address)": FunctionFragment;
    "setPoolRewards(address,address)": FunctionFragment;
    "setPoolShare(address,uint256)": FunctionFragment;
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
      | "owner"
      | "setCapRewards"
      | "setCapShare"
      | "setContracts"
      | "setCurrencies"
      | "setDecimals"
      | "setOwner"
      | "setPool"
      | "setPoolRewards"
      | "setPoolShare"
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
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setCapRewards",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setCapShare",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setContracts",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setCurrencies",
    values: [PromiseOrValue<string>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setDecimals",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setOwner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPool",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPoolRewards",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPoolShare",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
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
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setCapRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setCapShare",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setContracts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setCurrencies",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDecimals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setPool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setPoolRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPoolShare",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "trading", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "treasury", data: BytesLike): Result;

  events: {};
}

export interface Router extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RouterInterface;

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
      arg0: PromiseOrValue<BigNumberish>,
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

    owner(overrides?: CallOverrides): Promise<[string]>;

    setCapRewards(
      currency: PromiseOrValue<string>,
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setCapShare(
      currency: PromiseOrValue<string>,
      share: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setContracts(
      _treasury: PromiseOrValue<string>,
      _trading: PromiseOrValue<string>,
      _capPool: PromiseOrValue<string>,
      _oracle: PromiseOrValue<string>,
      _darkOracle: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setCurrencies(
      _currencies: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDecimals(
      currency: PromiseOrValue<string>,
      _decimals: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setOwner(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPool(
      currency: PromiseOrValue<string>,
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPoolRewards(
      currency: PromiseOrValue<string>,
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPoolShare(
      currency: PromiseOrValue<string>,
      share: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    trading(overrides?: CallOverrides): Promise<[string]>;

    treasury(overrides?: CallOverrides): Promise<[string]>;
  };

  capPool(overrides?: CallOverrides): Promise<string>;

  currencies(
    arg0: PromiseOrValue<BigNumberish>,
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

  owner(overrides?: CallOverrides): Promise<string>;

  setCapRewards(
    currency: PromiseOrValue<string>,
    _contract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setCapShare(
    currency: PromiseOrValue<string>,
    share: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setContracts(
    _treasury: PromiseOrValue<string>,
    _trading: PromiseOrValue<string>,
    _capPool: PromiseOrValue<string>,
    _oracle: PromiseOrValue<string>,
    _darkOracle: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setCurrencies(
    _currencies: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDecimals(
    currency: PromiseOrValue<string>,
    _decimals: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setOwner(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPool(
    currency: PromiseOrValue<string>,
    _contract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPoolRewards(
    currency: PromiseOrValue<string>,
    _contract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPoolShare(
    currency: PromiseOrValue<string>,
    share: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  trading(overrides?: CallOverrides): Promise<string>;

  treasury(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    capPool(overrides?: CallOverrides): Promise<string>;

    currencies(
      arg0: PromiseOrValue<BigNumberish>,
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

    owner(overrides?: CallOverrides): Promise<string>;

    setCapRewards(
      currency: PromiseOrValue<string>,
      _contract: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setCapShare(
      currency: PromiseOrValue<string>,
      share: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setContracts(
      _treasury: PromiseOrValue<string>,
      _trading: PromiseOrValue<string>,
      _capPool: PromiseOrValue<string>,
      _oracle: PromiseOrValue<string>,
      _darkOracle: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setCurrencies(
      _currencies: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>;

    setDecimals(
      currency: PromiseOrValue<string>,
      _decimals: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setOwner(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setPool(
      currency: PromiseOrValue<string>,
      _contract: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setPoolRewards(
      currency: PromiseOrValue<string>,
      _contract: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setPoolShare(
      currency: PromiseOrValue<string>,
      share: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    trading(overrides?: CallOverrides): Promise<string>;

    treasury(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    capPool(overrides?: CallOverrides): Promise<BigNumber>;

    currencies(
      arg0: PromiseOrValue<BigNumberish>,
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

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    setCapRewards(
      currency: PromiseOrValue<string>,
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setCapShare(
      currency: PromiseOrValue<string>,
      share: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setContracts(
      _treasury: PromiseOrValue<string>,
      _trading: PromiseOrValue<string>,
      _capPool: PromiseOrValue<string>,
      _oracle: PromiseOrValue<string>,
      _darkOracle: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setCurrencies(
      _currencies: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDecimals(
      currency: PromiseOrValue<string>,
      _decimals: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setOwner(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPool(
      currency: PromiseOrValue<string>,
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPoolRewards(
      currency: PromiseOrValue<string>,
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPoolShare(
      currency: PromiseOrValue<string>,
      share: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    trading(overrides?: CallOverrides): Promise<BigNumber>;

    treasury(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    capPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    currencies(
      arg0: PromiseOrValue<BigNumberish>,
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

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setCapRewards(
      currency: PromiseOrValue<string>,
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setCapShare(
      currency: PromiseOrValue<string>,
      share: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setContracts(
      _treasury: PromiseOrValue<string>,
      _trading: PromiseOrValue<string>,
      _capPool: PromiseOrValue<string>,
      _oracle: PromiseOrValue<string>,
      _darkOracle: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setCurrencies(
      _currencies: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDecimals(
      currency: PromiseOrValue<string>,
      _decimals: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setOwner(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPool(
      currency: PromiseOrValue<string>,
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPoolRewards(
      currency: PromiseOrValue<string>,
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPoolShare(
      currency: PromiseOrValue<string>,
      share: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    trading(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    treasury(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
