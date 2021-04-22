import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});



const app = express();

// Apply middlware for CORS and JSON endpoing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/issues', async (req, res) => {
  const { q, order, per_page, state, labels = '' } = req.query;
  console.log({ q, order, per_page, state, labels })
  const REPO = `repo:facebook/react`;
  const result = await octokit.rest.search.issuesAndPullRequests({
    q: `${REPO} ${q} state:${state} is:issue ${labels}`,
    order,
    per_page,
  })

  res.json(result.data.items)
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
