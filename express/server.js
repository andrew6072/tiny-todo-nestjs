const express = require("express");
const { todo } = require("node:test");
const app = express();
const port = 3000;
app.use(express.json());
// Data Source, could be replaced with a real database
class Todo {
    constructor(id, title, desc, completed) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.completed = completed;
    }
}
  
const todos = [
    new Todo(1, "Todo 1", "This is my first Todo", true),
    new Todo(2, "Todo 2", "This is my second Todo", false),
    new Todo(3, "Todo 3", "This is my third Todo", true),
    new Todo(4, "Todo 4", "This is my fourth Todo", false),
    new Todo(5, "Todo 5", "This is my fifth Todo", true),
];
// Data source ends here

// Endpoint starts here
app.get("/", (request, response) => {
  response.status(200).json(todos);
});

app.get("/todos", (request, response) => {
  response.status(200).json(todos);
});

app.get("/todos/:id", (request, response) => {
    const todoId = parseInt(request.params.id); // Convert id to a number
    const foundTodo = todos.find((todo) => todo.id === todoId);
    
    if (foundTodo) {
        response
            .status(200)
            .json({ data: foundTodo });
    } else {
        response
            .status(404)
            .json({ error: "Todo not found" });
    }
});

app.post("/todos", (request, response) => {
    const requiredFields = ['id', 'title', 'desc', 'completed'];
    const missingFields = requiredFields.filter(field => !(field in request.body));
    if (missingFields.length > 0) {
        response
            .status(400)
            .json({ error: `Missing fields: ${missingFields.join(', ')}` });
        return;
    }
    const todoId = parseInt(request.body.id); // Convert id to a number
    const foundTodo = todos.find((todo) => todo.id === todoId);
    if (foundTodo) {
        response
            .status(409)
            .json({ error: "Conflict: Id already exists!" });
    } else {
        const todoTitle = request.body.title;
        const todoDesc = request.body.desc;
        const todoCompleted = request.body.completed;
        const newTodo = new Todo(todoId, todoTitle, todoDesc, todoCompleted);
        todos.push(newTodo);
        // console.log(newTodo)
        response
            .status(201)
            .json({ msg: "Todo created successfully", data: newTodo});
    }
    // todos.push(request.body);
    // response.status(201).json({ msg: "Todo created successfully" });
});

app.put("/todos/:id", (request, response) => {
    // const todoId = parseInt(request.body.id); // Convert id to a number
    // const foundTodo = todos.find((todo) => todo.id === todoId);
    const todo = todos.find((todo) => todo.id === parseInt(request.params.id));
    if (todo) {
        const { title, desc, completed } = request.body;
        todo.title = title;
        todo.desc = desc;
        todo.completed = completed;
        console.log(todo)
        response.status(200).json({ msg: "Todo updated sucessfully" });
        return;
    }
    response.status(404).json({ msg: "Todo not found" });
});

app.delete("/todos/:id", (request, response) => {
    const todoId = parseInt(request.params.id); // Convert id to a number
    const foundTodo = todos.find((todo) => todo.id === todoId);
    const todoIndex = todos.findIndex((todo) => (todo.id === todoId));
    if (foundTodo) {
        todos.splice(todoIndex, 1);
        response.status(200).json({ msg: "Todo deleted successfully", data: todos });
        return;
    }
    response.status(404).json({ msg: "Todo not found" });
});
// Endppoint ends here

// App listens to incoming requests here
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
