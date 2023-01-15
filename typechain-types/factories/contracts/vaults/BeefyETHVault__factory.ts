/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  BeefyETHVault,
  BeefyETHVaultInterface,
} from "../../../contracts/vaults/BeefyETHVault";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "NewStratCandidate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "UpgradeStrat",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
    name: "approvalDelay",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "available",
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
    name: "balance",
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
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "earn",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPricePerFullShare",
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
        name: "_token",
        type: "address",
      },
    ],
    name: "inCaseTokensGetStuck",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract CapSingleStakeStrategyETH",
        name: "_strategy",
        type: "address",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
    inputs: [
      {
        internalType: "address payable",
        name: "_implementation",
        type: "address",
      },
    ],
    name: "proposeStrat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stratCandidate",
    outputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "proposedTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "strategy",
    outputs: [
      {
        internalType: "contract CapSingleStakeStrategyETH",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
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
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50611caf806100206000396000f3fe60806040526004361061018b5760003560e01c8063853828b6116100e0578063b69ef8a811610084578063dd62ed3e11610061578063dd62ed3e14610461578063def68a9c14610481578063e2d1e75c146104a1578063f2fde38b146104b757005b8063b69ef8a81461043c578063d0e30db014610451578063d389800f1461045957005b806395d89b41116100bd57806395d89b41146103c7578063a457c2d7146103dc578063a8c62e76146103fc578063a9059cbb1461041c57005b8063853828b6146103605780638da5cb5b1461037557806390657147146103a757005b8063395093511161014757806370a082311161012457806370a08231146102bd578063715018a6146102f357806376dfabb81461030857806377c7b8fc1461034b57005b8063395093511461026a57806348a0d7541461028a5780635b12ff9b1461029d57005b806306fdde0314610194578063095ea7b3146101bf57806318160ddd146101ef57806323b872dd1461020e5780632e1a7d4d1461022e578063313ce5671461024e57005b3661019257005b005b3480156101a057600080fd5b506101a96104d7565b6040516101b691906118b5565b60405180910390f35b3480156101cb57600080fd5b506101df6101da3660046118fd565b610569565b60405190151581526020016101b6565b3480156101fb57600080fd5b506035545b6040519081526020016101b6565b34801561021a57600080fd5b506101df610229366004611929565b610581565b34801561023a57600080fd5b5061019261024936600461196a565b6105a5565b34801561025a57600080fd5b50604051601281526020016101b6565b34801561027657600080fd5b506101df6102853660046118fd565b610711565b34801561029657600080fd5b5047610200565b3480156102a957600080fd5b506101926102b8366004611983565b610733565b3480156102c957600080fd5b506102006102d8366004611983565b6001600160a01b031660009081526033602052604090205490565b3480156102ff57600080fd5b5061019261086e565b34801561031457600080fd5b5060c95460ca5461032c916001600160a01b03169082565b604080516001600160a01b0390931683526020830191909152016101b6565b34801561035757600080fd5b50610200610882565b34801561036c57600080fd5b506101926108cb565b34801561038157600080fd5b506065546001600160a01b03165b6040516001600160a01b0390911681526020016101b6565b3480156103b357600080fd5b506101926103c2366004611a4a565b6108e4565b3480156103d357600080fd5b506101a9610a24565b3480156103e857600080fd5b506101df6103f73660046118fd565b610a33565b34801561040857600080fd5b5060cb5461038f906001600160a01b031681565b34801561042857600080fd5b506101df6104373660046118fd565b610aae565b34801561044857600080fd5b50610200610abc565b610192610b34565b610192610c2c565b34801561046d57600080fd5b5061020061047c366004611ac0565b610c97565b34801561048d57600080fd5b5061019261049c366004611983565b610cc2565b3480156104ad57600080fd5b5061020060cc5481565b3480156104c357600080fd5b506101926104d2366004611983565b610d4f565b6060603680546104e690611af9565b80601f016020809104026020016040519081016040528092919081815260200182805461051290611af9565b801561055f5780601f106105345761010080835404028352916020019161055f565b820191906000526020600020905b81548152906001019060200180831161054257829003601f168201915b5050505050905090565b600033610577818585610dc8565b5060019392505050565b60003361058f858285610eed565b61059a858585610f61565b506001949350505050565b60006105b060355490565b826105b9610abc565b6105c39190611b4a565b6105cd9190611b69565b90506105d9338361110c565b47818110156106785760006105ee8284611b8b565b60cb54604051632e1a7d4d60e01b8152600481018390529192506001600160a01b031690632e1a7d4d90602401600060405180830381600087803b15801561063557600080fd5b505af1158015610649573d6000803e3d6000fd5b504792506000915061065d90508483611b8b565b905082811015610674576106718185611ba2565b94505b5050505b604051600090339084908381818185875af1925050503d80600081146106ba576040519150601f19603f3d011682016040523d82523d6000602084013e6106bf565b606091505b505090508061070b5760405162461bcd60e51b815260206004820152601360248201527211551217d514905394d1915497d19052531151606a1b60448201526064015b60405180910390fd5b50505050565b6000336105778185856107248383610c97565b61072e9190611ba2565b610dc8565b61073b61123d565b806001600160a01b031663fbfa77cf6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610779573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061079d9190611bba565b6001600160a01b0316306001600160a01b0316146108075760405162461bcd60e51b815260206004820152602160248201527f50726f706f73616c206e6f742076616c696420666f722074686973205661756c6044820152601d60fa1b6064820152608401610702565b6040805180820182526001600160a01b03831680825242602092830181905260c980546001600160a01b0319168317905560ca5591519182527f1aae2ec5647db56da2d513de40528ba3565c6057525637050660c4323bbac7df910160405180910390a150565b61087661123d565b6108806000611297565b565b600061088d60355490565b156108be5760355461089d610abc565b6108af90670de0b6b3a7640000611b4a565b6108b99190611b69565b905090565b50670de0b6b3a764000090565b33600090815260336020526040902054610880906105a5565b600054610100900460ff16158080156109045750600054600160ff909116105b8061091e5750303b15801561091e575060005460ff166001145b6109815760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610702565b6000805460ff1916600117905580156109a4576000805461ff0019166101001790555b6109ae83836112e9565b6109b661131a565b6109be611349565b60cb80546001600160a01b0319166001600160a01b038616179055801561070b576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a150505050565b6060603780546104e690611af9565b60003381610a418286610c97565b905083811015610aa15760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610702565b61059a8286868403610dc8565b600033610577818585610f61565b60cb546040805163722713f760e01b815290516000926001600160a01b03169163722713f79160048083019260209291908290030181865afa158015610b06573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b2a9190611bd7565b6108b99047611ba2565b610b3c611378565b60cb60009054906101000a90046001600160a01b03166001600160a01b031663573fef0a6040518163ffffffff1660e01b8152600401600060405180830381600087803b158015610b8c57600080fd5b505af1158015610ba0573d6000803e3d6000fd5b50505050600034610baf610abc565b610bb99190611b8b565b9050610bc3610c2c565b6000610bcd610abc565b90506000610bdb8383611b8b565b90506000610be860355490565b610bf3575080610c14565b83610bfd60355490565b610c079084611b4a565b610c119190611b69565b90505b610c1e33826113d2565b505050506108806001609755565b60cb60009054906101000a90046001600160a01b03166001600160a01b031663d0e30db0346040518263ffffffff1660e01b81526004016000604051808303818588803b158015610c7c57600080fd5b505af1158015610c90573d6000803e3d6000fd5b5050505050565b6001600160a01b03918216600090815260346020908152604080832093909416825291909152205490565b610cca61123d565b6040516370a0823160e01b81523060048201526000906001600160a01b038316906370a0823190602401602060405180830381865afa158015610d11573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d359190611bd7565b9050610d4b6001600160a01b038316338361149a565b5050565b610d5761123d565b6001600160a01b038116610dbc5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610702565b610dc581611297565b50565b6001600160a01b038316610e2a5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610702565b6001600160a01b038216610e8b5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610702565b6001600160a01b0383811660008181526034602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b6000610ef98484610c97565b9050600019811461070b5781811015610f545760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610702565b61070b8484848403610dc8565b6001600160a01b038316610fc55760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610702565b6001600160a01b0382166110275760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610702565b6001600160a01b0383166000908152603360205260409020548181101561109f5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610702565b6001600160a01b0380851660008181526033602052604080822086860390559286168082529083902080548601905591517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906110ff9086815260200190565b60405180910390a361070b565b6001600160a01b03821661116c5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610702565b6001600160a01b038216600090815260336020526040902054818110156111e05760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610702565b6001600160a01b03831660008181526033602090815260408083208686039055603580548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9101610ee0565b505050565b6065546001600160a01b031633146108805760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610702565b606580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff166113105760405162461bcd60e51b815260040161070290611bf0565b610d4b82826114ec565b600054610100900460ff166113415760405162461bcd60e51b815260040161070290611bf0565b61088061153a565b600054610100900460ff166113705760405162461bcd60e51b815260040161070290611bf0565b61088061156a565b600260975414156113cb5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610702565b6002609755565b6001600160a01b0382166114285760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610702565b806035600082825461143a9190611ba2565b90915550506001600160a01b0382166000818152603360209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b6001609755565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b179052611238908490611591565b600054610100900460ff166115135760405162461bcd60e51b815260040161070290611bf0565b81516115269060369060208501906117f0565b5080516112389060379060208401906117f0565b600054610100900460ff166115615760405162461bcd60e51b815260040161070290611bf0565b61088033611297565b600054610100900460ff166114935760405162461bcd60e51b815260040161070290611bf0565b60006115e6826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166116639092919063ffffffff16565b80519091501561123857808060200190518101906116049190611c3b565b6112385760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610702565b6060611672848460008561167a565b949350505050565b6060824710156116db5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610702565b600080866001600160a01b031685876040516116f79190611c5d565b60006040518083038185875af1925050503d8060008114611734576040519150601f19603f3d011682016040523d82523d6000602084013e611739565b606091505b509150915061174a87838387611755565b979650505050505050565b606083156117c15782516117ba576001600160a01b0385163b6117ba5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610702565b5081611672565b61167283838151156117d65781518083602001fd5b8060405162461bcd60e51b815260040161070291906118b5565b8280546117fc90611af9565b90600052602060002090601f01602090048101928261181e5760008555611864565b82601f1061183757805160ff1916838001178555611864565b82800160010185558215611864579182015b82811115611864578251825591602001919060010190611849565b50611870929150611874565b5090565b5b808211156118705760008155600101611875565b60005b838110156118a457818101518382015260200161188c565b8381111561070b5750506000910152565b60208152600082518060208401526118d4816040850160208701611889565b601f01601f19169190910160400192915050565b6001600160a01b0381168114610dc557600080fd5b6000806040838503121561191057600080fd5b823561191b816118e8565b946020939093013593505050565b60008060006060848603121561193e57600080fd5b8335611949816118e8565b92506020840135611959816118e8565b929592945050506040919091013590565b60006020828403121561197c57600080fd5b5035919050565b60006020828403121561199557600080fd5b81356119a0816118e8565b9392505050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126119ce57600080fd5b813567ffffffffffffffff808211156119e9576119e96119a7565b604051601f8301601f19908116603f01168101908282118183101715611a1157611a116119a7565b81604052838152866020858801011115611a2a57600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600060608486031215611a5f57600080fd5b8335611a6a816118e8565b9250602084013567ffffffffffffffff80821115611a8757600080fd5b611a93878388016119bd565b93506040860135915080821115611aa957600080fd5b50611ab6868287016119bd565b9150509250925092565b60008060408385031215611ad357600080fd5b8235611ade816118e8565b91506020830135611aee816118e8565b809150509250929050565b600181811c90821680611b0d57607f821691505b60208210811415611b2e57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615611b6457611b64611b34565b500290565b600082611b8657634e487b7160e01b600052601260045260246000fd5b500490565b600082821015611b9d57611b9d611b34565b500390565b60008219821115611bb557611bb5611b34565b500190565b600060208284031215611bcc57600080fd5b81516119a0816118e8565b600060208284031215611be957600080fd5b5051919050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b600060208284031215611c4d57600080fd5b815180151581146119a057600080fd5b60008251611c6f818460208701611889565b919091019291505056fea264697066735822122036e93b5c3095dde9ce46121ee973435c12e8f9662e10502b24dbdfc4b833c9a264736f6c634300080c0033";

type BeefyETHVaultConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BeefyETHVaultConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BeefyETHVault__factory extends ContractFactory {
  constructor(...args: BeefyETHVaultConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<BeefyETHVault> {
    return super.deploy(overrides || {}) as Promise<BeefyETHVault>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): BeefyETHVault {
    return super.attach(address) as BeefyETHVault;
  }
  override connect(signer: Signer): BeefyETHVault__factory {
    return super.connect(signer) as BeefyETHVault__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BeefyETHVaultInterface {
    return new utils.Interface(_abi) as BeefyETHVaultInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BeefyETHVault {
    return new Contract(address, _abi, signerOrProvider) as BeefyETHVault;
  }
}
