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

export declare namespace IFeeConfig {
  export type FeeCategoryStruct = {
    total: PromiseOrValue<BigNumberish>;
    beefy: PromiseOrValue<BigNumberish>;
    call: PromiseOrValue<BigNumberish>;
    strategist: PromiseOrValue<BigNumberish>;
    label: PromiseOrValue<string>;
    active: PromiseOrValue<boolean>;
  };

  export type FeeCategoryStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    boolean
  ] & {
    total: BigNumber;
    beefy: BigNumber;
    call: BigNumber;
    strategist: BigNumber;
    label: string;
    active: boolean;
  };
}

export interface IFeeConfigInterface extends utils.Interface {
  functions: {
    "getFees(address)": FunctionFragment;
    "setStratFeeId(uint256)": FunctionFragment;
    "stratFeeId(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "getFees" | "setStratFeeId" | "stratFeeId"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getFees",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setStratFeeId",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "stratFeeId",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "getFees", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setStratFeeId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stratFeeId", data: BytesLike): Result;

  events: {};
}

export interface IFeeConfig extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IFeeConfigInterface;

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
    getFees(
      strategy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[IFeeConfig.FeeCategoryStructOutput]>;

    setStratFeeId(
      feeId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    stratFeeId(
      strategy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  getFees(
    strategy: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<IFeeConfig.FeeCategoryStructOutput>;

  setStratFeeId(
    feeId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  stratFeeId(
    strategy: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    getFees(
      strategy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<IFeeConfig.FeeCategoryStructOutput>;

    setStratFeeId(
      feeId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    stratFeeId(
      strategy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    getFees(
      strategy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setStratFeeId(
      feeId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    stratFeeId(
      strategy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getFees(
      strategy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setStratFeeId(
      feeId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    stratFeeId(
      strategy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
