import Todo from "./Todo";

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  return (
    <>
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          onClickDelete={deleteTodo}
          onClickComplete={completeTodo}
        />
      ))}
    </>
  );
};

export default TodoList;
