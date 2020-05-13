export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
};

/** All input for the create `Hero` mutation. */
export type CreateHeroInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Hero` to be created by this mutation. */
  hero: HeroInput;
};

/** The output of our create `Hero` mutation. */
export type CreateHeroPayload = {
   __typename?: 'CreateHeroPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Hero` that was created by this mutation. */
  hero?: Maybe<Hero>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Hero`. May be used by Relay 1. */
  heroEdge?: Maybe<HeroesEdge>;
};


/** The output of our create `Hero` mutation. */
export type CreateHeroPayloadHeroEdgeArgs = {
  orderBy?: Maybe<Array<HeroesOrderBy>>;
};


/** All input for the `deleteHeroById` mutation. */
export type DeleteHeroByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteHero` mutation. */
export type DeleteHeroInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Hero` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Hero` mutation. */
export type DeleteHeroPayload = {
   __typename?: 'DeleteHeroPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Hero` that was deleted by this mutation. */
  hero?: Maybe<Hero>;
  deletedHeroId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Hero`. May be used by Relay 1. */
  heroEdge?: Maybe<HeroesEdge>;
};


/** The output of our delete `Hero` mutation. */
export type DeleteHeroPayloadHeroEdgeArgs = {
  orderBy?: Maybe<Array<HeroesOrderBy>>;
};

export type Hero = Node & {
   __typename?: 'Hero';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  name: Scalars['String'];
};

/** A condition to be used against `Hero` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type HeroCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
};

/** A connection to a list of `Hero` values. */
export type HeroesConnection = {
   __typename?: 'HeroesConnection';
  /** A list of `Hero` objects. */
  nodes: Array<Maybe<Hero>>;
  /** A list of edges which contains the `Hero` and cursor to aid in pagination. */
  edges: Array<HeroesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Hero` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Hero` edge in the connection. */
export type HeroesEdge = {
   __typename?: 'HeroesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Hero` at the end of the edge. */
  node?: Maybe<Hero>;
};

/** Methods to use when ordering `Hero`. */
export enum HeroesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** An input for mutations affecting `Hero` */
export type HeroInput = {
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
};

/** Represents an update to a `Hero`. Fields that are set will be updated. */
export type HeroPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
   __typename?: 'Mutation';
  /** Creates a single `Hero`. */
  createHero?: Maybe<CreateHeroPayload>;
  /** Updates a single `Hero` using its globally unique id and a patch. */
  updateHero?: Maybe<UpdateHeroPayload>;
  /** Updates a single `Hero` using a unique key and a patch. */
  updateHeroById?: Maybe<UpdateHeroPayload>;
  /** Deletes a single `Hero` using its globally unique id. */
  deleteHero?: Maybe<DeleteHeroPayload>;
  /** Deletes a single `Hero` using a unique key. */
  deleteHeroById?: Maybe<DeleteHeroPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateHeroArgs = {
  input: CreateHeroInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateHeroArgs = {
  input: UpdateHeroInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateHeroByIdArgs = {
  input: UpdateHeroByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteHeroArgs = {
  input: DeleteHeroInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteHeroByIdArgs = {
  input: DeleteHeroByIdInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
   __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
   __typename?: 'Query';
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** Reads and enables pagination through a set of `Hero`. */
  allHeroes?: Maybe<HeroesConnection>;
  heroById?: Maybe<Hero>;
  /** Reads and enables pagination through a set of `Hero`. */
  herowithterm: HeroesConnection;
  /** Reads a single `Hero` using its globally unique `ID`. */
  hero?: Maybe<Hero>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAllHeroesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<HeroesOrderBy>>;
  condition?: Maybe<HeroCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryHeroByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryHerowithtermArgs = {
  term?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryHeroArgs = {
  nodeId: Scalars['ID'];
};

/** All input for the `updateHeroById` mutation. */
export type UpdateHeroByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Hero` being updated. */
  heroPatch: HeroPatch;
  id: Scalars['Int'];
};

/** All input for the `updateHero` mutation. */
export type UpdateHeroInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Hero` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Hero` being updated. */
  heroPatch: HeroPatch;
};

/** The output of our update `Hero` mutation. */
export type UpdateHeroPayload = {
   __typename?: 'UpdateHeroPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Hero` that was updated by this mutation. */
  hero?: Maybe<Hero>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Hero`. May be used by Relay 1. */
  heroEdge?: Maybe<HeroesEdge>;
};


/** The output of our update `Hero` mutation. */
export type UpdateHeroPayloadHeroEdgeArgs = {
  orderBy?: Maybe<Array<HeroesOrderBy>>;
};
