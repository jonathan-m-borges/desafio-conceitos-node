const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryExist(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid Id.' });
  }

  const repositoryIndex = repositories.findIndex(x => x.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }
  
  request.repositoryIndex = repositoryIndex;
  return next();
}

app.use('/repositories/:id', validateRepositoryExist);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const repository = { id: uuid(), url, title, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const repositoryIndex = request.repositoryIndex;
  const { url, title, techs } = request.body;
  const repository = { ...repositories[repositoryIndex], url, title, techs };
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const repositoryIndex = request.repositoryIndex;
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const repositoryIndex = request.repositoryIndex;
  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;
  return response.json({ likes: repositories[repositoryIndex].likes });
});

module.exports = app;
