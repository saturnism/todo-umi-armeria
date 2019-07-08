import {Todo} from "@/pages/todos/model";
import TodoService from "@/services/TodoService";

export default class TodoServiceGrpc extends TodoService{
  auth : any
  request: any

  constructor(auth) {
    super(auth)
  }

  async allTodos() : Promise<Todo[]> {
    const res = await this.request.post('/com.example.todo.TodoService/getAll', {})
    return res.data.todos
  }

  async addTodo(todo : Todo) {
    return this.request.post('/com.example.todo.TodoService/createTodo', todo)
  }

  async deleteTodo(id : string) {
    return this.request.post('/com.example.todo.TodoService/deleteTodo', {id: id})
  }
}
