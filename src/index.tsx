import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {TodoList} from './TodoList';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <TodoList />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
