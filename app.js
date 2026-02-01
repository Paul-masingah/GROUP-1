require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());


let todos = [
    { id: 1, task: 'Buy groceries', completed: false},
    { id: 2, task: 'Walk the dog', completed: false },
    { id: 3, task: 'Read a book', completed: false }
];

// Get all todos
app.get('/todos', (req, res) => {
    res.status(200).json(todos); //send array as json response
});

// POST new - create a new todo
app.post('/todos', (req, res) => {
    const newTodo = { id: todos.length + 1, ...req.body }; //auto-generate id
    todos.push(newTodo);
    
    if (!newTodo.task) {
        return res.status(400).json({ error: 'Task field is required' });  
    }else if (newTodo.completed === undefined) {
        newTodo.completed = false;
    }// auto-set completed to false if not provided


    // validating text field
    if (typeof newTodo.task !== 'string' || typeof newTodo.completed !== 'boolean'){
        todos.pop(); // remove the invalid todo
        return res.status(400).json({ error: 'Invalid data types for task or completed fields' });
    }   

    // check for duplicate tasks
    if (todos.some(t => t.task === newTodo.task)){
        todos.pop(); // remove the duplicate todo
        return res.status(400).json({error: 'Task already exist'})
    }

    res.status(201).json(newTodo); //send created todo as json response
});

// PATCH Update- partial update of a todo
app.patch('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));  // find todo by id
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    Object.assign(todo, req.body); //update todo with request body e.g. {completed: true}
    res.status(200).json(todo); //send updated todo as json response
});

// DELETE a todo
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== id); //filter out the todo to delete
    if (todos.length === initialLength) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send(); //send no content status
});

app.get('/todos/completed', (req, res) => {
    const completed = todos.filter(t => t.completed === true);
    res.status(200).json(completed); //custom read
}); //get all completed todos

app.get('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id)); //find todo by id
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(todo);
}); // Get a specific todo by id

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
