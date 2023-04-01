import type {
  Abi,
  AbiError,
  AbiEvent,
  AbiFunction,
  AbiParameter,
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  AbiStateMutability,
  Address,
  ExtractAbiFunction,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiError,
  ExtractAbiErrorNames,
  ExtractAbiFunctionNames,
  Narrow,
  AbiConstructor,
} from 'abitype'
import type { Hex, LogTopic } from './misc'
import type { TransactionRequest } from './transaction'
import type { Filter, MaybeRequired } from './utils'

export type AbiItem = Abi[number]

export type EventDefinition = `${string}(${string})`

export type ContractFunctionConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = {
  /** Contract ABI */
  abi: Narrow<TAbi>
  /** Contract address */
  address: Address
  /** Function to invoke on the contract */
  functionName: InferFunctionName<TAbi, TFunctionName, TAbiStateMutability>
} & GetFunctionArgs<TAbi, TFunctionName>

export type ContractFunctionResult<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiFunction extends AbiFunction & {
    type: 'function'
  } = TAbi extends Abi ? ExtractAbiFunction<TAbi, TFunctionName> : AbiFunction,
  TArgs = AbiParametersToPrimitiveTypes<TAbiFunction['outputs']>,
  FailedToParseArgs =
    | ([TArgs] extends [never] ? true : false)
    | (readonly unknown[] extends TArgs ? true : false),
> = true extends FailedToParseArgs
  ? unknown
  : TArgs extends readonly []
  ? void
  : TArgs extends readonly [infer Arg]
  ? Arg
  : TArgs

export type GetValue<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TValueType = TransactionRequest['value'],
  TAbiFunction extends AbiFunction = TAbi extends Abi
    ? ExtractAbiFunction<TAbi, TFunctionName>
    : AbiFunction,
> = TAbiFunction['stateMutability'] extends 'payable'
  ? { value?: TValueType }
  : TAbiFunction['payable'] extends true
  ? { value?: TValueType }
  : unknown

export type MaybeAbiEventName<TAbiEvent extends AbiEvent | undefined> =
  TAbiEvent extends AbiEvent ? TAbiEvent['name'] : undefined

export type MaybeExtractEventArgsFromAbi<
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string | undefined = undefined,
> = TEventName extends string ? GetEventArgs<TAbi, TEventName> : undefined

//////////////////////////////////////////////////////////////////////
// ABI item name

export type InferErrorName<
  TAbi extends Abi | readonly unknown[] = Abi,
  TErrorName extends string = string,
> = TAbi extends Abi
  ? ExtractAbiErrorNames<TAbi> extends infer AbiErrorNames
    ?
        | AbiErrorNames
        | (TErrorName extends AbiErrorNames ? TErrorName : never)
        | (Abi extends TAbi ? string : never)
    : never
  : TErrorName

export type InferEventName<
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string | undefined = string,
> = TAbi extends Abi
  ? ExtractAbiEventNames<TAbi> extends infer AbiEventNames
    ? AbiEventNames | (TEventName extends AbiEventNames ? TEventName : never)
    : never
  : TEventName

export type InferFunctionName<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = TAbi extends Abi
  ? ExtractAbiFunctionNames<
      TAbi,
      TAbiStateMutability
    > extends infer AbiFunctionNames
    ?
        | AbiFunctionNames
        | (TFunctionName extends AbiFunctionNames ? TFunctionName : never)
        | (Abi extends TAbi ? string : never)
    : never
  : TFunctionName

export type InferItemName<
  TAbi extends Abi | readonly unknown[] = Abi,
  TName extends string = string,
> = TAbi extends Abi
  ? ExtractAbiItemNames<TAbi> extends infer AbiNames
    ?
        | AbiNames
        | (TName extends AbiNames ? TName : never)
        | (Abi extends TAbi ? string : never)
    : never
  : TName
type ExtractAbiItemNames<TAbi extends Abi> =
  | ExtractAbiFunctionNames<TAbi>
  | ExtractAbiEventNames<TAbi>
  | ExtractAbiErrorNames<TAbi>

//////////////////////////////////////////////////////////////////////
// ABI item args

export type GetFunctionArgs<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TAbiFunction extends AbiFunction = TAbi extends Abi
    ? ExtractAbiFunction<TAbi, TFunctionName>
    : AbiFunction,
  TArgs = AbiParametersToPrimitiveTypes<TAbiFunction['inputs']>,
  FailedToParseArgs =
    | ([TArgs] extends [never] ? true : false)
    | (readonly unknown[] extends TArgs ? true : false),
> = true extends FailedToParseArgs
  ? {
      /**
       * Arguments to pass contract method
       *
       * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
       */
      args?: readonly unknown[]
    }
  : TArgs extends readonly []
  ? { args?: never }
  : {
      /** Arguments to pass contract method */ args: TArgs
    }

export type GetConstructorArgs<
  TAbi extends Abi | readonly unknown[],
  TAbiConstructor extends AbiConstructor = TAbi extends Abi
    ? Extract<TAbi[number], { type: 'constructor' }>
    : AbiConstructor,
  TArgs = AbiParametersToPrimitiveTypes<TAbiConstructor['inputs']>,
  FailedToParseArgs =
    | ([TArgs] extends [never] ? true : false)
    | (readonly unknown[] extends TArgs ? true : false),
> = true extends FailedToParseArgs
  ? {
      /**
       * Arguments to pass contract constructor
       *
       * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
       */
      args?: readonly unknown[]
    }
  : TArgs extends readonly []
  ? { args?: never }
  : {
      /** Arguments to pass contract constructor */ args: TArgs
    }

export type GetErrorArgs<
  TAbi extends Abi | readonly unknown[],
  TErrorName extends string,
  TAbiError extends AbiError = TAbi extends Abi
    ? ExtractAbiError<TAbi, TErrorName>
    : AbiError,
  TArgs = AbiParametersToPrimitiveTypes<TAbiError['inputs']>,
  FailedToParseArgs =
    | ([TArgs] extends [never] ? true : false)
    | (readonly unknown[] extends TArgs ? true : false),
> = true extends FailedToParseArgs
  ? {
      /**
       * Arguments to pass contract method
       *
       * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
       */
      args?: readonly unknown[]
    }
  : TArgs extends readonly []
  ? { args?: never }
  : {
      /** Arguments to pass contract method */ args: TArgs
    }

export type GetEventArgs<
  TAbi extends Abi | readonly unknown[],
  TEventName extends string,
  TConfig extends EventParameterOptions = DefaultEventParameterOptions,
  TAbiEvent extends AbiEvent & { type: 'event' } = TAbi extends Abi
    ? ExtractAbiEvent<TAbi, TEventName>
    : AbiEvent & { type: 'event' },
  TArgs = AbiEventParametersToPrimitiveTypes<TAbiEvent['inputs'], TConfig>,
  FailedToParseArgs =
    | ([TArgs] extends [never] ? true : false)
    | (readonly unknown[] extends TArgs ? true : false),
> = true extends FailedToParseArgs
  ? readonly unknown[]
  : TArgs extends readonly []
  ? never
  : TArgs

export type GetEventArgsFromTopics<
  TAbi extends Abi | readonly unknown[],
  TEventName extends string,
  TTopics extends LogTopic[],
  TData extends Hex | undefined,
  TAbiEvent extends AbiEvent & { type: 'event' } = TAbi extends Abi
    ? ExtractAbiEvent<TAbi, TEventName>
    : AbiEvent & { type: 'event' },
  TArgs = AbiEventTopicsToPrimitiveTypes<TAbiEvent['inputs'], TTopics, TData>,
> = TTopics extends readonly []
  ? TData extends undefined
    ? { args?: never }
    : { args?: TArgs }
  : { args?: TArgs }

//////////////////////////////////////////////////////////////////////
// ABI event types

type EventParameterOptions = {
  EnableUnion?: boolean
  IndexedOnly?: boolean
  Required?: boolean
}
type DefaultEventParameterOptions = {
  EnableUnion: true
  IndexedOnly: true
  Required: false
}

type HashedEventTypes = 'bytes' | 'string' | 'tuple' | `${string}[${string}]`

// TODO: Speed up by returning immediately as soon as named parameter is found.
type _HasUnnamedAbiParameter<TAbiParameters extends readonly AbiParameter[]> =
  TAbiParameters extends readonly [
    infer Head extends AbiParameter,
    ...infer Tail extends readonly AbiParameter[],
  ]
    ? Head extends { name: string }
      ? Head['name'] extends ''
        ? true
        : _HasUnnamedAbiParameter<Tail>
      : true
    : false

/**
 * @internal
 */
export type LogTopicType<
  TPrimitiveType = Hex,
  TTopic extends LogTopic = LogTopic,
> = TTopic extends Hex
  ? TPrimitiveType
  : TTopic extends Hex[]
  ? TPrimitiveType[]
  : TTopic extends null
  ? null
  : never

/**
 * @internal
 */
export type AbiEventParameterToPrimitiveType<
  TAbiParameter extends AbiParameter,
  Options extends EventParameterOptions = DefaultEventParameterOptions,
  _Type = AbiParameterToPrimitiveType<TAbiParameter>,
> = Options['EnableUnion'] extends true ? LogTopicType<_Type> : _Type

/**
 * @internal
 */
export type AbiEventTopicToPrimitiveType<
  TAbiParameter extends AbiParameter,
  TTopic extends LogTopic,
  TPrimitiveType = TAbiParameter['type'] extends HashedEventTypes
    ? TTopic
    : AbiParameterToPrimitiveType<TAbiParameter>,
> = LogTopicType<TPrimitiveType, TTopic>

export type AbiEventParametersToPrimitiveTypes<
  TAbiParameters extends readonly AbiParameter[],
  Options extends EventParameterOptions = DefaultEventParameterOptions,
  // Remove non-indexed parameters based on `Options['IndexedOnly']`
> = TAbiParameters extends readonly []
  ? readonly []
  : Filter<
      TAbiParameters,
      Options['IndexedOnly'] extends true ? { indexed: true } : object
    > extends infer Filtered extends readonly AbiParameter[]
  ? _HasUnnamedAbiParameter<Filtered> extends true
    ? // Has unnamed tuple parameters so return as array
        | readonly [
            ...{
              [K in keyof Filtered]: AbiEventParameterToPrimitiveType<
                Filtered[K],
                Options
              >
            },
          ]
        | (Options['Required'] extends true
            ? never
            : // Distribute over tuple to represent optional parameters
            Filtered extends readonly [
                ...infer Head extends readonly AbiParameter[],
                infer _,
              ]
            ? AbiEventParametersToPrimitiveTypes<
                readonly [...{ [K in keyof Head]: Omit<Head[K], 'name'> }],
                Options
              >
            : never)
    : // All tuple parameters are named so return as object
    {
        [Parameter in
          Filtered[number] as Parameter extends {
            name: infer Name extends string
          }
            ? Name
            : never]?: AbiEventParameterToPrimitiveType<Parameter, Options>
      } extends infer Mapped
    ? MaybeRequired<
        Mapped,
        Options['Required'] extends boolean ? Options['Required'] : false
      >
    : never
  : never

/**
 * @internal
 */
// TODO(@tmm): Simplify this type
export type AbiEventTopicsToPrimitiveTypes<
  TAbiParameters extends readonly AbiParameter[],
  TTopics extends LogTopic[] | undefined = undefined,
  TData extends Hex | undefined = undefined,
  TBase = TAbiParameters[0] extends { name: string } ? {} : [],
> = TAbiParameters extends readonly [
  infer Head extends AbiParameter,
  ...infer Tail,
]
  ? TTopics extends readonly [infer TopicHead, ...infer TopicTail]
    ? Head extends { indexed: true }
      ? Head extends { name: infer Name extends string }
        ? {
            [_ in Name]: TopicHead extends LogTopic
              ? AbiEventTopicToPrimitiveType<Head, TopicHead>
              : never
          } & (Tail extends readonly []
            ? {}
            : Tail extends readonly AbiParameter[]
            ? TopicTail extends LogTopic[]
              ? AbiEventTopicsToPrimitiveTypes<Tail, TopicTail, TData>
              : {}
            : {})
        : [
            TopicHead extends LogTopic
              ? AbiEventTopicToPrimitiveType<Head, TopicHead>
              : never,
            ...(Tail extends readonly []
              ? []
              : Tail extends readonly AbiParameter[]
              ? TopicTail extends LogTopic[]
                ? AbiEventTopicsToPrimitiveTypes<Tail, TopicTail, TData>
                : []
              : []),
          ]
      : TBase
    : TTopics extends readonly []
    ? TData extends '0x'
      ? TBase
      : TData extends Hex
      ? Head extends AbiParameter
        ? Head extends { indexed: true }
          ? Tail extends readonly AbiParameter[]
            ? AbiEventTopicsToPrimitiveTypes<Tail, [], TData>
            : TBase
          : Head extends { name: infer Name extends string }
          ? {
              [_ in Name]: AbiParameterToPrimitiveType<Head>
            } & (Tail extends readonly []
              ? {}
              : Tail extends readonly AbiParameter[]
              ? AbiEventTopicsToPrimitiveTypes<Tail, [], TData>
              : {})
          : [
              AbiParameterToPrimitiveType<Head>,
              ...(Tail extends readonly []
                ? []
                : Tail extends readonly AbiParameter[]
                ? AbiEventTopicsToPrimitiveTypes<Tail, [], TData>
                : []),
            ]
        : TBase
      : TBase
    : TBase
  : undefined
