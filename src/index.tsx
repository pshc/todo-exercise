import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {DndTodoList, Task} from './TodoList';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

var root = document.getElementById('root') as HTMLElement;

class App extends React.Component<{}, {tasks: Task[]}> {
  constructor(props?: {}) {
    super(props);
    this.state = {tasks: []};
    this.api('GET', 'tasks').then(json => {
      this.setState({tasks: json.tasks!});
    });
  }

  render(): JSX.Element | null {
    return (
      <DndTodoList
        tasks={this.state.tasks}
        addTask={this.addTask}
        markAllTasks={this.markAllTasks}
        toggleTask={this.toggleTask}
      />
    );
  }

  api(method: string, resource: string, body?: {}): Promise<{tasks?: Task[]}> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let init: RequestInit = {headers: headers, method: method};
    if (body != null) {
      init.body = JSON.stringify(body);
      headers.append('Content-Type', 'application/json');
    }
    return fetch(`/api/${resource}`, init).then(resp => resp.json());
    // todo error handling
  }

  addTask = (name: string) => {
    let id = String(Math.random()).slice(2);
    let task: Task = {id: id, name: name, done: false};
    this.setState({tasks: [task, ...this.state.tasks]});
    this.api('PUT', `task/${task.id}`, task);
  }

  /// Modify an existing task in-place.
  updateTask(id: string, f: (t: Task) => Task) {
    // O(n), eww!
    for (let i = 0; i < this.state.tasks.length; i++) {
      let task = this.state.tasks[i];
      if (task.id === id) {
        this.state.tasks[i] = f(task);
        this.forceUpdate();
        this.api('PUT', `task/${task.id}`, task);
        return;
      }
    }
    global.console.warn(`update: no task of id ${id}`);
  }

  toggleTask = (id: string) => {
    this.updateTask(id, task => {
      task.done = !task.done;
      return task;
    });
  }

  markAllTasks = () => {
    this.setState({tasks: this.state.tasks.map(task => { task.done = true; return task; })});
    this.api('POST', 'tasks/markAll');
  }
}

const DndApp = DragDropContext(HTML5Backend)(App);

ReactDOM.render(<DndApp />, root);
registerServiceWorker();
