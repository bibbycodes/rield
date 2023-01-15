/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  PoolCAP,
  PoolCAPInterface,
} from "../../../../contracts/mocks/CapImplementations/PoolCAP";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_cap",
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
    name: "DepositCAP",
    type: "event",
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
    name: "WithdrawCAP",
    type: "event",
  },
  {
    inputs: [],
    name: "cap",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "deposit",
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
    name: "getBalance",
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
    name: "owner",
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
    inputs: [],
    name: "router",
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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_router",
        type: "address",
      },
    ],
    name: "setRouter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610b23380380610b2383398101604081905261002f91610062565b60008054336001600160a01b031991821617909155600280549091166001600160a01b0392909216919091179055610092565b60006020828403121561007457600080fd5b81516001600160a01b038116811461008b57600080fd5b9392505050565b610a82806100a16000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80638da5cb5b116100665780638da5cb5b14610107578063b6b55f251461011a578063c0d786551461012d578063f887ea4014610140578063f8b2cb4f1461015357600080fd5b806313af40351461009857806318160ddd146100ad5780632e1a7d4d146100c9578063355274ea146100dc575b600080fd5b6100ab6100a63660046108e3565b61017c565b005b6100b660045481565b6040519081526020015b60405180910390f35b6100ab6100d7366004610900565b6101e6565b6002546100ef906001600160a01b031681565b6040516001600160a01b0390911681526020016100c0565b6000546100ef906001600160a01b031681565b6100ab610128366004610900565b6102db565b6100ab61013b3660046108e3565b6103a2565b6001546100ef906001600160a01b031681565b6100b66101613660046108e3565b6001600160a01b031660009081526003602052604090205490565b6000546001600160a01b031633146101c45760405162461bcd60e51b815260206004820152600660248201526510b7bbb732b960d11b60448201526064015b60405180910390fd5b600080546001600160a01b0319166001600160a01b0392909216919091179055565b600081116102205760405162461bcd60e51b815260206004820152600760248201526608585b5bdd5b9d60ca1b60448201526064016101bb565b3360009081526003602052604090205481106102485750336000908152600360205260409020545b610250610407565b8060046000828254610262919061092f565b9091555050336000908152600360205260408120805483929061028690849061092f565b90915550506002546102a2906001600160a01b031633836105d9565b60405181815233907fb5f8afb824677daf72806b46fea85b6d5a915f9aa592491c114984caeb19eb1e906020015b60405180910390a250565b600081116103155760405162461bcd60e51b815260206004820152600760248201526608585b5bdd5b9d60ca1b60448201526064016101bb565b61031d610407565b806004600082825461032f9190610946565b90915550503360009081526003602052604081208054839290610353908490610946565b9091555050600254610370906001600160a01b0316333084610641565b60405181815233907fe4bea80f171715cac6973db809ecb1e9538330e5d032983defde1b092a16c0fc906020016102d0565b6000546001600160a01b031633146103e55760405162461bcd60e51b815260206004820152600660248201526510b7bbb732b960d11b60448201526064016101bb565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b600154604080516339fadb9160e01b815290516000926001600160a01b0316916339fadb919160048083019260209291908290030181865afa158015610451573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610475919061095e565b905060005b818110156105d55760015460405163f6d1c27160e01b8152600481018390526000916001600160a01b03169063f6d1c27190602401602060405180830381865afa1580156104cc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104f09190610977565b6001546040516327d442d560e11b81526001600160a01b03808416600483015292935060009290911690634fa885aa90602401602060405180830381865afa158015610540573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105649190610977565b604051635fd6196560e01b81523360048201529091506001600160a01b03821690635fd6196590602401600060405180830381600087803b1580156105a857600080fd5b505af11580156105bc573d6000803e3d6000fd5b50505050505080806105cd90610994565b91505061047a565b5050565b6040516001600160a01b03831660248201526044810182905261063c90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915261067f565b505050565b6040516001600160a01b03808516602483015283166044820152606481018290526106799085906323b872dd60e01b90608401610605565b50505050565b60006106d4826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166107519092919063ffffffff16565b80519091501561063c57808060200190518101906106f291906109af565b61063c5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016101bb565b6060610760848460008561076a565b90505b9392505050565b6060824710156107cb5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016101bb565b843b6108195760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016101bb565b600080866001600160a01b0316858760405161083591906109fd565b60006040518083038185875af1925050503d8060008114610872576040519150601f19603f3d011682016040523d82523d6000602084013e610877565b606091505b5091509150610887828286610892565b979650505050505050565b606083156108a1575081610763565b8251156108b15782518084602001fd5b8160405162461bcd60e51b81526004016101bb9190610a19565b6001600160a01b03811681146108e057600080fd5b50565b6000602082840312156108f557600080fd5b8135610763816108cb565b60006020828403121561091257600080fd5b5035919050565b634e487b7160e01b600052601160045260246000fd5b60008282101561094157610941610919565b500390565b6000821982111561095957610959610919565b500190565b60006020828403121561097057600080fd5b5051919050565b60006020828403121561098957600080fd5b8151610763816108cb565b60006000198214156109a8576109a8610919565b5060010190565b6000602082840312156109c157600080fd5b8151801515811461076357600080fd5b60005b838110156109ec5781810151838201526020016109d4565b838111156106795750506000910152565b60008251610a0f8184602087016109d1565b9190910192915050565b6020815260008251806020840152610a388160408501602087016109d1565b601f01601f1916919091016040019291505056fea26469706673582212205ac1df426aeb5aa2ee177c7131fb8c6f9b8f7394b9552e8bdb3784840524943864736f6c634300080c0033";

type PoolCAPConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PoolCAPConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PoolCAP__factory extends ContractFactory {
  constructor(...args: PoolCAPConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _cap: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<PoolCAP> {
    return super.deploy(_cap, overrides || {}) as Promise<PoolCAP>;
  }
  override getDeployTransaction(
    _cap: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_cap, overrides || {});
  }
  override attach(address: string): PoolCAP {
    return super.attach(address) as PoolCAP;
  }
  override connect(signer: Signer): PoolCAP__factory {
    return super.connect(signer) as PoolCAP__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PoolCAPInterface {
    return new utils.Interface(_abi) as PoolCAPInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PoolCAP {
    return new Contract(address, _abi, signerOrProvider) as PoolCAP;
  }
}