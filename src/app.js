import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { Octokit } from "@octokit/rest";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/issues', async (req, res) => {
  const { q, per_page = 5, state = 'open', labels = '' } = req.query;
  const REPO = `repo:facebook/react`;

  try {
    const result = await octokit.rest.search.issuesAndPullRequests({
      q: `${REPO} ${q} state:${state} is:issue ${labels}`,
      per_page
    })

    res.json(result.data.items)
  } catch (error) {
    res.status(error.status).json({
      message: error
    })
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
