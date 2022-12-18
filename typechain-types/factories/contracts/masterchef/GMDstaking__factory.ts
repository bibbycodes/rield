/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  GMDstaking,
  GMDstakingInterface,
} from "../../../contracts/masterchef/GMDstaking";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_WETHPerSecond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_startTime",
        type: "uint256",
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
        indexed: true,
        internalType: "uint256",
        name: "pid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
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
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "EmergencyWithdraw",
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
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "MaxAllocPoint",
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
    name: "WETH",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WETHPerSecond",
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
        name: "_allocPoint",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "_lpToken",
        type: "address",
      },
    ],
    name: "add",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "closeWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pid",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "devaddr",
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
        name: "_pid",
        type: "uint256",
      },
    ],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_from",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_to",
        type: "uint256",
      },
    ],
    name: "getMultiplier",
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
    name: "massUpdatePools",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxWETHPerSecond",
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
    name: "openWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "uint256",
        name: "_pid",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "pendingWETH",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "poolInfo",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "lpToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allocPoint",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastRewardTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "accWETHPerShare",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolLength",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pid",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_allocPoint",
        type: "uint256",
      },
    ],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_WETHPerSecond",
        type: "uint256",
      },
    ],
    name: "setWETHPerSecond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startTime",
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
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "supplyRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAllocPoint",
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
    name: "totalWETHdistributed",
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
        name: "_pid",
        type: "uint256",
      },
    ],
    name: "updatePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardDebt",
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
        name: "_pid",
        type: "uint256",
      },
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
  {
    inputs: [],
    name: "withdrawable",
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
] as const;

const _bytecode =
  "0x60a0604052600280546001600160a01b0319167382af49447d8a07e3bd95bd0d56f35241523fbab1179055600060058190556008556009805460ff1916905534801561004a57600080fd5b50604051611907380380611907833981016040819052610069916100d4565b61007233610084565b600180556004919091556080526100f8565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080604083850312156100e757600080fd5b505080516020909101519092909150565b6080516117d1610136600039600081816102e8015281816106b1015281816106d801528181610c2701528181610c4e0152610c7801526117d16000f3fe608060405234801561001057600080fd5b50600436106101c45760003560e01c806378e97925116100f95780639bd16d7b11610097578063d49e77cd11610071578063d49e77cd146103d7578063e2bbb158146103ea578063f2fde38b146103fd578063f4b83c4c1461041057600080fd5b80639bd16d7b146103a8578063ad5c4648146103bb578063b9ac9686146103ce57600080fd5b80638da5cb5b116100d35780638da5cb5b1461031a5780638dbb1e3a1461033f5780639112f2b21461035257806393f1a40b1461036157600080fd5b806378e97925146102e35780637b020dad1461030a578063845105e21461031257600080fd5b8063412490611161016657806351eb05a61161014057806351eb05a6146102ad5780635312ea8e146102c0578063630b5ba1146102d3578063715018a6146102db57600080fd5b80634124906114610274578063441a3e701461027d578063501883011461029057600080fd5b806317caf6f1116101a257806317caf6f1146102325780631ab06ee51461023b5780632377b2a81461024e5780632b8bbbe81461026157600080fd5b80630332e936146101c9578063081e3eda146101de5780631526fe27146101f5575b600080fd5b6101dc6101d736600461158a565b610419565b005b6006545b6040519081526020015b60405180910390f35b61020861020336600461158a565b610495565b604080516001600160a01b03909516855260208501939093529183015260608201526080016101ec565b6101e260085481565b6101dc6102493660046115a3565b6104d9565b6101dc61025c36600461158a565b6105ab565b6101dc61026f3660046115da565b610642565b6101e260045481565b6101dc61028b3660046115a3565b6107fd565b60095461029d9060ff1681565b60405190151581526020016101ec565b6101dc6102bb36600461158a565b6109ae565b6101dc6102ce36600461158a565b610ad5565b6101dc610bbd565b6101dc610be4565b6101e27f000000000000000000000000000000000000000000000000000000000000000081565b6101dc610bf8565b6101dc610c0c565b6000546001600160a01b03165b6040516001600160a01b0390911681526020016101ec565b6101e261034d3660046115a3565b610c23565b6101e2670de0b6b3a764000081565b61039361036f3660046115da565b60076020908152600092835260408084209091529082529020805460019091015482565b604080519283526020830191909152016101ec565b6101e26103b63660046115da565b610cb9565b600254610327906001600160a01b031681565b6101e260055481565b600354610327906001600160a01b031681565b6101dc6103f83660046115a3565b610e16565b6101dc61040b36600461160a565b610f1e565b6101e2610fa081565b610421610f94565b670de0b6b3a76400008111156104885760405162461bcd60e51b815260206004820152602160248201527f736574574554485065725365636f6e643a20746f6f206d616e792057455448736044820152602160f81b60648201526084015b60405180910390fd5b610490610bbd565b600455565b600681815481106104a557600080fd5b600091825260209091206004909102018054600182015460028301546003909301546001600160a01b039092169350919084565b6104e1610f94565b610fa08111156105335760405162461bcd60e51b815260206004820152601c60248201527f6164643a20746f6f206d616e7920616c6c6f6320706f696e7473212100000000604482015260640161047f565b61053b610bbd565b806006838154811061054f5761054f61162e565b90600052602060002090600402016001015460085461056e919061165a565b6105789190611671565b60088190555080600683815481106105925761059261162e565b9060005260206000209060040201600101819055505050565b6105b3610f94565b6005546105c09082610fee565b6005556002546040516323b872dd60e01b8152336004820152306024820152604481018390526001600160a01b03909116906323b872dd906064016020604051808303816000875af115801561061a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061063e9190611689565b5050565b61064a610f94565b610fa082111561069c5760405162461bcd60e51b815260206004820152601c60248201527f6164643a20746f6f206d616e7920616c6c6f6320706f696e7473212100000000604482015260640161047f565b6106a581610ffa565b6106ad610bbd565b60007f000000000000000000000000000000000000000000000000000000000000000042116106fc577f00000000000000000000000000000000000000000000000000000000000000006106fe565b425b60085490915061070e9084610fee565b600855604080516080810182526001600160a01b0393841681526020810194855290810191825260006060820181815260068054600181018255925291517ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f600490920291820180546001600160a01b031916919095161790935592517ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d40830155517ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d4182015590517ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d4290910155565b6108056110a4565b60006006838154811061081a5761081a61162e565b6000918252602080832086845260078252604080852033865290925292208054600490920290920192508311156108885760405162461bcd60e51b81526020600482015260126024820152711dda5d1a191c985dce881b9bdd0819dbdbd960721b604482015260640161047f565b60095460ff166108d05760405162461bcd60e51b81526020600482015260136024820152721dda5d1a191c985dc81b9bdd081bdc195b9959606a1b604482015260640161047f565b6108d9846109ae565b6000610913826001015461090d64e8d4a51000610907876003015487600001546110fe90919063ffffffff16565b9061110a565b90611116565b82549091506109229085611116565b808355600384015461093f9164e8d4a510009161090791906110fe565b60018301558015610954576109543382611122565b825461096a906001600160a01b03163386611250565b604051848152859033907ff279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b568906020015b60405180910390a350505061063e60018055565b6000600682815481106109c3576109c361162e565b90600052602060002090600402019050806002015442116109e2575050565b80546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610a2a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a4e91906116ab565b905080610a6057504260029091015550565b6000610a70836002015442610c23565b90506000610a9d6008546109078660010154610a97600454876110fe90919063ffffffff16565b906110fe565b9050610ac0610ab5846109078464e8d4a510006110fe565b600386015490610fee565b60038501555050426002909201919091555050565b610add6110a4565b600060068281548110610af257610af261162e565b600091825260208083208584526007825260408085203380875293528420805485825560018201959095556004909302019350909190610b5090610b3e6103e8610907856102bc6110fe565b85546001600160a01b03169190611250565b610b77610b656000546001600160a01b031690565b610b3e6103e86109078561012c6110fe565b604051818152849033907fbb757047c2b5f3974fe26b7c10f732e7bce710b0952a71082702781e62ae05959060200160405180910390a3505050610bba60018055565b50565b60065460005b8181101561063e57610bd4816109ae565b610bdd816116c4565b9050610bc3565b610bec610f94565b610bf660006112b3565b565b610c00610f94565b6009805460ff19169055565b610c14610f94565b6009805460ff19166001179055565b60007f00000000000000000000000000000000000000000000000000000000000000008311610c72577f0000000000000000000000000000000000000000000000000000000000000000610c74565b825b92507f0000000000000000000000000000000000000000000000000000000000000000821015610ca657506000610cb3565b610cb0838361165a565b90505b92915050565b60008060068481548110610ccf57610ccf61162e565b600091825260208083208784526007825260408085206001600160a01b038981168752935280852060049485029092016003810154815492516370a0823160e01b8152309681019690965290965091949193919216906370a0823190602401602060405180830381865afa158015610d4b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d6f91906116ab565b9050836002015442118015610d8357508015155b15610de3576000610d98856002015442610c23565b90506000610dbf6008546109078860010154610a97600454876110fe90919063ffffffff16565b9050610dde610dd7846109078464e8d4a510006110fe565b8590610fee565b935050505b610e0b836001015461090d64e8d4a510006109078688600001546110fe90919063ffffffff16565b979650505050505050565b610e1e6110a4565b600060068381548110610e3357610e3361162e565b60009182526020808320868452600782526040808520338652909252922060049091029091019150610e64846109ae565b6000610e92826001015461090d64e8d4a51000610907876003015487600001546110fe90919063ffffffff16565b8254909150610ea19085610fee565b8083556003840154610ebe9164e8d4a510009161090791906110fe565b60018301558015610ed357610ed33382611122565b8254610eea906001600160a01b0316333087611303565b604051848152859033907f90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a159060200161099a565b610f26610f94565b6001600160a01b038116610f8b5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161047f565b610bba816112b3565b6000546001600160a01b03163314610bf65760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161047f565b6000610cb08284611671565b60065460005b8181101561109f57826001600160a01b0316600682815481106110255761102561162e565b60009182526020909120600490910201546001600160a01b0316141561108d5760405162461bcd60e51b815260206004820152601c60248201527f6164643a20706f6f6c20616c7265616479206578697374732121212100000000604482015260640161047f565b80611097816116c4565b915050611000565b505050565b600260015414156110f75760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161047f565b6002600155565b6000610cb082846116df565b6000610cb082846116fe565b6000610cb0828461165a565b6002546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa15801561116b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061118f91906116ab565b9050808211156112175760025460405163a9059cbb60e01b81526001600160a01b038581166004830152602482018490529091169063a9059cbb906044015b6020604051808303816000875af11580156111ed573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112119190611689565b50505050565b60025460405163a9059cbb60e01b81526001600160a01b038581166004830152602482018590529091169063a9059cbb906044016111ce565b6040516001600160a01b03831660248201526044810182905261109f90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915261133b565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6040516001600160a01b03808516602483015283166044820152606481018290526112119085906323b872dd60e01b9060840161127c565b6000611390826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b031661140d9092919063ffffffff16565b80519091501561109f57808060200190518101906113ae9190611689565b61109f5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161047f565b606061141c8484600085611424565b949350505050565b6060824710156114855760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b606482015260840161047f565b600080866001600160a01b031685876040516114a1919061174c565b60006040518083038185875af1925050503d80600081146114de576040519150601f19603f3d011682016040523d82523d6000602084013e6114e3565b606091505b5091509150610e0b878383876060831561155b578251611554576001600160a01b0385163b6115545760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161047f565b508161141c565b61141c83838151156115705781518083602001fd5b8060405162461bcd60e51b815260040161047f9190611768565b60006020828403121561159c57600080fd5b5035919050565b600080604083850312156115b657600080fd5b50508035926020909101359150565b6001600160a01b0381168114610bba57600080fd5b600080604083850312156115ed57600080fd5b8235915060208301356115ff816115c5565b809150509250929050565b60006020828403121561161c57600080fd5b8135611627816115c5565b9392505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60008282101561166c5761166c611644565b500390565b6000821982111561168457611684611644565b500190565b60006020828403121561169b57600080fd5b8151801515811461162757600080fd5b6000602082840312156116bd57600080fd5b5051919050565b60006000198214156116d8576116d8611644565b5060010190565b60008160001904831182151516156116f9576116f9611644565b500290565b60008261171b57634e487b7160e01b600052601260045260246000fd5b500490565b60005b8381101561173b578181015183820152602001611723565b838111156112115750506000910152565b6000825161175e818460208701611720565b9190910192915050565b6020815260008251806020840152611787816040850160208701611720565b601f01601f1916919091016040019291505056fea264697066735822122027a31d5ded55dfb02db51a3255ba4e3050271e3cf2b1c3a2dc4cf27667f4e39c64736f6c634300080c0033";

type GMDstakingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GMDstakingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GMDstaking__factory extends ContractFactory {
  constructor(...args: GMDstakingConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _WETHPerSecond: PromiseOrValue<BigNumberish>,
    _startTime: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<GMDstaking> {
    return super.deploy(
      _WETHPerSecond,
      _startTime,
      overrides || {}
    ) as Promise<GMDstaking>;
  }
  override getDeployTransaction(
    _WETHPerSecond: PromiseOrValue<BigNumberish>,
    _startTime: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _WETHPerSecond,
      _startTime,
      overrides || {}
    );
  }
  override attach(address: string): GMDstaking {
    return super.attach(address) as GMDstaking;
  }
  override connect(signer: Signer): GMDstaking__factory {
    return super.connect(signer) as GMDstaking__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GMDstakingInterface {
    return new utils.Interface(_abi) as GMDstakingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GMDstaking {
    return new Contract(address, _abi, signerOrProvider) as GMDstaking;
  }
}
