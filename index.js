const express = require("express");

const server = express();

const projects = [];
let numberOfRequests = 0;

server.use(express.json());

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  req.id = id;
  const project = projects.find(projeto => projeto.id === id);
  if (project) {
    next();
  }

  return res.status(404).json({ message: "Projeto não encontrado" });
}

function printNumberOfRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Quantidade de requisições: ${numberOfRequests}`);
  next();
}

server.use(printNumberOfRequests);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const newProject = {
    id,
    title,
    tasks: []
  };
  projects.push(newProject);
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req;
  projects[id] = { ...projects[id], title };
  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req;
  const index = projects.findIndex(projeto => projeto.id === id);
  projects.splice(index, 1);
  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req;
  const index = projects.findIndex(projeto => projeto.id === id);
  projects[index].tasks.push(title);
  return res.json(projects[index]);
});

server.listen(3000);
