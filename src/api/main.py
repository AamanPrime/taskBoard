import time
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
db = 'task.json'

data = [
        {'id': '1', 'title': 'Task Name', 'description': 'Description for task 1.','category': 0},
        {'id': '2', 'title': 'Task Name', 'description': 'Another task description.','category': 0},
        {'id': '3', 'title': 'Task Name', 'description': 'Currently being worked on.','category': 1},
        {'id': '4', 'title': 'Task Name', 'description': 'Finished task description.','category': 2},
]

column_to_category = {
    'To Do': 0,
    'In Progress': 1,
    'Completed': 2
}

@app.route('/api/data', methods=['GET'])
def get_data():
    if not os.path.exists(db):
        with open(db, 'w') as file:
            json.dump(data, file, indent=2)
        return data
    with open(db, 'r') as file:
        return json.load(file)


@app.route('/api/update-data', methods=['PUT'])
def update():
    column_data = request.json
    flattened_tasks = []
    for column_name, tasks in column_data.items():
        category = column_to_category.get(column_name)
        for task in tasks:
            flattened_tasks.append({
                'id': task['id'],
                'title': task['title'],
                'description': task['description'],
                'category': category
            })

    with open(db, 'w') as file:
        json.dump(flattened_tasks, file, indent=2)

    return jsonify(flattened_tasks), 200

@app.route('/api/add', methods=['POST'])
def add_task():
    rdata = request.get_json()
    data = get_data()
    id = max([int(x['id']) for x in data] + [-1]) + 1
    data.append({'id': id, 'title': rdata['title'], 'description': rdata['description'], 'category': column_to_category[rdata['status']]})
    with open(db, 'w') as file:
        json.dump(data, file, indent=2)
    return jsonify(data), 201

@app.route('/api/delete<id>', methods=['DELETE'])
def delete(id):
    data = get_data()
    original_length = len(data)

    # Remove the item with the matching id
    data = [e for e in data if str(e.get('id')) != str(id)]

    # Save the updated data
    with open(db, 'w') as file:
        json.dump(data, file, indent=2)

    if len(data) < original_length:
        return jsonify({"success": True, "message": f"Item with id {id} removed."})
    else:
        return jsonify({"success": False, "message": f"No item found with id {id}."}), 404

@app.route('/api/edit', methods=['PUT'])
def edit():
    rdata = request.get_json()
    data = get_data()
    for d in data:
        if int(d['id']) == int(rdata['id']):
            d['title'] = rdata['title']
            d['description'] = rdata['description']
    with open(db, 'w') as file:
        json.dump(data, file, indent=2)
    return jsonify(data), 200

if __name__ == '__main__':
    app.run(debug=True)
