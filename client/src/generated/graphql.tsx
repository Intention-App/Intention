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

export type Board = {
  __typename?: 'Board';
  id: Scalars['String'];
  title: Scalars['String'];
  tasklists: Array<Tasklist>;
  tasklistOrder?: Maybe<Array<Scalars['String']>>;
  userId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type BoardOptionsInput = {
  title?: Maybe<Scalars['String']>;
  tasklistOrder?: Maybe<Array<Scalars['String']>>;
};

export type CreateTaskOptionsInput = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dueAt?: Maybe<Scalars['DateTime']>;
  archived?: Maybe<Scalars['Boolean']>;
  tasklistId: Scalars['String'];
};

export type CreateTasklistOptionsInput = {
  title?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  taskOrder?: Maybe<Array<Scalars['String']>>;
  boardId: Scalars['String'];
};


export type Entry = {
  __typename?: 'Entry';
  id: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['JSON'];
  userId: Scalars['String'];
  rootFolderId?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type EntryOptionsInput = {
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['JSON']>;
  folderId?: Maybe<Scalars['String']>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Folder = {
  __typename?: 'Folder';
  id: Scalars['String'];
  title: Scalars['String'];
  rootFolderId?: Maybe<Scalars['String']>;
  content?: Maybe<Array<Entry>>;
  children?: Maybe<Array<Folder>>;
  userId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type FolderOptionsInput = {
  folderId?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};


export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  createEntry: Entry;
  deleteEntry?: Maybe<Scalars['String']>;
  updateEntry: Entry;
  createFolder: Folder;
  deleteFolder?: Maybe<Scalars['String']>;
  updateFolder: Folder;
  createBoard: Board;
  deleteBoard: Scalars['Boolean'];
  updateBoard: Board;
  createTasklist: Tasklist;
  deleteTasklist: Scalars['Boolean'];
  updateTasklist: Tasklist;
  createTask: Task;
  deleteTask?: Maybe<Scalars['Boolean']>;
  updateTask: Task;
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
  id: Scalars['String'];
};


export type MutationUpdateEntryArgs = {
  options: EntryOptionsInput;
  id: Scalars['String'];
};


export type MutationCreateFolderArgs = {
  options: FolderOptionsInput;
};


export type MutationDeleteFolderArgs = {
  id: Scalars['String'];
};


export type MutationUpdateFolderArgs = {
  options: FolderOptionsInput;
  id: Scalars['String'];
};


export type MutationCreateBoardArgs = {
  options: BoardOptionsInput;
};


export type MutationDeleteBoardArgs = {
  id: Scalars['String'];
};


export type MutationUpdateBoardArgs = {
  options: BoardOptionsInput;
  id: Scalars['String'];
};


export type MutationCreateTasklistArgs = {
  options: CreateTasklistOptionsInput;
};


export type MutationDeleteTasklistArgs = {
  id: Scalars['String'];
};


export type MutationUpdateTasklistArgs = {
  options: TasklistOptionsInput;
  id: Scalars['String'];
};


export type MutationCreateTaskArgs = {
  options: CreateTaskOptionsInput;
};


export type MutationDeleteTaskArgs = {
  id: Scalars['String'];
};


export type MutationUpdateTaskArgs = {
  options: TaskOptionsInput;
  id: Scalars['String'];
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
  boards: Array<Board>;
  board: Board;
  myBoards: Array<Board>;
  myBoard: Board;
  tasklists: Array<Tasklist>;
  tasklist: Tasklist;
  myTasklists: Array<Tasklist>;
  myTasklist: Tasklist;
  tasks: Array<Task>;
  task: Task;
  myTasks: Array<Task>;
  myTask: Task;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryEntryArgs = {
  id: Scalars['String'];
};


export type QueryMyEntriesArgs = {
  rootFolderId?: Maybe<Scalars['String']>;
};


export type QueryMyEntryArgs = {
  id: Scalars['String'];
};


export type QueryFolderArgs = {
  id: Scalars['String'];
};


export type QueryMyFoldersArgs = {
  rootFolderId?: Maybe<Scalars['String']>;
};


export type QueryMyFolderArgs = {
  id: Scalars['String'];
};


export type QueryBoardArgs = {
  id: Scalars['String'];
};


export type QueryMyBoardArgs = {
  id: Scalars['String'];
};


export type QueryTasklistArgs = {
  id: Scalars['String'];
};


export type QueryMyTasklistArgs = {
  id: Scalars['String'];
};


export type QueryTaskArgs = {
  id: Scalars['String'];
};


export type QueryMyTaskArgs = {
  id: Scalars['String'];
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  dueAt?: Maybe<Scalars['DateTime']>;
  archived: Scalars['Boolean'];
  tasklistId: Scalars['String'];
  userId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type TaskOptionsInput = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dueAt?: Maybe<Scalars['DateTime']>;
  archived?: Maybe<Scalars['Boolean']>;
  tasklistId?: Maybe<Scalars['String']>;
};

export type Tasklist = {
  __typename?: 'Tasklist';
  id: Scalars['String'];
  title: Scalars['String'];
  color?: Maybe<Scalars['String']>;
  tasks: Array<Task>;
  taskOrder: Array<Scalars['String']>;
  boardId: Scalars['String'];
  userId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type TasklistOptionsInput = {
  title?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  taskOrder?: Maybe<Array<Scalars['String']>>;
  boardId?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
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

export type RegularBoardFragment = (
  { __typename?: 'Board' }
  & Pick<Board, 'id' | 'title' | 'userId' | 'createdAt' | 'updatedAt'>
);

export type RegularEntryFragment = (
  { __typename?: 'Entry' }
  & Pick<Entry, 'id' | 'title' | 'content' | 'rootFolderId' | 'createdAt' | 'updatedAt'>
);

export type RegularFolderFragment = (
  { __typename?: 'Folder' }
  & Pick<Folder, 'id' | 'title' | 'rootFolderId' | 'createdAt' | 'updatedAt'>
);

export type RegularTaskFragment = (
  { __typename?: 'Task' }
  & Pick<Task, 'id' | 'title' | 'dueAt' | 'archived' | 'userId' | 'tasklistId' | 'createdAt' | 'updatedAt'>
);

export type RegularTasklistFragment = (
  { __typename?: 'Tasklist' }
  & Pick<Tasklist, 'id' | 'title' | 'color' | 'userId' | 'boardId' | 'createdAt' | 'updatedAt'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type CreateEntryMutationVariables = Exact<{
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['JSON']>;
  folderId?: Maybe<Scalars['String']>;
}>;


export type CreateEntryMutation = (
  { __typename?: 'Mutation' }
  & { createEntry: (
    { __typename?: 'Entry' }
    & RegularEntryFragment
  ) }
);

export type CreateFolderMutationVariables = Exact<{
  title?: Maybe<Scalars['String']>;
  folderId?: Maybe<Scalars['String']>;
}>;


export type CreateFolderMutation = (
  { __typename?: 'Mutation' }
  & { createFolder: (
    { __typename?: 'Folder' }
    & RegularFolderFragment
  ) }
);

export type DeleteEntryMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteEntryMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteEntry'>
);

export type DeleteFolderMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteFolderMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteFolder'>
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
  id: Scalars['String'];
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

export type UpdateFolderMutationVariables = Exact<{
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  folderId?: Maybe<Scalars['String']>;
}>;


export type UpdateFolderMutation = (
  { __typename?: 'Mutation' }
  & { updateFolder: (
    { __typename?: 'Folder' }
    & RegularFolderFragment
  ) }
);

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  dueAt?: Maybe<Scalars['DateTime']>;
  archived?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  tasklistId?: Maybe<Scalars['String']>;
}>;


export type UpdateTaskMutation = (
  { __typename?: 'Mutation' }
  & { updateTask: (
    { __typename?: 'Task' }
    & RegularTaskFragment
  ) }
);

export type UpdateTasklistMutationVariables = Exact<{
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  taskOrder?: Maybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type UpdateTasklistMutation = (
  { __typename?: 'Mutation' }
  & { updateTasklist: (
    { __typename?: 'Tasklist' }
    & RegularTasklistFragment
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

export type MyBoardQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type MyBoardQuery = (
  { __typename?: 'Query' }
  & { myBoard: (
    { __typename?: 'Board' }
    & Pick<Board, 'tasklistOrder'>
    & { tasklists: Array<(
      { __typename?: 'Tasklist' }
      & Pick<Tasklist, 'taskOrder'>
      & { tasks: Array<(
        { __typename?: 'Task' }
        & RegularTaskFragment
      )> }
      & RegularTasklistFragment
    )> }
    & RegularBoardFragment
  ) }
);

export type MyEntriesQueryVariables = Exact<{
  rootFolderId?: Maybe<Scalars['String']>;
}>;


export type MyEntriesQuery = (
  { __typename?: 'Query' }
  & { myEntries: Array<(
    { __typename?: 'Entry' }
    & RegularEntryFragment
  )> }
);

export type MyEntryQueryVariables = Exact<{
  entryId: Scalars['String'];
}>;


export type MyEntryQuery = (
  { __typename?: 'Query' }
  & { myEntry: (
    { __typename?: 'Entry' }
    & RegularEntryFragment
  ) }
);

export type MyFolderQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type MyFolderQuery = (
  { __typename?: 'Query' }
  & { myFolder: (
    { __typename?: 'Folder' }
    & { children?: Maybe<Array<(
      { __typename?: 'Folder' }
      & RegularFolderFragment
    )>>, content?: Maybe<Array<(
      { __typename?: 'Entry' }
      & RegularEntryFragment
    )>> }
    & RegularFolderFragment
  ) }
);

export type MyFoldersQueryVariables = Exact<{
  rootFolderId?: Maybe<Scalars['String']>;
}>;


export type MyFoldersQuery = (
  { __typename?: 'Query' }
  & { myFolders: Array<(
    { __typename?: 'Folder' }
    & RegularFolderFragment
  )> }
);

export const RegularBoardFragmentDoc = gql`
    fragment RegularBoard on Board {
  id
  title
  userId
  createdAt
  updatedAt
}
    `;
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
export const RegularTaskFragmentDoc = gql`
    fragment RegularTask on Task {
  id
  title
  dueAt
  archived
  userId
  tasklistId
  createdAt
  updatedAt
}
    `;
export const RegularTasklistFragmentDoc = gql`
    fragment RegularTasklist on Tasklist {
  id
  title
  color
  userId
  boardId
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
    mutation CreateEntry($title: String, $content: JSON, $folderId: String) {
  createEntry(options: {title: $title, content: $content, folderId: $folderId}) {
    ...RegularEntry
  }
}
    ${RegularEntryFragmentDoc}`;

export function useCreateEntryMutation() {
  return Urql.useMutation<CreateEntryMutation, CreateEntryMutationVariables>(CreateEntryDocument);
};
export const CreateFolderDocument = gql`
    mutation CreateFolder($title: String, $folderId: String) {
  createFolder(options: {title: $title, folderId: $folderId}) {
    ...RegularFolder
  }
}
    ${RegularFolderFragmentDoc}`;

export function useCreateFolderMutation() {
  return Urql.useMutation<CreateFolderMutation, CreateFolderMutationVariables>(CreateFolderDocument);
};
export const DeleteEntryDocument = gql`
    mutation DeleteEntry($id: String!) {
  deleteEntry(id: $id)
}
    `;

export function useDeleteEntryMutation() {
  return Urql.useMutation<DeleteEntryMutation, DeleteEntryMutationVariables>(DeleteEntryDocument);
};
export const DeleteFolderDocument = gql`
    mutation DeleteFolder($id: String!) {
  deleteFolder(id: $id)
}
    `;

export function useDeleteFolderMutation() {
  return Urql.useMutation<DeleteFolderMutation, DeleteFolderMutationVariables>(DeleteFolderDocument);
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
    mutation UpdateEntry($id: String!, $title: String, $content: JSON) {
  updateEntry(id: $id, options: {title: $title, content: $content}) {
    ...RegularEntry
  }
}
    ${RegularEntryFragmentDoc}`;

export function useUpdateEntryMutation() {
  return Urql.useMutation<UpdateEntryMutation, UpdateEntryMutationVariables>(UpdateEntryDocument);
};
export const UpdateFolderDocument = gql`
    mutation UpdateFolder($id: String!, $title: String, $folderId: String) {
  updateFolder(id: $id, options: {title: $title, folderId: $folderId}) {
    ...RegularFolder
  }
}
    ${RegularFolderFragmentDoc}`;

export function useUpdateFolderMutation() {
  return Urql.useMutation<UpdateFolderMutation, UpdateFolderMutationVariables>(UpdateFolderDocument);
};
export const UpdateTaskDocument = gql`
    mutation updateTask($id: String!, $title: String, $dueAt: DateTime, $archived: Boolean, $description: String, $tasklistId: String) {
  updateTask(
    id: $id
    options: {title: $title, dueAt: $dueAt, archived: $archived, description: $description, tasklistId: $tasklistId}
  ) {
    ...RegularTask
  }
}
    ${RegularTaskFragmentDoc}`;

export function useUpdateTaskMutation() {
  return Urql.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument);
};
export const UpdateTasklistDocument = gql`
    mutation updateTasklist($id: String!, $title: String, $color: String, $taskOrder: [String!]) {
  updateTasklist(
    id: $id
    options: {title: $title, color: $color, taskOrder: $taskOrder}
  ) {
    ...RegularTasklist
  }
}
    ${RegularTasklistFragmentDoc}`;

export function useUpdateTasklistMutation() {
  return Urql.useMutation<UpdateTasklistMutation, UpdateTasklistMutationVariables>(UpdateTasklistDocument);
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
export const MyBoardDocument = gql`
    query myBoard($id: String!) {
  myBoard(id: $id) {
    ...RegularBoard
    tasklistOrder
    tasklists {
      ...RegularTasklist
      taskOrder
      tasks {
        ...RegularTask
      }
    }
  }
}
    ${RegularBoardFragmentDoc}
${RegularTasklistFragmentDoc}
${RegularTaskFragmentDoc}`;

export function useMyBoardQuery(options: Omit<Urql.UseQueryArgs<MyBoardQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyBoardQuery>({ query: MyBoardDocument, ...options });
};
export const MyEntriesDocument = gql`
    query myEntries($rootFolderId: String) {
  myEntries(rootFolderId: $rootFolderId) {
    ...RegularEntry
  }
}
    ${RegularEntryFragmentDoc}`;

export function useMyEntriesQuery(options: Omit<Urql.UseQueryArgs<MyEntriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyEntriesQuery>({ query: MyEntriesDocument, ...options });
};
export const MyEntryDocument = gql`
    query myEntry($entryId: String!) {
  myEntry(id: $entryId) {
    ...RegularEntry
  }
}
    ${RegularEntryFragmentDoc}`;

export function useMyEntryQuery(options: Omit<Urql.UseQueryArgs<MyEntryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyEntryQuery>({ query: MyEntryDocument, ...options });
};
export const MyFolderDocument = gql`
    query myFolder($id: String!) {
  myFolder(id: $id) {
    ...RegularFolder
    children {
      ...RegularFolder
    }
    content {
      ...RegularEntry
    }
  }
}
    ${RegularFolderFragmentDoc}
${RegularEntryFragmentDoc}`;

export function useMyFolderQuery(options: Omit<Urql.UseQueryArgs<MyFolderQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyFolderQuery>({ query: MyFolderDocument, ...options });
};
export const MyFoldersDocument = gql`
    query myFolders($rootFolderId: String) {
  myFolders(rootFolderId: $rootFolderId) {
    ...RegularFolder
  }
}
    ${RegularFolderFragmentDoc}`;

export function useMyFoldersQuery(options: Omit<Urql.UseQueryArgs<MyFoldersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyFoldersQuery>({ query: MyFoldersDocument, ...options });
};