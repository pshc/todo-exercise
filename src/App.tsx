import * as React from 'react';
import './App.css';

class App extends React.Component<{}, null> {
  todoInput?: HTMLInputElement;

  render() {
    return (
      <section className="App">
        <header>
          <h1>Todos</h1>
        </header>
        <form onSubmit={this.addTodo}>
          <input
            type="text"
            placeholder="What needs to be done?"
            ref={input => this.todoInput = input}
          />
          <input type="submit" value="Add Todo" />
        </form>
        <ul>
          <li><label><input type="checkbox" /> Get a haircut</label></li>
          <li><label><input type="checkbox" /> Drink wine</label></li>
        </ul>
        <footer>
          <span>N items left</span>
          <a href="#" onClick={this.markAllComplete}>Mark all as complete</a>
        </footer>
      </section>
    );
  }

  addTodo = (event: MouseEventInit) => {
    this.todoInput!.value = '';
    (event as Event).preventDefault();
  }

  markAllComplete = (event: MouseEventInit) => {
    (event as Event).preventDefault();
  }
}

export default App;
