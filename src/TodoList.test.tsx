import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Task, TodoList} from './TodoList';

it('renders without crashing', () => {
  const div = document.createElement('div');
  let tasks: Task[] = [{id: 'a', name: 'A', done: false}];
  ReactDOM.render(
    <TodoList
      tasks={tasks}
      addTask={t => void 0}
      markAllTasks={() => void 0}
      moveTaskVisually={(id, index) => void 0}
      commitTaskMovement={(id) => void 0}
      toggleTask={id => void 0}
      connectDropTarget={(() => null) as any}
    />, div);
});
