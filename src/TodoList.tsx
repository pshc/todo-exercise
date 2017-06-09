import * as React from 'react';
import './TodoList.css';

export interface Task {
  id: string;
  name: string;
  done: boolean;
}

export interface Props {
  tasks: Task[];
  addTask: (name: string) => void;
  toggleTask: (id: string) => void;
  markAllTasks: () => void;
}

export class TodoList extends React.Component<Props, null> {
  todoInput?: HTMLInputElement;

  render(): JSX.Element {
    let tasksLeft = 0;
    let tasks = this.props.tasks.map(task => {
      if (!task.done) {
        tasksLeft++;
      }
      return (
        <TodoItem
          task={task}
          key={task.id}
          toggleTask={this.props.toggleTask.bind(this, task.id)}
        />
      );
    });

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
        <ul>{tasks}</ul>
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

interface TodoItemProps {
  task: Task;
  toggleTask: () => void;
}

class TodoItem extends React.Component<TodoItemProps, null> {
  render() {
    let task = this.props.task;
    return (
      <li className={task.done ? 'done' : undefined}><label>
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => this.props.toggleTask()}
        />
        &nbsp;<span>{task.name}</span>
      </label></li>
    );
  }
}
