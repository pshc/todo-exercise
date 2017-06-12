import * as React from 'react';
import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DragSourceSpec,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec,
} from 'react-dnd';
import './TodoList.css';

const TASK_TYPE = 'task';

export interface Task {
  id: string;
  name: string;
  done: boolean;
}

interface TodoListProps extends React.Props<TodoList> {
  tasks: Task[];
  addTask: (name: string) => void;
  toggleTask: (id: string) => void;
  markAllTasks: () => void;
  connectDropTarget: ConnectDropTarget;
}

/// The vanilla (no-drag-and-drop) todo list component
export class TodoList extends React.Component<TodoListProps, {}> {
  todoInput?: HTMLInputElement;

  render() {
    const { tasks, connectDropTarget, toggleTask } = this.props;
    let tasksLeft = 0;
    let taskItems = tasks.map(task => {
      if (!task.done) {
        tasksLeft++;
      }
      return (
        <DndTodoItem
          id={task.id}
          key={task.id}
          task={task}
          toggleTask={toggleTask.bind(this, task.id)}
        />
      );
    });

    let droppableList = connectDropTarget(<ul>{taskItems}</ul>);
    return (
      <section className="TodoList">
        <header>
          <h1>Todos</h1>
        </header>
        <form onSubmit={this.addTask}>
          <input
            type="text"
            placeholder="What needs to be done?"
            maxLength={1000}
            ref={input => this.todoInput = input}
          />
          <input type="submit" value="Add Todo" />
        </form>
        {droppableList}
        <footer>
          <span>{tasksLeft} {tasksLeft === 1 ? 'task' : 'tasks'} left</span>
          <a
            href={tasksLeft === 0 ? undefined : '#'}
            className={tasksLeft === 0 ? 'disabled' : undefined}
            onClick={this.markAllComplete}
          >
            Mark all as complete
          </a>
        </footer>
      </section>
    );
  }

  addTask = (event: MouseEventInit) => {
    (event as Event).preventDefault();
    let input = this.todoInput!;
    let name = input.value.trim();
    if (name !== '') {
      input.value = '';
      this.props.addTask(name);
    }
    input.focus();
  }

  markAllComplete = (event: MouseEventInit) => {
    (event as Event).preventDefault();
    this.props.markAllTasks();
  }
}

// drop callbacks
const todosTarget: DropTargetSpec<TodoListProps> = {
  canDrop: (props, monitor) => {
    return true;
  },

  drop: (props, monitor: DropTargetMonitor, todoList: TodoList) => {
    global.console.log('dropped', monitor.getItem(), monitor.getClientOffset());
  }
};

// injects `connectDropTarget` into DndTodoList for us
function todosCollect(connect: DropTargetConnector, monitor: DropTargetMonitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

// Our drop-enabled todo list Component.
// (we cast to `any` since TypeScript can't deal with the collector function mixins)
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/13404#issuecomment-269014955
// tslint:disable-next-line no-any
export const DndTodoList = DropTarget(TASK_TYPE, todosTarget, todosCollect)(TodoList) as any;

interface TodoItemProps extends React.Props<TodoItem> {
  id: string;
  task: Task;
  toggleTask: () => void;
  connectDragSource: ConnectDragSource;
  isDragging: boolean;
}

/// Our vanilla Todo item component (without the drag-and-drop wrapping)
class TodoItem extends React.Component<TodoItemProps, {}> {
  static defaultProps: TodoItemProps;

  render() {
    const { task, toggleTask, isDragging, connectDragSource } = this.props;
    return connectDragSource(
      <li
        className={task.done ? 'done' : undefined}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <label>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleTask()}
          />
          &nbsp;<span>{task.name}</span>
        </label>
      </li>
    );
  }
}

// drag callbacks
const todoSource: DragSourceSpec<TodoItemProps> = {
  beginDrag: (props) => ({id: props.id}),
};

// injects drag helpers into DndTodoItem for us
function todoCollect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

// Our drag-enabled todo item Component.
// tslint:disable-next-line no-any
const DndTodoItem = DragSource(TASK_TYPE, todoSource, todoCollect)(TodoItem) as any;
