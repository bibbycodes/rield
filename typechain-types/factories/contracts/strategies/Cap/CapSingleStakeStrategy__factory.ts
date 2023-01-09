/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  CapSingleStakeStrategy,
  CapSingleStakeStrategyInterface,
} from "../../../../contracts/strategies/Cap/CapSingleStakeStrategy";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_vault",
        type: "address",
      },
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_rewards",
        type: "address",
      },
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
        indexed: false,
        internalType: "uint256",
        name: "fees",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ChargedFees",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tvl",
        type: "uint256",
      },
    ],
    name: "Deposit",
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
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "harvester",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wantTokenHarvested",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tvl",
        type: "uint256",
      },
    ],
    name: "StratHarvest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tvl",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
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
    name: "balanceOfPool",
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
    name: "balanceOfWant",
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
    name: "beforeDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "callReward",
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
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "gasprice",
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
    name: "harvest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "harvestOnDeposit",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastHarvest",
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
    name: "nativeToWant",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
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
    name: "panic",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pool",
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
    name: "protocolTokenAddress",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "retireStrat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewards",
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
    name: "rewardsAvailable",
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
        name: "fee",
        type: "uint256",
      },
    ],
    name: "setDevFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_harvestOnDeposit",
        type: "bool",
      },
    ],
    name: "setHarvestOnDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_protocolTokenAddress",
        type: "address",
      },
    ],
    name: "setProtocolTokenAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "setProtocolTokenFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_shouldGasThrottle",
        type: "bool",
      },
    ],
    name: "setShouldGasThrottle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "shouldGasThrottle",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "vault",
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
    name: "want",
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
        name: "_amount",
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
  "0x60806040526000805460ff60a81b1916600160a81b178155600180546001600160a01b03191673a43509661141f254f54d9a326e8ec851a0b95307179055670429d069189e00006007556008553480156200005957600080fd5b5060405162001f7c38038062001f7c8339810160408190526200007c9162000560565b6200008733620000f2565b6000805460ff60a01b19169055600480546001600160a01b038087166001600160a01b03199283161790925560038054868416908316179055600580548584169083161790556002805492841692909116919091179055620000e862000142565b5050505062000688565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6003546002546200016f916001600160a01b03918216911660001962000171602090811b62000b5017901c565b565b801580620001ef5750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e90604401602060405180830381865afa158015620001c7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001ed9190620005bd565b155b620002675760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527f20746f206e6f6e2d7a65726f20616c6c6f77616e63650000000000000000000060648201526084015b60405180910390fd5b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b0390811663095ea7b360e01b17909152620002bf918591620002c416565b505050565b600062000320826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316620003a260201b62000c9d179092919060201c565b805190915015620002bf5780806020019051810190620003419190620005d7565b620002bf5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016200025e565b6060620003b38484600085620003bb565b949350505050565b6060824710156200041e5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016200025e565b600080866001600160a01b031685876040516200043c919062000635565b60006040518083038185875af1925050503d80600081146200047b576040519150601f19603f3d011682016040523d82523d6000602084013e62000480565b606091505b50909250905062000494878383876200049f565b979650505050505050565b606083156200051057825162000508576001600160a01b0385163b620005085760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016200025e565b5081620003b3565b620003b38383815115620005275781518083602001fd5b8060405162461bcd60e51b81526004016200025e919062000653565b80516001600160a01b03811681146200055b57600080fd5b919050565b600080600080608085870312156200057757600080fd5b620005828562000543565b9350620005926020860162000543565b9250620005a26040860162000543565b9150620005b26060860162000543565b905092959194509250565b600060208284031215620005d057600080fd5b5051919050565b600060208284031215620005ea57600080fd5b81518015158114620005fb57600080fd5b9392505050565b60005b838110156200061f57818101518382015260200162000605565b838111156200062f576000848401525b50505050565b600082516200064981846020870162000602565b9190910192915050565b60208152600082518060208401526200067481604085016020870162000602565b601f01601f19169190910160400192915050565b6118e480620006986000396000f3fe608060405234801561001057600080fd5b50600436106101fb5760003560e01c80638da5cb5b1161011a578063e3ff9370116100ad578063f706b1f21161007c578063f706b1f2146103b0578063fad4675e146103c3578063fb617787146103d6578063fbfa77cf146103de578063fc0c546a146103f157600080fd5b8063e3ff937014610379578063e7a7250a1461038c578063f1a392da14610394578063f2fde38b1461039d57600080fd5b8063c1a3d44c116100e9578063c1a3d44c14610347578063d0e30db01461034f578063dedcd30714610357578063deebc0621461036a57600080fd5b80638da5cb5b1461030857806397fd323d146103195780639ec5a894146103205780639f8b5da11461033357600080fd5b80634700d30511610192578063715018a611610161578063715018a6146102e3578063722713f7146102eb5780638456cb59146102f35780638912cb8b146102fb57600080fd5b80634700d305146102a2578063573fef0a146102aa5780635c975abb146102b25780636ec232d3146102d057600080fd5b80631f1fcd51116101ce5780631f1fcd511461026e5780632e1a7d4d1461027f5780633f4ba83a146102925780634641257d1461029a57600080fd5b80630e8fbb5a14610200578063115880861461021557806316f0115b146102305780631c75b6b21461025b575b600080fd5b61021361020e366004611635565b610404565b005b61021d61041f565b6040519081526020015b60405180910390f35b600354610243906001600160a01b031681565b6040516001600160a01b039091168152602001610227565b610213610269366004611659565b610492565b6002546001600160a01b0316610243565b61021361028d366004611659565b61049f565b6102136104ab565b6102136104cd565b6102136105be565b6102136106a3565b600054600160a01b900460ff165b6040519015158152602001610227565b600154610243906001600160a01b031681565b6102136106d8565b61021d6106ea565b610213610706565b6009546102c09060ff1681565b6000546001600160a01b0316610243565b600061021d565b600554610243906001600160a01b031681565b6000546102c090600160a81b900460ff1681565b61021d61071e565b61021361074f565b610213610365366004611659565b610867565b60606040516102279190611672565b6102136103873660046116d4565b610874565b61021d61089e565b61021d600a5481565b6102136103ab3660046116d4565b6108e8565b600654610243906001600160a01b031681565b6102136103d1366004611635565b61095e565b610213610984565b600454610243906001600160a01b031681565b600254610243906001600160a01b031681565b61040c610cb4565b6009805460ff1916911515919091179055565b60035460405163f8b2cb4f60e01b81523060048201526000916001600160a01b03169063f8b2cb4f906024015b602060405180830381865afa158015610469573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061048d91906116f1565b905090565b61049a610cb4565b600755565b6104a881610d0e565b50565b6104b3610cb4565b6104bb610ef0565b6104c3610f45565b6104cb61074f565b565b600054600160a81b900460ff1680156104f157506001546001600160a01b03163b15155b156105b657600160009054906101000a90046001600160a01b03166001600160a01b0316633de39c116040518163ffffffff1660e01b81526004016020604051808303816000875af115801561054b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061056f91906116f1565b3a11156105b65760405162461bcd60e51b815260206004820152601060248201526f67617320697320746f6f20686967682160801b60448201526064015b60405180910390fd5b6104cb610f64565b6105c6610cb4565b6105ce610706565b600560009054906101000a90046001600160a01b03166001600160a01b03166354c5aee16040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561061e57600080fd5b505af1158015610632573d6000803e3d6000fd5b50506003546001600160a01b03169150632e1a7d4d905061065161041f565b6040518263ffffffff1660e01b815260040161066f91815260200190565b600060405180830381600087803b15801561068957600080fd5b505af115801561069d573d6000803e3d6000fd5b50505050565b60095460ff16156104cb576004546001600160a01b031633146105b65760405162461bcd60e51b81526004016105ad9061170a565b6106e0610cb4565b6104cb60006110b2565b60006106f461041f565b6106fc61071e565b61048d9190611740565b61070e610cb4565b610716611102565b6104cb611145565b6002546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a082319060240161044c565b610757611163565b6002546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa1580156107a0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107c491906116f1565b905080156104a85760035460405163b6b55f2560e01b8152600481018390526001600160a01b039091169063b6b55f2590602401600060405180830381600087803b15801561081257600080fd5b505af1158015610826573d6000803e3d6000fd5b505050507f4d6ce1e535dbade1c23defba91e23b8f791ce5edc0cc320257a2b364e4e384266108536106ea565b60405190815260200160405180910390a150565b61086f610cb4565b600855565b61087c610cb4565b600680546001600160a01b0319166001600160a01b0392909216919091179055565b600554604080516338359faf60e11b815290516000926001600160a01b03169163706b3f5e9160048083019260209291908290030181865afa158015610469573d6000803e3d6000fd5b6108f0610cb4565b6001600160a01b0381166109555760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016105ad565b6104a8816110b2565b610966610cb4565b60008054911515600160a81b0260ff60a81b19909216919091179055565b6004546001600160a01b031633146109ae5760405162461bcd60e51b81526004016105ad9061170a565b6000600460009054906101000a90046001600160a01b03166001600160a01b03166376dfabb86040518163ffffffff1660e01b81526004016040805180830381865afa158015610a02573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a269190611758565b8051909150610a33610f64565b6002546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610a7c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610aa091906116f1565b90506000610aac61041f565b9050610ab781610d0e565b6002546004546001600160a01b039182169163a9059cbb9116610ada8486611740565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044016020604051808303816000875af1158015610b25573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b4991906117be565b5050505050565b801580610bca5750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e90604401602060405180830381865afa158015610ba4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bc891906116f1565b155b610c355760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527520746f206e6f6e2d7a65726f20616c6c6f77616e636560501b60648201526084016105ad565b6040516001600160a01b038316602482015260448101829052610c9890849063095ea7b360e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526111b0565b505050565b6060610cac8484600085611282565b949350505050565b6000546001600160a01b031633146104cb5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016105ad565b6004546001600160a01b03163314610d385760405162461bcd60e51b81526004016105ad9061170a565b6002546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610d81573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610da591906116f1565b905081811015610e89576003546001600160a01b0316632e1a7d4d610dca83856117db565b6040518263ffffffff1660e01b8152600401610de891815260200190565b600060405180830381600087803b158015610e0257600080fd5b505af1158015610e16573d6000803e3d6000fd5b50506002546040516370a0823160e01b81523060048201526001600160a01b0390911692506370a082319150602401602060405180830381865afa158015610e62573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e8691906116f1565b90505b81811115610e945750805b600454600254610eb1916001600160a01b0391821691168361135d565b7f5b6b431d4476a211bb7d41c20d1aab9ae2321deee0d20be3d9fc9b1093fa6e3d610eda6106ea565b6040519081526020015b60405180910390a15050565b610ef861138d565b6000805460ff60a01b191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6003546002546104cb916001600160a01b039182169116600019610b50565b610f6c611163565b600560009054906101000a90046001600160a01b03166001600160a01b03166354c5aee16040518163ffffffff1660e01b8152600401600060405180830381600087803b158015610fbc57600080fd5b505af1158015610fd0573d6000803e3d6000fd5b50506002546040516370a0823160e01b8152306004820152600093506001600160a01b0390911691506370a0823190602401602060405180830381865afa15801561101f573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061104391906116f1565b905080156104a8576110536113dd565b600061105d61071e565b905061106761074f565b42600a55337f9bc239f1724cacfb88cb1d66a2dc437467699b68a8c90d7b63110cf4b6f92410826110966106ea565b6040805192835260208301919091520160405180910390a25050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b61110a611163565b6000805460ff60a01b1916600160a01b1790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610f283390565b6003546002546104cb916001600160a01b0391821691166000610b50565b600054600160a01b900460ff16156104cb5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016105ad565b6000611205826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610c9d9092919063ffffffff16565b805190915015610c98578080602001905181019061122391906117be565b610c985760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016105ad565b6060824710156112e35760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016105ad565b600080866001600160a01b031685876040516112ff919061181e565b60006040518083038185875af1925050503d806000811461133c576040519150601f19603f3d011682016040523d82523d6000602084013e611341565b606091505b50915091506113528783838761158c565b979650505050505050565b6040516001600160a01b038316602482015260448101829052610c9890849063a9059cbb60e01b90606401610c61565b600054600160a01b900460ff166104cb5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b60448201526064016105ad565b6007546002546040516370a0823160e01b8152306004820152600092670de0b6b3a76400009290916001600160a01b03909116906370a0823190602401602060405180830381865afa158015611437573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061145b91906116f1565b611465919061183a565b61146f9190611859565b6008546002546040516370a0823160e01b8152306004820152929350600092670de0b6b3a764000092916001600160a01b0316906370a0823190602401602060405180830381865afa1580156114c9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114ed91906116f1565b6114f7919061183a565b6115019190611859565b905061152b6115186000546001600160a01b031690565b6002546001600160a01b0316908461135d565b600654600254611548916001600160a01b0391821691168361135d565b6007547f7b28cbe16017943a65fcc059a53072c1b23b17da20571041d0555074ec88c434906115778385611740565b60408051928352602083019190915201610ee4565b606083156115f85782516115f1576001600160a01b0385163b6115f15760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016105ad565b5081610cac565b610cac838381511561160d5781518083602001fd5b8060405162461bcd60e51b81526004016105ad919061187b565b80151581146104a857600080fd5b60006020828403121561164757600080fd5b813561165281611627565b9392505050565b60006020828403121561166b57600080fd5b5035919050565b6020808252825182820181905260009190848201906040850190845b818110156116b35783516001600160a01b03168352928401929184019160010161168e565b50909695505050505050565b6001600160a01b03811681146104a857600080fd5b6000602082840312156116e657600080fd5b8135611652816116bf565b60006020828403121561170357600080fd5b5051919050565b602080825260069082015265085d985d5b1d60d21b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b600082198211156117535761175361172a565b500190565b60006040828403121561176a57600080fd5b6040516040810181811067ffffffffffffffff8211171561179b57634e487b7160e01b600052604160045260246000fd5b60405282516117a9816116bf565b81526020928301519281019290925250919050565b6000602082840312156117d057600080fd5b815161165281611627565b6000828210156117ed576117ed61172a565b500390565b60005b8381101561180d5781810151838201526020016117f5565b8381111561069d5750506000910152565b600082516118308184602087016117f2565b9190910192915050565b60008160001904831182151516156118545761185461172a565b500290565b60008261187657634e487b7160e01b600052601260045260246000fd5b500490565b602081526000825180602084015261189a8160408501602087016117f2565b601f01601f1916919091016040019291505056fea26469706673582212205c66722e5fec3ab910a81984955fc6c89469754f3aef35cfd73b7a5f4249b66364736f6c634300080c0033";

type CapSingleStakeStrategyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CapSingleStakeStrategyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CapSingleStakeStrategy__factory extends ContractFactory {
  constructor(...args: CapSingleStakeStrategyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _vault: PromiseOrValue<string>,
    _pool: PromiseOrValue<string>,
    _rewards: PromiseOrValue<string>,
    _token: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<CapSingleStakeStrategy> {
    return super.deploy(
      _vault,
      _pool,
      _rewards,
      _token,
      overrides || {}
    ) as Promise<CapSingleStakeStrategy>;
  }
  override getDeployTransaction(
    _vault: PromiseOrValue<string>,
    _pool: PromiseOrValue<string>,
    _rewards: PromiseOrValue<string>,
    _token: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _vault,
      _pool,
      _rewards,
      _token,
      overrides || {}
    );
  }
  override attach(address: string): CapSingleStakeStrategy {
    return super.attach(address) as CapSingleStakeStrategy;
  }
  override connect(signer: Signer): CapSingleStakeStrategy__factory {
    return super.connect(signer) as CapSingleStakeStrategy__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CapSingleStakeStrategyInterface {
    return new utils.Interface(_abi) as CapSingleStakeStrategyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CapSingleStakeStrategy {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as CapSingleStakeStrategy;
  }
}
