/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface SchnellFundSenderInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addSupportedToken"
      | "initiateWithdrawalToL1"
      | "l1TokenCounterpart"
      | "l2StandardBridge"
      | "owner"
      | "removeSupportedToken"
      | "renounceOwnership"
      | "sendFunds"
      | "setL2StandardBridge"
      | "supportedTokens"
      | "transferOwnership"
      | "withdrawERC20"
      | "withdrawEther"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "FundsSent"
      | "L1TokenCounterpartSet"
      | "L2StandardBridgeSet"
      | "OwnershipTransferred"
      | "SupportedTokenAdded"
      | "SupportedTokenRemoved"
      | "WithdrawalInitiatedOnL2"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addSupportedToken",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initiateWithdrawalToL1",
    values: [AddressLike, AddressLike, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "l1TokenCounterpart",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "l2StandardBridge",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "removeSupportedToken",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "sendFunds",
    values: [AddressLike, BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setL2StandardBridge",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportedTokens",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawERC20",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawEther",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "addSupportedToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initiateWithdrawalToL1",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "l1TokenCounterpart",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "l2StandardBridge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeSupportedToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sendFunds", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setL2StandardBridge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportedTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawEther",
    data: BytesLike
  ): Result;
}

export namespace FundsSentEvent {
  export type InputTuple = [
    sender: AddressLike,
    recipient: AddressLike,
    token: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [
    sender: string,
    recipient: string,
    token: string,
    amount: bigint
  ];
  export interface OutputObject {
    sender: string;
    recipient: string;
    token: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace L1TokenCounterpartSetEvent {
  export type InputTuple = [l2Token: AddressLike, l1Token: AddressLike];
  export type OutputTuple = [l2Token: string, l1Token: string];
  export interface OutputObject {
    l2Token: string;
    l1Token: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace L2StandardBridgeSetEvent {
  export type InputTuple = [bridgeAddress: AddressLike];
  export type OutputTuple = [bridgeAddress: string];
  export interface OutputObject {
    bridgeAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SupportedTokenAddedEvent {
  export type InputTuple = [token: AddressLike];
  export type OutputTuple = [token: string];
  export interface OutputObject {
    token: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SupportedTokenRemovedEvent {
  export type InputTuple = [token: AddressLike];
  export type OutputTuple = [token: string];
  export interface OutputObject {
    token: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawalInitiatedOnL2Event {
  export type InputTuple = [
    l2Token: AddressLike,
    l1Recipient: AddressLike,
    l2Sender: AddressLike,
    amount: BigNumberish,
    l1Token: BytesLike
  ];
  export type OutputTuple = [
    l2Token: string,
    l1Recipient: string,
    l2Sender: string,
    amount: bigint,
    l1Token: string
  ];
  export interface OutputObject {
    l2Token: string;
    l1Recipient: string;
    l2Sender: string;
    amount: bigint;
    l1Token: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface SchnellFundSender extends BaseContract {
  connect(runner?: ContractRunner | null): SchnellFundSender;
  waitForDeployment(): Promise<this>;

  interface: SchnellFundSenderInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  addSupportedToken: TypedContractMethod<
    [_token: AddressLike],
    [void],
    "nonpayable"
  >;

  initiateWithdrawalToL1: TypedContractMethod<
    [
      _l2Token: AddressLike,
      _l1Recipient: AddressLike,
      _amount: BigNumberish,
      _minGasLimit: BigNumberish,
      _extraData: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  l1TokenCounterpart: TypedContractMethod<[], [string], "view">;

  l2StandardBridge: TypedContractMethod<[], [string], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  removeSupportedToken: TypedContractMethod<
    [_token: AddressLike],
    [void],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  sendFunds: TypedContractMethod<
    [_token: AddressLike, _amount: BigNumberish, _recipient: AddressLike],
    [void],
    "nonpayable"
  >;

  setL2StandardBridge: TypedContractMethod<
    [_bridgeAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  supportedTokens: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  withdrawERC20: TypedContractMethod<
    [_tokenContract: AddressLike, _to: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  withdrawEther: TypedContractMethod<[_to: AddressLike], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addSupportedToken"
  ): TypedContractMethod<[_token: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "initiateWithdrawalToL1"
  ): TypedContractMethod<
    [
      _l2Token: AddressLike,
      _l1Recipient: AddressLike,
      _amount: BigNumberish,
      _minGasLimit: BigNumberish,
      _extraData: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "l1TokenCounterpart"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "l2StandardBridge"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "removeSupportedToken"
  ): TypedContractMethod<[_token: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "sendFunds"
  ): TypedContractMethod<
    [_token: AddressLike, _amount: BigNumberish, _recipient: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setL2StandardBridge"
  ): TypedContractMethod<[_bridgeAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "supportedTokens"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawERC20"
  ): TypedContractMethod<
    [_tokenContract: AddressLike, _to: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawEther"
  ): TypedContractMethod<[_to: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "FundsSent"
  ): TypedContractEvent<
    FundsSentEvent.InputTuple,
    FundsSentEvent.OutputTuple,
    FundsSentEvent.OutputObject
  >;
  getEvent(
    key: "L1TokenCounterpartSet"
  ): TypedContractEvent<
    L1TokenCounterpartSetEvent.InputTuple,
    L1TokenCounterpartSetEvent.OutputTuple,
    L1TokenCounterpartSetEvent.OutputObject
  >;
  getEvent(
    key: "L2StandardBridgeSet"
  ): TypedContractEvent<
    L2StandardBridgeSetEvent.InputTuple,
    L2StandardBridgeSetEvent.OutputTuple,
    L2StandardBridgeSetEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "SupportedTokenAdded"
  ): TypedContractEvent<
    SupportedTokenAddedEvent.InputTuple,
    SupportedTokenAddedEvent.OutputTuple,
    SupportedTokenAddedEvent.OutputObject
  >;
  getEvent(
    key: "SupportedTokenRemoved"
  ): TypedContractEvent<
    SupportedTokenRemovedEvent.InputTuple,
    SupportedTokenRemovedEvent.OutputTuple,
    SupportedTokenRemovedEvent.OutputObject
  >;
  getEvent(
    key: "WithdrawalInitiatedOnL2"
  ): TypedContractEvent<
    WithdrawalInitiatedOnL2Event.InputTuple,
    WithdrawalInitiatedOnL2Event.OutputTuple,
    WithdrawalInitiatedOnL2Event.OutputObject
  >;

  filters: {
    "FundsSent(address,address,address,uint256)": TypedContractEvent<
      FundsSentEvent.InputTuple,
      FundsSentEvent.OutputTuple,
      FundsSentEvent.OutputObject
    >;
    FundsSent: TypedContractEvent<
      FundsSentEvent.InputTuple,
      FundsSentEvent.OutputTuple,
      FundsSentEvent.OutputObject
    >;

    "L1TokenCounterpartSet(address,address)": TypedContractEvent<
      L1TokenCounterpartSetEvent.InputTuple,
      L1TokenCounterpartSetEvent.OutputTuple,
      L1TokenCounterpartSetEvent.OutputObject
    >;
    L1TokenCounterpartSet: TypedContractEvent<
      L1TokenCounterpartSetEvent.InputTuple,
      L1TokenCounterpartSetEvent.OutputTuple,
      L1TokenCounterpartSetEvent.OutputObject
    >;

    "L2StandardBridgeSet(address)": TypedContractEvent<
      L2StandardBridgeSetEvent.InputTuple,
      L2StandardBridgeSetEvent.OutputTuple,
      L2StandardBridgeSetEvent.OutputObject
    >;
    L2StandardBridgeSet: TypedContractEvent<
      L2StandardBridgeSetEvent.InputTuple,
      L2StandardBridgeSetEvent.OutputTuple,
      L2StandardBridgeSetEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "SupportedTokenAdded(address)": TypedContractEvent<
      SupportedTokenAddedEvent.InputTuple,
      SupportedTokenAddedEvent.OutputTuple,
      SupportedTokenAddedEvent.OutputObject
    >;
    SupportedTokenAdded: TypedContractEvent<
      SupportedTokenAddedEvent.InputTuple,
      SupportedTokenAddedEvent.OutputTuple,
      SupportedTokenAddedEvent.OutputObject
    >;

    "SupportedTokenRemoved(address)": TypedContractEvent<
      SupportedTokenRemovedEvent.InputTuple,
      SupportedTokenRemovedEvent.OutputTuple,
      SupportedTokenRemovedEvent.OutputObject
    >;
    SupportedTokenRemoved: TypedContractEvent<
      SupportedTokenRemovedEvent.InputTuple,
      SupportedTokenRemovedEvent.OutputTuple,
      SupportedTokenRemovedEvent.OutputObject
    >;

    "WithdrawalInitiatedOnL2(address,address,address,uint256,bytes)": TypedContractEvent<
      WithdrawalInitiatedOnL2Event.InputTuple,
      WithdrawalInitiatedOnL2Event.OutputTuple,
      WithdrawalInitiatedOnL2Event.OutputObject
    >;
    WithdrawalInitiatedOnL2: TypedContractEvent<
      WithdrawalInitiatedOnL2Event.InputTuple,
      WithdrawalInitiatedOnL2Event.OutputTuple,
      WithdrawalInitiatedOnL2Event.OutputObject
    >;
  };
}
