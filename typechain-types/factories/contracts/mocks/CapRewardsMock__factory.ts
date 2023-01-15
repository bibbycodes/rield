/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  CapRewardsMock,
  CapRewardsMockInterface,
} from "../../../contracts/mocks/CapRewardsMock";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "CollectRewards",
    type: "event",
  },
  {
    inputs: [],
    name: "collectReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getClaimableReward",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "poolContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "rewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161046638038061046683398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b6103d3806100936000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80630700037d1461006757806319ab453c1461009a57806354c5aee1146100cc578063706b3f5e146100d457806388d52ef7146100e9578063fc0c546a14610114575b600080fd5b6100876100753660046102d5565b60026020526000908152604090205481565b6040519081526020015b60405180910390f35b6100ca6100a83660046102d5565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b005b6100ca610127565b33600090815260026020526040902054610087565b6001546100fc906001600160a01b031681565b6040516001600160a01b039091168152602001610091565b6000546100fc906001600160a01b031681565b604080518082018252600a8152691c995dd85c991cd0985b60b21b602082015260005491516370a0823160e01b81523060048201526101b9926001600160a01b0316906370a0823190602401602060405180830381865afa158015610190573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101b49190610305565b61026b565b60005460405163a9059cbb60e01b8152336004820152620f424060248201526001600160a01b039091169063a9059cbb906044016020604051808303816000875af115801561020c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610230919061031e565b50604051620f4240815233907f2a2d1456672a2b5013c6d74f8677f133bbf5f7d5bb6be09231f7814782b9a7179060200160405180910390a2565b6102b08282604051602401610281929190610340565b60408051601f198184030181529190526020810180516001600160e01b0316632d839cb360e21b1790526102b4565b5050565b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b6000602082840312156102e757600080fd5b81356001600160a01b03811681146102fe57600080fd5b9392505050565b60006020828403121561031757600080fd5b5051919050565b60006020828403121561033057600080fd5b815180151581146102fe57600080fd5b604081526000835180604084015260005b8181101561036e5760208187018101516060868401015201610351565b81811115610380576000606083860101525b50602083019390935250601f91909101601f19160160600191905056fea2646970667358221220095a922d4c307e08dde60bd0a068581a81c61fae6f30289809cefc0922e929e264736f6c634300080c0033";

type CapRewardsMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CapRewardsMockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CapRewardsMock__factory extends ContractFactory {
  constructor(...args: CapRewardsMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _token: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<CapRewardsMock> {
    return super.deploy(_token, overrides || {}) as Promise<CapRewardsMock>;
  }
  override getDeployTransaction(
    _token: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_token, overrides || {});
  }
  override attach(address: string): CapRewardsMock {
    return super.attach(address) as CapRewardsMock;
  }
  override connect(signer: Signer): CapRewardsMock__factory {
    return super.connect(signer) as CapRewardsMock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CapRewardsMockInterface {
    return new utils.Interface(_abi) as CapRewardsMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CapRewardsMock {
    return new Contract(address, _abi, signerOrProvider) as CapRewardsMock;
  }
}
