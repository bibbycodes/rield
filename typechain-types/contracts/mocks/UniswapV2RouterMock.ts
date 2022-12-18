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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface UniswapV2RouterMockInterface extends utils.Interface {
  functions: {
    "addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)": FunctionFragment;
    "addLiquidityETH(address,uint256,uint256,uint256,address,uint256)": FunctionFragment;
    "getAmountsOut(uint256,address[])": FunctionFragment;
    "removeLiquidity(address,address,uint256,uint256,uint256,address,uint256)": FunctionFragment;
    "removeLiquidityETH(address,uint256,uint256,uint256,address,uint256)": FunctionFragment;
    "swapExactETHForTokens(uint256,address[],address,uint256)": FunctionFragment;
    "swapExactTokensForETH(uint256,uint256,address[],address,uint256)": FunctionFragment;
    "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addLiquidity"
      | "addLiquidityETH"
      | "getAmountsOut"
      | "removeLiquidity"
      | "removeLiquidityETH"
      | "swapExactETHForTokens"
      | "swapExactTokensForETH"
      | "swapExactTokensForTokens"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addLiquidity",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "addLiquidityETH",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getAmountsOut",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "removeLiquidity",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "removeLiquidityETH",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "swapExactETHForTokens",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>[],
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "swapExactTokensForETH",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>[],
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "swapExactTokensForTokens",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>[],
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "addLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addLiquidityETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAmountsOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeLiquidityETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapExactETHForTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapExactTokensForETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapExactTokensForTokens",
    data: BytesLike
  ): Result;

  events: {};
}

export interface UniswapV2RouterMock extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UniswapV2RouterMockInterface;

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
    addLiquidity(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      amountADesired: PromiseOrValue<BigNumberish>,
      amountBDesired: PromiseOrValue<BigNumberish>,
      amountAMin: PromiseOrValue<BigNumberish>,
      amountBMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addLiquidityETH(
      token: PromiseOrValue<string>,
      amountTokenDesired: PromiseOrValue<BigNumberish>,
      amountTokenMin: PromiseOrValue<BigNumberish>,
      amountETHMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getAmountsOut(
      amountIn: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { amounts: BigNumber[] }>;

    removeLiquidity(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      liquidity: PromiseOrValue<BigNumberish>,
      amountAMin: PromiseOrValue<BigNumberish>,
      amountBMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    removeLiquidityETH(
      token: PromiseOrValue<string>,
      liquidity: PromiseOrValue<BigNumberish>,
      amountTokenMin: PromiseOrValue<BigNumberish>,
      amountETHMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    swapExactETHForTokens(
      amountOutMin: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    swapExactTokensForETH(
      amountIn: PromiseOrValue<BigNumberish>,
      amountOutMin: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    swapExactTokensForTokens(
      amountIn: PromiseOrValue<BigNumberish>,
      amountOutMin: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addLiquidity(
    tokenA: PromiseOrValue<string>,
    tokenB: PromiseOrValue<string>,
    amountADesired: PromiseOrValue<BigNumberish>,
    amountBDesired: PromiseOrValue<BigNumberish>,
    amountAMin: PromiseOrValue<BigNumberish>,
    amountBMin: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addLiquidityETH(
    token: PromiseOrValue<string>,
    amountTokenDesired: PromiseOrValue<BigNumberish>,
    amountTokenMin: PromiseOrValue<BigNumberish>,
    amountETHMin: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getAmountsOut(
    amountIn: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  removeLiquidity(
    tokenA: PromiseOrValue<string>,
    tokenB: PromiseOrValue<string>,
    liquidity: PromiseOrValue<BigNumberish>,
    amountAMin: PromiseOrValue<BigNumberish>,
    amountBMin: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  removeLiquidityETH(
    token: PromiseOrValue<string>,
    liquidity: PromiseOrValue<BigNumberish>,
    amountTokenMin: PromiseOrValue<BigNumberish>,
    amountETHMin: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  swapExactETHForTokens(
    amountOutMin: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  swapExactTokensForETH(
    amountIn: PromiseOrValue<BigNumberish>,
    amountOutMin: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  swapExactTokensForTokens(
    amountIn: PromiseOrValue<BigNumberish>,
    amountOutMin: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addLiquidity(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      amountADesired: PromiseOrValue<BigNumberish>,
      amountBDesired: PromiseOrValue<BigNumberish>,
      amountAMin: PromiseOrValue<BigNumberish>,
      amountBMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        amountA: BigNumber;
        amountB: BigNumber;
        liquidity: BigNumber;
      }
    >;

    addLiquidityETH(
      token: PromiseOrValue<string>,
      amountTokenDesired: PromiseOrValue<BigNumberish>,
      amountTokenMin: PromiseOrValue<BigNumberish>,
      amountETHMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        amountToken: BigNumber;
        amountETH: BigNumber;
        liquidity: BigNumber;
      }
    >;

    getAmountsOut(
      amountIn: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    removeLiquidity(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      liquidity: PromiseOrValue<BigNumberish>,
      amountAMin: PromiseOrValue<BigNumberish>,
      amountBMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amountA: BigNumber; amountB: BigNumber }
    >;

    removeLiquidityETH(
      token: PromiseOrValue<string>,
      liquidity: PromiseOrValue<BigNumberish>,
      amountTokenMin: PromiseOrValue<BigNumberish>,
      amountETHMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amountToken: BigNumber; amountETH: BigNumber }
    >;

    swapExactETHForTokens(
      amountOutMin: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    swapExactTokensForETH(
      amountIn: PromiseOrValue<BigNumberish>,
      amountOutMin: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    swapExactTokensForTokens(
      amountIn: PromiseOrValue<BigNumberish>,
      amountOutMin: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;
  };

  filters: {};

  estimateGas: {
    addLiquidity(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      amountADesired: PromiseOrValue<BigNumberish>,
      amountBDesired: PromiseOrValue<BigNumberish>,
      amountAMin: PromiseOrValue<BigNumberish>,
      amountBMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addLiquidityETH(
      token: PromiseOrValue<string>,
      amountTokenDesired: PromiseOrValue<BigNumberish>,
      amountTokenMin: PromiseOrValue<BigNumberish>,
      amountETHMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getAmountsOut(
      amountIn: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeLiquidity(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      liquidity: PromiseOrValue<BigNumberish>,
      amountAMin: PromiseOrValue<BigNumberish>,
      amountBMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    removeLiquidityETH(
      token: PromiseOrValue<string>,
      liquidity: PromiseOrValue<BigNumberish>,
      amountTokenMin: PromiseOrValue<BigNumberish>,
      amountETHMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    swapExactETHForTokens(
      amountOutMin: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    swapExactTokensForETH(
      amountIn: PromiseOrValue<BigNumberish>,
      amountOutMin: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    swapExactTokensForTokens(
      amountIn: PromiseOrValue<BigNumberish>,
      amountOutMin: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addLiquidity(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      amountADesired: PromiseOrValue<BigNumberish>,
      amountBDesired: PromiseOrValue<BigNumberish>,
      amountAMin: PromiseOrValue<BigNumberish>,
      amountBMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addLiquidityETH(
      token: PromiseOrValue<string>,
      amountTokenDesired: PromiseOrValue<BigNumberish>,
      amountTokenMin: PromiseOrValue<BigNumberish>,
      amountETHMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getAmountsOut(
      amountIn: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeLiquidity(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      liquidity: PromiseOrValue<BigNumberish>,
      amountAMin: PromiseOrValue<BigNumberish>,
      amountBMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    removeLiquidityETH(
      token: PromiseOrValue<string>,
      liquidity: PromiseOrValue<BigNumberish>,
      amountTokenMin: PromiseOrValue<BigNumberish>,
      amountETHMin: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    swapExactETHForTokens(
      amountOutMin: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    swapExactTokensForETH(
      amountIn: PromiseOrValue<BigNumberish>,
      amountOutMin: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    swapExactTokensForTokens(
      amountIn: PromiseOrValue<BigNumberish>,
      amountOutMin: PromiseOrValue<BigNumberish>,
      path: PromiseOrValue<string>[],
      to: PromiseOrValue<string>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
