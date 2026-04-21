# Playwright Test Automation – Todo App

This project contains automated UI tests for a Todo web application using Playwright and JavaScript.

## Tech stack
- Playwright
- JavaScript (Node.js)

## What is tested
- Create, edit and delete todo items
- Complete and uncomplete tasks
- Sorting todo items (alphabetically and randomly)
- Moving tasks between lists
- Creating and managing lists and categories

## Test structure
The project uses Page Object Model (POM) to organize test logic:

- `pages/` – main page objects (e.g. HomePage)
- `sections/` – reusable UI parts (TodoSection, ListSection)
- `tests/` – test cases

## Example test scenarios
- Edit existing todo item
- Cancel editing
- Remove todo item
- Complete / uncomplete task
- Move task to another list
- Sort items

## How to run tests

Install dependencies:
```bash
npm install
