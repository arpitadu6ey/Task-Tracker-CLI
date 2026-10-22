# Task Tracker CLI

A simple command-line app to manage your to-do list, built with Node.js (no external libraries).

## Features
- Add, update, and delete tasks
- Mark tasks as in-progress or done
- List all tasks or filter by status
- Tasks are saved in a local JSON file

## Requirements
- Node.js (LTS)

## Usage
```bash
node task-cli.js add "Buy groceries"
node task-cli.js update 1 "Buy groceries and cook dinner"
node task-cli.js delete 1
node task-cli.js mark-in-progress 1
node task-cli.js mark-done 1
node task-cli.js list
node task-cli.js list todo
node task-cli.js list in-progress
node task-cli.js list done
```

## How it works
Tasks are stored in `tasks.json`. Each task has an id, description, status, createdAt, and updatedAt.

This project is a solution to the [Task Tracker](https://roadmap.sh/projects/task-tracker) challenge from [roadmap.sh](https://roadmap.sh/)
