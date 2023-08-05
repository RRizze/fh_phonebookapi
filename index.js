const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

morgan.token('res-body', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :res-body'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

// GET /api/persons
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// GET /api/info
app.get('/api/info', (req, res) => {
  let info = `<p>Phonebook has info for ${persons.length} people</p>`;
  const date = new Date();
  info += `<p>${date}</p>`;

  res.send(info);
});

// GET /api/persons/:id
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// DELETE /api/persons/:id
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id);

  res.status(204).end();
});

const generateId = () => {
  const id = Math.random() * Number.MAX_VALUE;
  return id;
};

// POST /api/persons
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: 'name and number must not be empty',
    });
  } else if (persons.find(p => p.name === name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }
  const person = { name, number, id: generateId() };
  persons = persons.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
