#!/usr/local/bin/python3
from flask import Flask, jsonify, request
app = Flask('todilo')

# Here's our incredibly amazing in-process database.
TASK_LIST = [] # list of task ids
TASKS = {} # id => {name: str, done: bool}

@app.route('/api/tasks', methods=['GET'])
def all_tasks():
    tasks = [TASKS[id] for id in TASK_LIST]
    return jsonify({'tasks': tasks})

@app.route('/api/task/<id>', methods=['PUT', 'DELETE'])
def single_task(id):
    if request.method == 'PUT':
        json = request.get_json(force=True)
        if not isinstance(json.get('name'), str):
            raise InvalidUsage('Must provide `name` string')
        if not isinstance(json.get('done'), bool):
            raise InvalidUsage('Must provide `done` boolean')
        if len(json['name']) > 1000:
            raise InvalidUsage('`name` cannot be longer than 1000 characters')

        # make sure nothing else slips in
        TASKS[id] = dict(id=id, name=json['name'], done=json['done'])
        if id not in TASK_LIST:
            TASK_LIST.insert(0, id)

        index = TASK_LIST.index(id)
        return jsonify({'index': index})

    elif request.method == 'DELETE':
        # for idempotency, don't throw an error if it doesn't exist
        if id in TASKS:
            del TASK_DATA[id]
            TASK_LIST.remove(id)
        return jsonify({})

@app.route('/api/tasks/markAll', methods=['POST'])
def mark_all_complete():
    for task in TASKS.values():
        task['done'] = True
    return jsonify({})

@app.route('/api/tasks/move/<id>/to/<int:index>', methods=['POST'])
def move_one_task(id, index):
    if id not in TASKS:
        return jsonify({'alreadyDeleted': True})
    if 0 <= index < len(TASK_LIST):
        TASK_LIST.remove(id)
        TASK_LIST.insert(index, id)
        return jsonify({})
    else:
        raise InvalidUsage('`index` is out of bounds')


class InvalidUsage(Exception):
    status_code = 400
    def __init__(self, reason):
        super().__init__(self)
        self.reason = reason

    def to_dict(self):
        return {'reason': self.reason}

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(err):
    resp = jsonify(err.to_dict())
    resp.status_code = err.status_code
    return resp

if __name__ == '__main__':
    app.run()
