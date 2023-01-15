/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  CapSingleStakeStrategy,
  CapSingleStakeStrategyInterface,
} from "../../../../../contracts/strategies/Cap/CapUsdcPoolStrategy.sol/CapSingleStakeStrategy";

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
    name: "DEV_FEE",
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
    name: "getDevFee",
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
    name: "getStakingFee",
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
    inputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "setStakingFee",
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
  "0x60806040526000805460ff60a81b1916600160a81b178155600180546001600160a01b03191673a43509661141f254f54d9a326e8ec851a0b9530717905560085564e8d4a510006009553480156200005657600080fd5b506040516200225c3803806200225c8339810160408190526200007991620005f8565b62000084336200018a565b6000805460ff60a01b19169055600480546001600160a01b038087166001600160a01b03199283161790925560038054868416908316179055600580548584169083161790556002805492841692909116919091179055620000e5620001da565b6002546040805163313ce56760e01b815290516001926001600160a01b03169163313ce5679160048083019260209291908290030181865afa15801562000130573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000156919062000655565b62000162919062000697565b6200016f90600a620007bc565b6200017c906003620007cd565b60075550620008b392505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60035460025462000207916001600160a01b03918216911660001962000209602090811b62000c5517901c565b565b801580620002875750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e90604401602060405180830381865afa1580156200025f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620002859190620007ef565b155b620002ff5760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527f20746f206e6f6e2d7a65726f20616c6c6f77616e63650000000000000000000060648201526084015b60405180910390fd5b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b0390811663095ea7b360e01b17909152620003579185916200035c16565b505050565b6000620003b8826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166200043a60201b62000da2179092919060201c565b805190915015620003575780806020019051810190620003d9919062000809565b620003575760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401620002f6565b60606200044b848460008562000453565b949350505050565b606082471015620004b65760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401620002f6565b600080866001600160a01b03168587604051620004d4919062000860565b60006040518083038185875af1925050503d806000811462000513576040519150601f19603f3d011682016040523d82523d6000602084013e62000518565b606091505b5090925090506200052c8783838762000537565b979650505050505050565b60608315620005a8578251620005a0576001600160a01b0385163b620005a05760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401620002f6565b50816200044b565b6200044b8383815115620005bf5781518083602001fd5b8060405162461bcd60e51b8152600401620002f691906200087e565b80516001600160a01b0381168114620005f357600080fd5b919050565b600080600080608085870312156200060f57600080fd5b6200061a85620005db565b93506200062a60208601620005db565b92506200063a60408601620005db565b91506200064a60608601620005db565b905092959194509250565b6000602082840312156200066857600080fd5b815160ff811681146200067a57600080fd5b9392505050565b634e487b7160e01b600052601160045260246000fd5b600060ff821660ff841680821015620006b457620006b462000681565b90039392505050565b600181815b80851115620006fe578160001904821115620006e257620006e262000681565b80851615620006f057918102915b93841c9390800290620006c2565b509250929050565b6000826200071757506001620007b6565b816200072657506000620007b6565b81600181146200073f57600281146200074a576200076a565b6001915050620007b6565b60ff8411156200075e576200075e62000681565b50506001821b620007b6565b5060208310610133831016604e8410600b84101617156200078f575081810a620007b6565b6200079b8383620006bd565b8060001904821115620007b257620007b262000681565b0290505b92915050565b60006200067a60ff84168362000706565b6000816000190483118215151615620007ea57620007ea62000681565b500290565b6000602082840312156200080257600080fd5b5051919050565b6000602082840312156200081c57600080fd5b815180151581146200067a57600080fd5b60005b838110156200084a57818101518382015260200162000830565b838111156200085a576000848401525b50505050565b60008251620008748184602087016200082d565b9190910192915050565b60208152600082518060208401526200089f8160408501602087016200082d565b601f01601f19169190910160400192915050565b61199980620008c36000396000f3fe608060405234801561001057600080fd5b50600436106102065760003560e01c80638456cb591161011a578063e3ff9370116100ad578063f706b1f21161007c578063f706b1f2146103be578063fad4675e146103d1578063fb617787146103e4578063fbfa77cf146103ec578063fc0c546a146103ff57600080fd5b8063e3ff937014610387578063e7a7250a1461039a578063f1a392da146103a2578063f2fde38b146103ab57600080fd5b80639f8b5da1116100e95780639f8b5da11461035b578063c1a3d44c1461036f578063c7287e9d14610377578063d0e30db01461037f57600080fd5b80638456cb59146103225780638912cb8b1461032a5780638da5cb5b146103375780639ec5a8941461034857600080fd5b8063436a88c11161019d578063573fef0a1161016c578063573fef0a146102d95780635c975abb146102e15780636ec232d3146102ff578063715018a614610312578063722713f71461031a57600080fd5b8063436a88c1146102b85780634641257d146102c15780634700d305146102c95780634b270a46146102d157600080fd5b80631f1fcd51116101d95780631f1fcd51146102795780632e1a7d4d1461028a5780633f4ba83a1461029d578063410dbf7e146102a557600080fd5b80630e8fbb5a1461020b578063115880861461022057806316f0115b1461023b5780631c75b6b214610266575b600080fd5b61021e610219366004611737565b610412565b005b61022861042d565b6040519081526020015b60405180910390f35b60035461024e906001600160a01b031681565b6040516001600160a01b039091168152602001610232565b61021e61027436600461175b565b6104a4565b6002546001600160a01b031661024e565b61021e61029836600461175b565b61050a565b61021e610516565b61021e6102b336600461175b565b610538565b61022860075481565b61021e610599565b61021e610685565b600854610228565b61021e61076a565b600054600160a01b900460ff165b6040519015158152602001610232565b60015461024e906001600160a01b031681565b61021e61079f565b6102286107b1565b61021e6107d2565b600a546102ef9060ff1681565b6000546001600160a01b031661024e565b60055461024e906001600160a01b031681565b6000546102ef90600160a81b900460ff1681565b6102286107ea565b600754610228565b61021e610857565b61021e610395366004611789565b610983565b6102286109ad565b610228600b5481565b61021e6103b9366004611789565b6109f7565b60065461024e906001600160a01b031681565b61021e6103df366004611737565b610a6d565b61021e610a93565b60045461024e906001600160a01b031681565b60025461024e906001600160a01b031681565b61041a610db9565b600a805460ff1916911515919091179055565b600354604051633b5a0d4160e21b815230600482015260009182916001600160a01b039091169063ed68350490602401602060405180830381865afa15801561047a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061049e91906117a6565b92915050565b6104ac610db9565b6706f05b59d3b20000600854826104c391906117d5565b11156105055760405162461bcd60e51b815260206004820152600c60248201526b0cccaca40e8dede40d0d2ced60a31b60448201526064015b60405180910390fd5b600755565b61051381610e13565b50565b61051e610db9565b610526610ff6565b61052e61104b565b610536610857565b565b610540610db9565b6706f05b59d3b200006007548261055791906117d5565b11156105945760405162461bcd60e51b815260206004820152600c60248201526b0cccaca40e8dede40d0d2ced60a31b60448201526064016104fc565b600855565b600054600160a81b900460ff1680156105bd57506001546001600160a01b03163b15155b1561067d57600160009054906101000a90046001600160a01b03166001600160a01b0316633de39c116040518163ffffffff1660e01b81526004016020604051808303816000875af1158015610617573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061063b91906117a6565b3a111561067d5760405162461bcd60e51b815260206004820152601060248201526f67617320697320746f6f20686967682160801b60448201526064016104fc565b61053661106a565b61068d610db9565b6106956107d2565b600560009054906101000a90046001600160a01b03166001600160a01b03166354c5aee16040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156106e557600080fd5b505af11580156106f9573d6000803e3d6000fd5b50506003546001600160a01b03169150632e1a7d4d905061071861042d565b6040518263ffffffff1660e01b815260040161073691815260200190565b600060405180830381600087803b15801561075057600080fd5b505af1158015610764573d6000803e3d6000fd5b50505050565b600a5460ff1615610536576004546001600160a01b0316331461067d5760405162461bcd60e51b81526004016104fc906117ed565b6107a7610db9565b61053660006111b8565b60006107bb61042d565b6107c36107ea565b6107cd91906117d5565b905090565b6107da610db9565b6107e2611208565b61053661124b565b6002546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610833573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107cd91906117a6565b61085f611269565b6002546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa1580156108a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108cc91906117a6565b90508015610513576003546009546001600160a01b039091169063b6b55f25906108f6908461180d565b6040518263ffffffff1660e01b815260040161091491815260200190565b600060405180830381600087803b15801561092e57600080fd5b505af1158015610942573d6000803e3d6000fd5b505050507f4d6ce1e535dbade1c23defba91e23b8f791ce5edc0cc320257a2b364e4e3842661096f6107b1565b60405190815260200160405180910390a150565b61098b610db9565b600680546001600160a01b0319166001600160a01b0392909216919091179055565b600554604080516338359faf60e11b815290516000926001600160a01b03169163706b3f5e9160048083019260209291908290030181865afa158015610833573d6000803e3d6000fd5b6109ff610db9565b6001600160a01b038116610a645760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016104fc565b610513816111b8565b610a75610db9565b60008054911515600160a81b0260ff60a81b19909216919091179055565b6004546001600160a01b03163314610abd5760405162461bcd60e51b81526004016104fc906117ed565b6000600460009054906101000a90046001600160a01b03166001600160a01b03166376dfabb86040518163ffffffff1660e01b81526004016040805180830381865afa158015610b11573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b35919061182c565b9050610b3f61106a565b6002546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610b88573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bac91906117a6565b90506000610bb861042d565b9050610bc381610e13565b6002546004546001600160a01b039182169163a9059cbb9116610be684866117d5565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044016020604051808303816000875af1158015610c31573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107649190611892565b801580610ccf5750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e90604401602060405180830381865afa158015610ca9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ccd91906117a6565b155b610d3a5760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527520746f206e6f6e2d7a65726f20616c6c6f77616e636560501b60648201526084016104fc565b6040516001600160a01b038316602482015260448101829052610d9d90849063095ea7b360e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526112b6565b505050565b6060610db18484600085611388565b949350505050565b6000546001600160a01b031633146105365760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104fc565b6004546001600160a01b03163314610e3d5760405162461bcd60e51b81526004016104fc906117ed565b6002546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610e86573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610eaa91906117a6565b905081811015610f8f576000610ec082846118af565b600354604051632e1a7d4d60e01b8152600481018390529192506001600160a01b031690632e1a7d4d90602401600060405180830381600087803b158015610f0757600080fd5b505af1158015610f1b573d6000803e3d6000fd5b50506002546040516370a0823160e01b81523060048201526001600160a01b0390911692506370a082319150602401602060405180830381865afa158015610f67573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f8b91906117a6565b9150505b81811115610f9a5750805b600454600254610fb7916001600160a01b03918216911683611463565b7f5b6b431d4476a211bb7d41c20d1aab9ae2321deee0d20be3d9fc9b1093fa6e3d610fe06107b1565b6040519081526020015b60405180910390a15050565b610ffe611493565b6000805460ff60a01b191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b600354600254610536916001600160a01b039182169116600019610c55565b611072611269565b600560009054906101000a90046001600160a01b03166001600160a01b03166354c5aee16040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156110c257600080fd5b505af11580156110d6573d6000803e3d6000fd5b50506002546040516370a0823160e01b8152306004820152600093506001600160a01b0390911691506370a0823190602401602060405180830381865afa158015611125573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061114991906117a6565b90508015610513576111596114e3565b60006111636107ea565b905061116d610857565b42600b55337f9bc239f1724cacfb88cb1d66a2dc437467699b68a8c90d7b63110cf4b6f924108261119c6107b1565b6040805192835260208301919091520160405180910390a25050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b611210611269565b6000805460ff60a01b1916600160a01b1790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25861102e3390565b600354600254610536916001600160a01b0391821691166000610c55565b600054600160a01b900460ff16156105365760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016104fc565b600061130b826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610da29092919063ffffffff16565b805190915015610d9d57808060200190518101906113299190611892565b610d9d5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016104fc565b6060824710156113e95760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016104fc565b600080866001600160a01b0316858760405161140591906118f2565b60006040518083038185875af1925050503d8060008114611442576040519150601f19603f3d011682016040523d82523d6000602084013e611447565b606091505b50915091506114588783838761168e565b979650505050505050565b6040516001600160a01b038316602482015260448101829052610d9d90849063a9059cbb60e01b90606401610d66565b600054600160a01b900460ff166105365760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b60448201526064016104fc565b6007546002546040516370a0823160e01b8152306004820152600092620f42409290916001600160a01b03909116906370a0823190602401602060405180830381865afa158015611538573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061155c91906117a6565b611566919061180d565b611570919061190e565b6008546002546040516370a0823160e01b8152306004820152929350600092620f424092916001600160a01b0316906370a0823190602401602060405180830381865afa1580156115c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115e991906117a6565b6115f3919061180d565b6115fd919061190e565b90506116276116146000546001600160a01b031690565b6002546001600160a01b03169084611463565b801561164a5760065460025461164a916001600160a01b03918216911683611463565b6007547f7b28cbe16017943a65fcc059a53072c1b23b17da20571041d0555074ec88c4349061167983856117d5565b60408051928352602083019190915201610fea565b606083156116fa5782516116f3576001600160a01b0385163b6116f35760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016104fc565b5081610db1565b610db1838381511561170f5781518083602001fd5b8060405162461bcd60e51b81526004016104fc9190611930565b801515811461051357600080fd5b60006020828403121561174957600080fd5b813561175481611729565b9392505050565b60006020828403121561176d57600080fd5b5035919050565b6001600160a01b038116811461051357600080fd5b60006020828403121561179b57600080fd5b813561175481611774565b6000602082840312156117b857600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b600082198211156117e8576117e86117bf565b500190565b602080825260069082015265085d985d5b1d60d21b604082015260600190565b6000816000190483118215151615611827576118276117bf565b500290565b60006040828403121561183e57600080fd5b6040516040810181811067ffffffffffffffff8211171561186f57634e487b7160e01b600052604160045260246000fd5b604052825161187d81611774565b81526020928301519281019290925250919050565b6000602082840312156118a457600080fd5b815161175481611729565b6000828210156118c1576118c16117bf565b500390565b60005b838110156118e15781810151838201526020016118c9565b838111156107645750506000910152565b600082516119048184602087016118c6565b9190910192915050565b60008261192b57634e487b7160e01b600052601260045260246000fd5b500490565b602081526000825180602084015261194f8160408501602087016118c6565b601f01601f1916919091016040019291505056fea2646970667358221220403eebbacedd81f308412d467378135de90551632d50bb0c5ee04c7462341c1264736f6c634300080c0033";

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
