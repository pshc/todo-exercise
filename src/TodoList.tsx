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
}

export class TodoList extends React.Component<Props, null> {
  todoInput?: HTMLInputElement;

  render(): JSX.Element {
    let tasks = this.props.tasks.map(task => {
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
            ref={input => this.todoInput = input}
          />
          <input type="submit" value="Add Todo" />
        </form>
        <ul>{tasks}</ul>
        <footer>
          <span>{this.tasksLeft()}</span>
          <a href="#" onClick={this.markAllComplete}>Mark all as complete</a>
        </footer>
      </section>
    );
  }

  tasksLeft(): string {
    let count = 0;
    for (let task of this.props.tasks) {
      if (!task.done) {
        count++;
      }
    }
    return count === 1 ? '1 task left' : `${count} tasks left`;
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
      <li><label>
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => this.props.toggleTask()}
        />
        {task.name}
      </label></li>
    );
  }
}
