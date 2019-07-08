export interface Todo {
  id: string;
  content: string;
}

export class TodosState {
  list: Todo[] = [];
}

const model = {
  namespace: 'todos',
  state: {},
  reducers: {},
}

export default model;
