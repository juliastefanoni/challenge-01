const express = require('express');
const server = express();

server.use(express.json());

const projects = [];

function logRequests (request, response, next) {
  console.count('Numero de requisições');

  next();
}

// Middleware global
server.use(logRequests);

//Middleware local
function checkIdExists (request, response, next) {
  const { id } = request.params;
  const project = projects.find( element => element.id === id);

  if (!project){
    return response.status(400).json({ error: 'Project does not exists'});
  }
  
  return next();
}

server.post('/projects', (request, response) => {
  const { id, title, tasks } = request.body;

  projects.push({id, title, tasks});

  return response.json(projects);
})

server.get('/projects', (request, response) => {
  return response.json(projects);
})

server.put('/projects/:id', checkIdExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const project = projects.find( element => element.id === id);

  project.title = title;

  return response.json(project);
})

server.delete('/projects/:id', checkIdExists, (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex( element => element.id === id);

  projects.splice(projectIndex, 1);

  return response.send();
})

server.post('/projects/:id/tasks', checkIdExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  
  const project = projects.find( element => element.id === id);

  project.tasks.push(title);

  return response.json(project);
})

server.listen(3000);