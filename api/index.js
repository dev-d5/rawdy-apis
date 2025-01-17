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
  const newJob = req.body;
  console.log(`Attempting to create new job: ${newJob.title}`);

  if (!newJob.id) {
    newJob.id = String(Math.max(...jobs.map(job => parseInt(job.id)), 0) + 1);
  }

  if (jobs.some(job => job.id === String(newJob.id))) {
    console.log(`Job with id ${newJob.id} already exists`);
    return res.status(409).json({message: "A job with this ID already exists"})
  }

  jobs.push(newJob);
  console.log(`New job created with id: ${newJob.id}`);
  res.status(201).json(newJob);
})

app.put("/jobs/:id", (req, res) => {
  const { id } = req.params;
  const updatedJob = req.body;
  console.log(`Attempting to update job with id: ${id}`);

  const index = jobs.findIndex(job => job.id === String(id));
  
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updatedJob, id: String(id) };
    console.log(`Job updated: ${jobs[index].title}`);
    res.status(200).json(jobs[index]);
  } else {
    console.log(`Job with id ${id} not found for update`);
    res.status(404).json({ message: "Job not found" });
  }
})

app.delete("/jobs/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete job with id: ${id}`);

  const index = jobs.findIndex(job => job.id === String(id));
  
  if (index !== -1) {
    const deletedJob = jobs.splice(index, 1)[0];
    console.log(`Job deleted: ${deletedJob.title}`);
    res.status(200).json({ message: "Job deleted successfully", job: deletedJob });
  } else {
    console.log(`Job with id ${id} not found for deletion`);
    res.status(404).json({ message: "Job not found" });
  }
})

// Fallback Route
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.url}`);
  res.status(404).json({ message: "Route not found!" });
});