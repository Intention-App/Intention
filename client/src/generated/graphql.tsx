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
};

export type Board = {
  __typename?: 'Board';
  id: Scalars['String'];
  title: Scalars['String'];
  tasklistOrder?: Maybe<Array<Scalars['String']>>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  tasklists?: Maybe<Array<Tasklist>>;
  tasks?: Maybe<Array<Task>>;
};

export type BoardOptionsInput = {
  title?: Maybe<Scalars['String']>;
};

export type CreateTaskOptionsInput = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dueAt?: Maybe<Scalars['DateTime']>;
  tasklistId: Scalars['String'];
};

export type CreateTasklistOptionsInput = {
  title?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  boardId: Scalars['String'];
};


export type Entry = {
  __typename?: 'Entry';
  id: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  rootFolderId?: Maybe<Scalars['String']>;
};

export type EntryOptionsInput = {
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
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
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  rootFolderId?: Maybe<Scalars['String']>;
  entries?: Maybe<Array<Entry>>;
  folders?: Maybe<Array<Folder>>;
};

export type FolderOptionsInput = {
  folderId?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new board */
  createBoard: Board;
  /** Delete a board by id */
  deleteBoard: Scalars['Boolean'];
  /** Update a board by id */
  updateBoard: Board;
  updateOrder: Board;
  /** Create a new entry */
  createEntry: Entry;
  /** Delete a specific entry by id */
  deleteEntry?: Maybe<Scalars['String']>;
  /** Update a specific existing entry */
  updateEntry: Entry;
  /** Create a new folder */
  createFolder: Folder;
  /** Delete a folder by id */
  deleteFolder?: Maybe<Scalars['String']>;
  /** Update a folder by id */
  updateFolder: Folder;
  /** Create a new tasklist */
  createTasklist: Tasklist;
  /** Delete a specific tasklist */
  deleteTasklist: Scalars['Boolean'];
  updateTasklist: Tasklist;
  createTask: Task;
  deleteTask?: Maybe<Scalars['Boolean']>;
  updateTask: Task;
  archiveTask?: Maybe<Task>;
  /** Register a new user */
  register: UserResponse;
  /** Authenticate a user */
  login: UserResponse;
  /** Disconnect user */
  logout: Scalars['Boolean'];
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


export type MutationUpdateOrderArgs = {
  tasklistOrder?: Maybe<Array<Scalars['String']>>;
  tasklists: Array<TasklistInput>;
  id: Scalars['String'];
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
  explode?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
};


export type MutationUpdateFolderArgs = {
  options: FolderOptionsInput;
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


export type MutationArchiveTaskArgs = {
  archive?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationLoginArgs = {
  options: LoginInput;
};

export type Query = {
  __typename?: 'Query';
  /** DEV TOOL | Get all boards */
  boards: Array<Board>;
  /** DEV TOOL | Get specific board by ID */
  board: Board;
  /** Get all the user's boards */
  myBoards: Array<Board>;
  /** Get a specific user's board */
  myBoard: Board;
  /** DEV TOOL | Get all entries */
  entries: Array<Entry>;
  /** DEV TOOL | Get a specific entry by ID */
  entry: Entry;
  /** Get all entries of an authenticated user */
  myEntries: Array<Entry>;
  /** Get a specific entry by id of an authenticated used */
  myEntry: Entry;
  /** DEV TOOL | Get all folders */
  folders: Array<Folder>;
  /** DEV TOOL | Get a specific folder by ID */
  folder: Folder;
  /** Get all folders of an authenticated user */
  myFolders: Array<Folder>;
  /** Get a specific folder by ID of an authenticated user */
  myFolder: Folder;
  /** DEV TOOL | Get all tasklists */
  tasklists: Array<Tasklist>;
  /** DEV TOOL | Get specific tasklist by ID */
  tasklist: Tasklist;
  /** Get user's tasklists */
  myTasklists: Array<Tasklist>;
  /** Get user's specific tasklist by id */
  myTasklist: Tasklist;
  /** DEV TOOL | Get all tasks */
  tasks: Array<Task>;
  task: Task;
  myTasks: Array<Task>;
  myTask: Task;
  /** DEV TOOL | Get all users */
  users: Array<User>;
  /** DEV TOOL | Get user by id */
  user?: Maybe<User>;
  /** Get self authenticated user */
  me?: Maybe<User>;
};


export type QueryBoardArgs = {
  id: Scalars['String'];
};


export type QueryMyBoardArgs = {
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


export type QueryUserArgs = {
  id: Scalars['String'];
};

export type RegisterInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  dueAt?: Maybe<Scalars['DateTime']>;
  archivedAt?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  tasklistId: Scalars['String'];
  boardId: Scalars['String'];
};

export type TaskOptionsInput = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dueAt?: Maybe<Scalars['DateTime']>;
};

export type Tasklist = {
  __typename?: 'Tasklist';
  id: Scalars['String'];
  title: Scalars['String'];
  color?: Maybe<Scalars['String']>;
  taskOrder?: Maybe<Array<Scalars['String']>>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  tasks?: Maybe<Array<Task>>;
  boardId: Scalars['String'];
};

export type TasklistInput = {
  id: Scalars['String'];
  taskOrder: Array<Scalars['String']>;
};

export type TasklistOptionsInput = {
  title?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  boards?: Maybe<Array<Board>>;
  tasklists?: Maybe<Array<Tasklist>>;
  tasks?: Maybe<Array<Task>>;
  entries?: Maybe<Array<Entry>>;
  folders?: Maybe<Array<Folder>>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegularBoardFragment = (
  { __typename?: 'Board' }
  & Pick<Board, 'id' | 'title' | 'createdAt' | 'updatedAt'>
);

export type MyBoardsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyBoardsQuery = (
  { __typename?: 'Query' }
  & { myBoards: Array<(
    { __typename?: 'Board' }
    & RegularBoardFragment
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
    & { tasks?: Maybe<Array<(
      { __typename?: 'Task' }
      & RegularTaskFragment
    )>>, tasklists?: Maybe<Array<(
      { __typename?: 'Tasklist' }
      & Pick<Tasklist, 'taskOrder'>
      & RegularTasklistFragment
    )>> }
    & RegularBoardFragment
  ) }
);

export type CreateBoardMutationVariables = Exact<{
  title?: Maybe<Scalars['String']>;
}>;


export type CreateBoardMutation = (
  { __typename?: 'Mutation' }
  & { createBoard: (
    { __typename?: 'Board' }
    & RegularBoardFragment
  ) }
);

export type UpdateBoardMutationVariables = Exact<{
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
}>;


export type UpdateBoardMutation = (
  { __typename?: 'Mutation' }
  & { updateBoard: (
    { __typename?: 'Board' }
    & RegularBoardFragment
  ) }
);

export type UpdateOrderMutationVariables = Exact<{
  id: Scalars['String'];
  tasklists: Array<TasklistInput> | TasklistInput;
  tasklistOrder?: Maybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type UpdateOrderMutation = (
  { __typename?: 'Mutation' }
  & { updateOrder: (
    { __typename?: 'Board' }
    & RegularBoardFragment
  ) }
);

export type DeleteBoardMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteBoardMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteBoard'>
);

export type RegularTaskFragment = (
  { __typename?: 'Task' }
  & Pick<Task, 'id' | 'title' | 'description' | 'dueAt' | 'archivedAt' | 'tasklistId' | 'boardId' | 'createdAt' | 'updatedAt'>
);

export type CreateTaskMutationVariables = Exact<{
  title?: Maybe<Scalars['String']>;
  dueAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  tasklistId: Scalars['String'];
}>;


export type CreateTaskMutation = (
  { __typename?: 'Mutation' }
  & { createTask: (
    { __typename?: 'Task' }
    & RegularTaskFragment
  ) }
);

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  dueAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
}>;


export type UpdateTaskMutation = (
  { __typename?: 'Mutation' }
  & { updateTask: (
    { __typename?: 'Task' }
    & RegularTaskFragment
  ) }
);

export type ArchiveTaskMutationVariables = Exact<{
  id: Scalars['String'];
  archive?: Maybe<Scalars['Boolean']>;
}>;


export type ArchiveTaskMutation = (
  { __typename?: 'Mutation' }
  & { archiveTask?: Maybe<(
    { __typename?: 'Task' }
    & Pick<Task, 'id'>
  )> }
);

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteTaskMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteTask'>
);

export type RegularTasklistFragment = (
  { __typename?: 'Tasklist' }
  & Pick<Tasklist, 'id' | 'title' | 'color' | 'boardId' | 'createdAt' | 'updatedAt'>
);

export type CreateTasklistMutationVariables = Exact<{
  title?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  boardId: Scalars['String'];
}>;


export type CreateTasklistMutation = (
  { __typename?: 'Mutation' }
  & { createTasklist: (
    { __typename?: 'Tasklist' }
    & RegularTasklistFragment
  ) }
);

export type UpdateTasklistMutationVariables = Exact<{
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
}>;


export type UpdateTasklistMutation = (
  { __typename?: 'Mutation' }
  & { updateTasklist: (
    { __typename?: 'Tasklist' }
    & RegularTasklistFragment
  ) }
);

export type DeleteTasklistMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteTasklistMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteTasklist'>
);

export type RegularEntryFragment = (
  { __typename?: 'Entry' }
  & Pick<Entry, 'id' | 'title' | 'content' | 'rootFolderId' | 'createdAt' | 'updatedAt'>
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

export type CreateEntryMutationVariables = Exact<{
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  folderId?: Maybe<Scalars['String']>;
}>;


export type CreateEntryMutation = (
  { __typename?: 'Mutation' }
  & { createEntry: (
    { __typename?: 'Entry' }
    & RegularEntryFragment
  ) }
);

export type UpdateEntryMutationVariables = Exact<{
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
}>;


export type UpdateEntryMutation = (
  { __typename?: 'Mutation' }
  & { updateEntry: (
    { __typename?: 'Entry' }
    & RegularEntryFragment
  ) }
);

export type DeleteEntryMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteEntryMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteEntry'>
);

export type RegularFolderFragment = (
  { __typename?: 'Folder' }
  & Pick<Folder, 'id' | 'title' | 'rootFolderId' | 'createdAt' | 'updatedAt'>
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

export type MyFolderQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type MyFolderQuery = (
  { __typename?: 'Query' }
  & { myFolder: (
    { __typename?: 'Folder' }
    & { folders?: Maybe<Array<(
      { __typename?: 'Folder' }
      & RegularFolderFragment
    )>>, entries?: Maybe<Array<(
      { __typename?: 'Entry' }
      & RegularEntryFragment
    )>> }
    & RegularFolderFragment
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

export type DeleteFolderMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteFolderMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteFolder'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'firstName' | 'lastName'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type RegisterMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
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

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
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

export const RegularBoardFragmentDoc = gql`
    fragment RegularBoard on Board {
  id
  title
  createdAt
  updatedAt
}
    `;
export const RegularTaskFragmentDoc = gql`
    fragment RegularTask on Task {
  id
  title
  description
  dueAt
  archivedAt
  tasklistId
  boardId
  createdAt
  updatedAt
}
    `;
export const RegularTasklistFragmentDoc = gql`
    fragment RegularTasklist on Tasklist {
  id
  title
  color
  boardId
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
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  firstName
  lastName
}
    `;
export const MyBoardsDocument = gql`
    query MyBoards {
  myBoards {
    ...RegularBoard
  }
}
    ${RegularBoardFragmentDoc}`;

export function useMyBoardsQuery(options: Omit<Urql.UseQueryArgs<MyBoardsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyBoardsQuery>({ query: MyBoardsDocument, ...options });
};
export const MyBoardDocument = gql`
    query myBoard($id: String!) {
  myBoard(id: $id) {
    ...RegularBoard
    tasks {
      ...RegularTask
    }
    tasklistOrder
    tasklists {
      ...RegularTasklist
      taskOrder
    }
  }
}
    ${RegularBoardFragmentDoc}
${RegularTaskFragmentDoc}
${RegularTasklistFragmentDoc}`;

export function useMyBoardQuery(options: Omit<Urql.UseQueryArgs<MyBoardQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyBoardQuery>({ query: MyBoardDocument, ...options });
};
export const CreateBoardDocument = gql`
    mutation CreateBoard($title: String) {
  createBoard(options: {title: $title}) {
    ...RegularBoard
  }
}
    ${RegularBoardFragmentDoc}`;

export function useCreateBoardMutation() {
  return Urql.useMutation<CreateBoardMutation, CreateBoardMutationVariables>(CreateBoardDocument);
};
export const UpdateBoardDocument = gql`
    mutation UpdateBoard($id: String!, $title: String) {
  updateBoard(id: $id, options: {title: $title}) {
    ...RegularBoard
  }
}
    ${RegularBoardFragmentDoc}`;

export function useUpdateBoardMutation() {
  return Urql.useMutation<UpdateBoardMutation, UpdateBoardMutationVariables>(UpdateBoardDocument);
};
export const UpdateOrderDocument = gql`
    mutation UpdateOrder($id: String!, $tasklists: [TasklistInput!]!, $tasklistOrder: [String!]) {
  updateOrder(id: $id, tasklists: $tasklists, tasklistOrder: $tasklistOrder) {
    ...RegularBoard
  }
}
    ${RegularBoardFragmentDoc}`;

export function useUpdateOrderMutation() {
  return Urql.useMutation<UpdateOrderMutation, UpdateOrderMutationVariables>(UpdateOrderDocument);
};
export const DeleteBoardDocument = gql`
    mutation DeleteBoard($id: String!) {
  deleteBoard(id: $id)
}
    `;

export function useDeleteBoardMutation() {
  return Urql.useMutation<DeleteBoardMutation, DeleteBoardMutationVariables>(DeleteBoardDocument);
};
export const CreateTaskDocument = gql`
    mutation createTask($title: String, $dueAt: DateTime, $description: String, $tasklistId: String!) {
  createTask(
    options: {title: $title, dueAt: $dueAt, description: $description, tasklistId: $tasklistId}
  ) {
    ...RegularTask
  }
}
    ${RegularTaskFragmentDoc}`;

export function useCreateTaskMutation() {
  return Urql.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument);
};
export const UpdateTaskDocument = gql`
    mutation updateTask($id: String!, $title: String, $dueAt: DateTime, $description: String) {
  updateTask(
    id: $id
    options: {title: $title, dueAt: $dueAt, description: $description}
  ) {
    ...RegularTask
  }
}
    ${RegularTaskFragmentDoc}`;

export function useUpdateTaskMutation() {
  return Urql.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument);
};
export const ArchiveTaskDocument = gql`
    mutation ArchiveTask($id: String!, $archive: Boolean) {
  archiveTask(id: $id, archive: $archive) {
    id
  }
}
    `;

export function useArchiveTaskMutation() {
  return Urql.useMutation<ArchiveTaskMutation, ArchiveTaskMutationVariables>(ArchiveTaskDocument);
};
export const DeleteTaskDocument = gql`
    mutation DeleteTask($id: String!) {
  deleteTask(id: $id)
}
    `;

export function useDeleteTaskMutation() {
  return Urql.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument);
};
export const CreateTasklistDocument = gql`
    mutation createTasklist($title: String, $color: String, $boardId: String!) {
  createTasklist(options: {title: $title, color: $color, boardId: $boardId}) {
    ...RegularTasklist
  }
}
    ${RegularTasklistFragmentDoc}`;

export function useCreateTasklistMutation() {
  return Urql.useMutation<CreateTasklistMutation, CreateTasklistMutationVariables>(CreateTasklistDocument);
};
export const UpdateTasklistDocument = gql`
    mutation updateTasklist($id: String!, $title: String, $color: String) {
  updateTasklist(id: $id, options: {title: $title, color: $color}) {
    ...RegularTasklist
  }
}
    ${RegularTasklistFragmentDoc}`;

export function useUpdateTasklistMutation() {
  return Urql.useMutation<UpdateTasklistMutation, UpdateTasklistMutationVariables>(UpdateTasklistDocument);
};
export const DeleteTasklistDocument = gql`
    mutation DeleteTasklist($id: String!) {
  deleteTasklist(id: $id)
}
    `;

export function useDeleteTasklistMutation() {
  return Urql.useMutation<DeleteTasklistMutation, DeleteTasklistMutationVariables>(DeleteTasklistDocument);
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
export const CreateEntryDocument = gql`
    mutation CreateEntry($title: String, $content: String, $folderId: String) {
  createEntry(options: {title: $title, content: $content, folderId: $folderId}) {
    ...RegularEntry
  }
}
    ${RegularEntryFragmentDoc}`;

export function useCreateEntryMutation() {
  return Urql.useMutation<CreateEntryMutation, CreateEntryMutationVariables>(CreateEntryDocument);
};
export const UpdateEntryDocument = gql`
    mutation UpdateEntry($id: String!, $title: String, $content: String) {
  updateEntry(id: $id, options: {title: $title, content: $content}) {
    ...RegularEntry
  }
}
    ${RegularEntryFragmentDoc}`;

export function useUpdateEntryMutation() {
  return Urql.useMutation<UpdateEntryMutation, UpdateEntryMutationVariables>(UpdateEntryDocument);
};
export const DeleteEntryDocument = gql`
    mutation DeleteEntry($id: String!) {
  deleteEntry(id: $id)
}
    `;

export function useDeleteEntryMutation() {
  return Urql.useMutation<DeleteEntryMutation, DeleteEntryMutationVariables>(DeleteEntryDocument);
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
export const MyFolderDocument = gql`
    query myFolder($id: String!) {
  myFolder(id: $id) {
    ...RegularFolder
    folders {
      ...RegularFolder
    }
    entries {
      ...RegularEntry
    }
  }
}
    ${RegularFolderFragmentDoc}
${RegularEntryFragmentDoc}`;

export function useMyFolderQuery(options: Omit<Urql.UseQueryArgs<MyFolderQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyFolderQuery>({ query: MyFolderDocument, ...options });
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
export const DeleteFolderDocument = gql`
    mutation DeleteFolder($id: String!) {
  deleteFolder(id: $id)
}
    `;

export function useDeleteFolderMutation() {
  return Urql.useMutation<DeleteFolderMutation, DeleteFolderMutationVariables>(DeleteFolderDocument);
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
export const RegisterDocument = gql`
    mutation Register($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
  register(
    options: {firstName: $firstName, lastName: $lastName, email: $email, password: $password}
  ) {
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
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(options: {email: $email, password: $password}) {
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