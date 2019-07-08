/**
 * title: Todo
 */

import React, { PureComponent } from 'react';
import { Layout, Input, List, Icon } from 'antd';
import { connect } from 'dva';
import { withAuth } from '@okta/okta-react';
import {Todo, TodosState} from './model';
import * as styles from './index.css';
import TodoService from "@/services/TodoService";
import uuidv4 from "uuid/v4";
import TodoServiceGrpc from "@/services/TodoServiceGrpc";

interface ViewProps {
  todos: TodosState
  dispatch: any
  auth?: any
}

interface ViewStates {
  pendingTodo: string
  todos: Todo[]
}

class TodoComponent extends PureComponent<ViewProps, ViewStates> {
  todoService : TodoService

  constructor(props : ViewProps) {
    super(props)
    this.todoService = new TodoServiceGrpc(this.props.auth)
  }

  state = {
    pendingTodo: '',
    todos: [],
  };

  async componentWillMount() {
  }

  async componentDidMount() {
    this.load()
  }

  load = async() => {
    const todos = await this.todoService.allTodos()
    this.setState({
      pendingTodo: '',
      todos: todos,
    })
  }

  completeTodo = async (id : string) => {
    await this.todoService.deleteTodo(id)
    this.load()
  }

  todoOnChange = async (e) => {
    return this.setState({
      pendingTodo: e.target.value,
    });
  }

  addTodo = async (e) => {
    if (!this.state.pendingTodo) return;

    await this.todoService.addTodo({
      id: uuidv4(),
      content: this.state.pendingTodo,
    })

    this.load()
  }

  renderTodoItem = (item : Todo) => {
    return (
      <List.Item className={styles.todoItem}>
      {item.content}
      <Icon
        onClick={this.completeTodo.bind(this, item.id)}
        type="check"
        className={styles.todoCheckIcon}
      />
      </List.Item>
    )
  }

  render() {
    return (
      <Layout className={styles.todoLayout}>
        <Input.Search
          className={styles.todoInput}
          size="large"
          placeholder="Something to do..."
          onChange={this.todoOnChange}
          value={this.state.pendingTodo}
          onSearch={this.addTodo}
          enterButton="Add Todo"
          required={true}
        />
        <List
          className={styles.todoList}
          size="large"
          bordered={true}
          dataSource={this.state.todos}
          renderItem={this.renderTodoItem}
        />
      </Layout>
    )


  }
}

export default withAuth(TodoComponent);
