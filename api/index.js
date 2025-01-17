const cors = require('cors')
const express = require('express');
const jobs = require("../data/jobs.json");
const app = express();
const port = 3000;

app.use(express.json())
app.use(cors());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.listen(
  port,
  () => console.log(`API is alive on http://localhost:${port}`)
)

app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.status(200).json("API is Running! Go to the endpoint: /jobs")
})

app.get('/jobs', (req, res) => {
  console.log(`Returning ${jobs.length} jobs`);
  res.status(200).json(jobs)
})

app.get('/jobs/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Searching for job with id: ${id}`);
  const job = jobs.find(job => job.id === String(id));
  
  if (job) {
    console.log(`Job found: ${job.title}`);
    res.status(200).json(job);
  } else {
    console.log(`Job with id ${id} not found`);
    res.status(404).json({ message: "Job not found" });
  }
});

app.post("/jobs", (req, res) => {
  let {
    id,
    title,
    type,
    description,
    location,
    salary,
    company
  } = req.body;

  console.log(`Attempting to create new job with title: ${title}`);

  // Generate a new ID if one isn't provided
  if (!id) {
    id = Math.max(...jobs.map(job => job.id), 0) + 1;
    console.log(`Generated new id: ${id}`);
  }

  if (jobs.some(job => job.id === String(id))) {
    console.log(`Job with id ${id} already exists`);
    return res.status(409).json({message: "A job with this ID already exists"})
  }

  if (!title || !location || !type || !description || !salary || !company) {
    console.log('Missing required fields');
    return res.status(400).json({message: "Missing required fields"})
  }

  const newJob = {
    id: String(id),
    title,
    type,
    description,
    location,
    salary,
    company
  };

  jobs.push(newJob);
  console.log(`New job created with id: ${id}`);

  res.status(201).json({
    message: `Created a new job with ID: ${id}`,
    job: newJob
  })
})

// Fallback Route
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.url}`);
  res.status(404).json({ message: "Route not found!" });
});
