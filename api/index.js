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
  res.status(200).send("APi is Running! go to the end point: /jobs")
})

app.get('/jobs', (req, res) => {
  res.status(200).send(jobs)
})

app.post("/jobs/:id", (req, res) => {
  const {id} = req.params;
  const {title, location} = req.body;

  if (!title) {
    res.status("418").send({message: "we need some title!"})
  }
  
  if (!location) {
    res.status("418").send({message: "we need a location!"})
  }

  res.status("200").send({
    title: `created a job with an ID: ${id}, title: ${title} and location: ${location}`
  })

})

// Fallback Route
app.use((req, res) => {
  res.status(404).send({ message: "Route not found!" });
});