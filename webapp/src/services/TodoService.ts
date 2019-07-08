import {Todo} from "@/pages/todos/model";
import axios, {AxiosRequestConfig} from 'axios';

export default class TodoService {
  auth : any
  request: any

  constructor(auth) {
    this.auth = auth
    this.request = axios.create()
    this.request.interceptors.request.use(async (config : AxiosRequestConfig) => {
      const accessToken = await auth.getAccessToken()
      return {
        ...config,
        headers: {
          authorization: accessToken,
        }
      }
    })

  }

  async allTodos() : Promise<Todo[]> {
    const res = await this.request.get('/api/todos')
    return res.data
  }

  async addTodo(todo : Todo) {
    return this.request.post('/api/todos', todo)
  }

  async deleteTodo(id : string) {
    return this.request.delete('/api/todos/' + id)
  }

}
