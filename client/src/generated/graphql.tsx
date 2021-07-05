import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};


export type Entry = {
  __typename?: 'Entry';
  id: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['JSON'];
  userId: Scalars['Int'];
  rootFolderId?: Maybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type EntryOptionsInput = {
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['JSON']>;
  folderId?: Maybe<Scalars['Int']>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Folder = {
  __typename?: 'Folder';
  id: Scalars['Int'];
  title: Scalars['String'];
  userId: Scalars['Int'];
  rootFolderId?: Maybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type FolderOptionsInput = {
  folderId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};


export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  createEntry: Entry;
  deleteEntry: Scalars['Boolean'];
  updateEntry: Entry;
  createFolder: Folder;
  deleteFolder: Scalars['Boolean'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  options: UsernameOrEmailInput;
};


export type MutationCreateEntryArgs = {
  options: EntryOptionsInput;
};


export type MutationDeleteEntryArgs = {
  id: Scalars['Int'];
};


export type MutationUpdateEntryArgs = {
  options: EntryOptionsInput;
  id: Scalars['Int'];
};


export type MutationCreateFolderArgs = {
  options: FolderOptionsInput;
};


export type MutationDeleteFolderArgs = {
  id: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  users: Array<User>;
  user?: Maybe<User>;
  me?: Maybe<User>;
  entries: Array<Entry>;
  entry: Entry;
  myEntries: Array<Entry>;
  myEntry: Entry;
  folders: Array<Folder>;
  folder: Folder;
  myFolders: Array<Folder>;
  myFolder: Folder;
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};


export type QueryEntryArgs = {
  id: Scalars['Float'];
};


export type QueryMyEntriesArgs = {
  rootFolderId?: Maybe<Scalars['Int']>;
};


export type QueryMyEntryArgs = {
  id: Scalars['Int'];
};


export type QueryFolderArgs = {
  id: Scalars['Int'];
};


export type QueryMyFoldersArgs = {
  rootFolderId?: Maybe<Scalars['Int']>;
};


export type QueryMyFolderArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  username: Scalars['String'];
  email: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernameOrEmailInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type RegularEntryFragment = (
  { __typename?: 'Entry' }
  & Pick<Entry, 'id' | 'title' | 'content' | 'rootFolderId' | 'createdAt' | 'updatedAt'>
);

export type RegularFolderFragment = (
  { __typename?: 'Folder' }
  & Pick<Folder, 'id' | 'title' | 'rootFolderId' | 'createdAt' | 'updatedAt'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type CreateEntryMutationVariables = Exact<{
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['JSON']>;
  folderId?: Maybe<Scalars['Int']>;
}>;


export type CreateEntryMutation = (
  { __typename?: 'Mutation' }
  & { createEntry: (
    { __typename?: 'Entry' }
    & RegularEntryFragment
  ) }
);

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type UpdateEntryMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['JSON']>;
}>;


export type UpdateEntryMutation = (
  { __typename?: 'Mutation' }
  & { updateEntry: (
    { __typename?: 'Entry' }
    & RegularEntryFragment
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type MyEntriesQueryVariables = Exact<{
  rootFolderId?: Maybe<Scalars['Int']>;
}>;


export type MyEntriesQuery = (
  { __typename?: 'Query' }
  & { myEntries: Array<(
    { __typename?: 'Entry' }
    & RegularEntryFragment
  )> }
);

export type MyEntryQueryVariables = Exact<{
  entryId: Scalars['Int'];
}>;


export type MyEntryQuery = (
  { __typename?: 'Query' }
  & { myEntry: (
    { __typename?: 'Entry' }
    & RegularEntryFragment
  ) }
);

export type MyFolderQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type MyFolderQuery = (
  { __typename?: 'Query' }
  & { myFolder: (
    { __typename?: 'Folder' }
    & RegularFolderFragment
  ) }
);

export type MyFoldersQueryVariables = Exact<{
  rootFolderId?: Maybe<Scalars['Int']>;
}>;


export type MyFoldersQuery = (
  { __typename?: 'Query' }
  & { myFolders: Array<(
    { __typename?: 'Folder' }
    & RegularFolderFragment
  )> }
);

export const RegularEntryFragmentDoc = gql`
    fragment RegularEntry on Entry {
  id
  title
  content
  rootFolderId
  createdAt
  updatedAt
}
    `;
export const RegularFolderFragmentDoc = gql`
    fragment RegularFolder on Folder {
  id
  title
  rootFolderId
  createdAt
  updatedAt
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const CreateEntryDocument = gql`
    mutation CreateEntry($title: String, $content: JSON, $folderId: Int) {
  createEntry(options: {title: $title, content: $content, folderId: $folderId}) {
    ...RegularEntry
  }
}
    ${RegularEntryFragmentDoc}`;

export function useCreateEntryMutation() {
  return Urql.useMutation<CreateEntryMutation, CreateEntryMutationVariables>(CreateEntryDocument);
};
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(options: {username: $username, password: $password}) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  register(options: {username: $username, email: $email, password: $password}) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdateEntryDocument = gql`
    mutation UpdateEntry($id: Int!, $title: String, $content: JSON) {
  updateEntry(id: $id, options: {title: $title, content: $content}) {
    ...RegularEntry
  }
}
    ${RegularEntryFragmentDoc}`;

export function useUpdateEntryMutation() {
  return Urql.useMutation<UpdateEntryMutation, UpdateEntryMutationVariables>(UpdateEntryDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const MyEntriesDocument = gql`
    query myEntries($rootFolderId: Int) {
  myEntries(rootFolderId: $rootFolderId) {
    ...RegularEntry
  }
}
    ${RegularEntryFragmentDoc}`;

export function useMyEntriesQuery(options: Omit<Urql.UseQueryArgs<MyEntriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyEntriesQuery>({ query: MyEntriesDocument, ...options });
};
export const MyEntryDocument = gql`
    query myEntry($entryId: Int!) {
  myEntry(id: $entryId) {
    ...RegularEntry
  }
}
    ${RegularEntryFragmentDoc}`;

export function useMyEntryQuery(options: Omit<Urql.UseQueryArgs<MyEntryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyEntryQuery>({ query: MyEntryDocument, ...options });
};
export const MyFolderDocument = gql`
    query myFolder($id: Int!) {
  myFolder(id: $id) {
    ...RegularFolder
  }
}
    ${RegularFolderFragmentDoc}`;

export function useMyFolderQuery(options: Omit<Urql.UseQueryArgs<MyFolderQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyFolderQuery>({ query: MyFolderDocument, ...options });
};
export const MyFoldersDocument = gql`
    query myFolders($rootFolderId: Int) {
  myFolders(rootFolderId: $rootFolderId) {
    ...RegularFolder
  }
}
    ${RegularFolderFragmentDoc}`;

export function useMyFoldersQuery(options: Omit<Urql.UseQueryArgs<MyFoldersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyFoldersQuery>({ query: MyFoldersDocument, ...options });
};