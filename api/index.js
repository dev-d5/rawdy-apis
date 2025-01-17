const cors = require('cors')
const express = require('express');
const jobs = require("../data/jobs.json");
const app = express();
const port = 3000;

app.use(express.json())
app.use(cors());

app.listen(
  port,
  () => console.log(`API is alive on http://localhost:${port}`)
)

app.get('/', (req, res) => {
  res.status(200).json("API is Running! Go to the endpoint: /jobs")
})

app.get('/jobs', (req, res) => {
  res.status(200).json(jobs)
})

app.get('/jobs/:id', (req, res) => {
  const { id } = req.params;
  const job = jobs.find(job => job.id === String(id));
  
  if (job) {
    res.status(200).json(job);
  } else {
    res.status(404).json({ message: "Job not found" });
  }
});

app.post("/jobs", (req, res) => {
  const {
    id,
    title,
    type,
    description,
    location,
    salary,
    company
  } = req.body;

  if (jobs.some(job => job.id === String(id))) {
    return res.status(409).json({message: "A job with this ID already exists"})
  }

  if (!title || !location || !type || !description || !salary || !company) {
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

  res.status(201).json({
    message: `Created a new job with ID: ${id}`,
    job: newJob
  })
})

// Fallback Route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found!" });
});