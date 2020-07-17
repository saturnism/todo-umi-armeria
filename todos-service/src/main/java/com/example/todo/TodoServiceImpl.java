package com.example.todo;

import io.grpc.stub.StreamObserver;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

@Service
public class TodoServiceImpl extends TodoServiceGrpc.TodoServiceImplBase {
    private static final List<Todo> todos = new LinkedList<Todo>();

    @Override
    public void getAll(AllTodoRequest request, StreamObserver<AllTodoResponse> responseObserver) {
        responseObserver.onNext(AllTodoResponse.newBuilder().addAllTodos(todos).build());
        responseObserver.onCompleted();
    }

    @Override
    public void deleteTodo(DeleteTodoRequest request, StreamObserver<DeleteTodoResponse> responseObserver) {
        for (Iterator<Todo> it = todos.iterator(); it.hasNext(); ) {
            Todo todo = it.next();
            if (todo.getId().equals(request.getId())) {
                it.remove();
            }
        }
        responseObserver.onCompleted();
    }

    @Override
    public void createTodo(CreateTodoRequest request, StreamObserver<CreateTodoResponse> responseObserver) {
        todos.add(Todo.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setContent(request.getContent())
                .build());
        responseObserver.onCompleted();
    }
}
