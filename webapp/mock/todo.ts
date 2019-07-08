import {Request, Response} from "express";
import uuidv4 from "uuid/v4";

const todos = [
  {
    id: 1,
    content: 'hello!',
  },
  {
    id: 2,
    content: 'goodbye!',
  }
]

export default {
  // grpc+json
  'POST /com.example.todo.TodoService/getAll': { todos },

  'POST /com.example.todo.TodoService/createTodo': (req : Request, res : Response)  => {
    todos.push({...req.body, id: uuidv4()})
    res.sendStatus(200)
  },

  'POST /com.example.todo.TodoService/deleteTodo': (req : Request, res : Response)  => {
    const i = todos.findIndex(value => value.id == req.body.id)
    if (i > -1) {
      todos.splice(i, 1)
    }
  },

  // REST
  'GET /api/todos': todos,

  'GET /api/todos/:id': (req : Request, res : Response)  => {
    const item = todos.filter(value => value.id == req.params.id )
    if (item) {
      res.json(item[0])
    } else {
      res.sendStatus(404)
    }
  },

  'DELETE /api/todos/:id': (req : Request, res : Response) => {
    const i = todos.findIndex(value => value.id == req.params.id)
    if (i > -1) {
      todos.splice(i, 1)
    }
  },

  'POST /api/todos': (req : Request, res : Response) => {
    todos.push(req.body)
    res.sendStatus(200)
  },
}
