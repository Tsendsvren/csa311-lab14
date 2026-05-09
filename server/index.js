const express = require('express');
const app = express();
app.use(express.json());

// JSONPlaceholder-г дуурайсан mock сервер
// GitHub Actions-д бодит API хаагдах тохиолдолд ашиглана

const posts = Array.from({ length: 10 }, (_, i) => ({
  userId: Math.ceil((i + 1) / 2),
  id: i + 1,
  title: `Post title ${i + 1}`,
  body: `Post body content for post ${i + 1}`
}));

const users = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  username: `user${i + 1}`
}));

// GET /posts
app.get('/posts', (req, res) => {
  if (req.query.userId) {
    const uid = parseInt(req.query.userId);
    return res.json(posts.filter(p => p.userId === uid));
  }
  res.json(posts);
});

// GET /posts/:id
app.get('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(p => p.id === id);
  if (!post) return res.status(404).json({});
  res.json(post);
});

// POST /posts
app.post('/posts', (req, res) => {
  const newPost = { id: posts.length + 1, ...req.body };
  res.status(201).json(newPost);
});

// PUT /posts/:id
app.put('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updated = { id, ...req.body };
  res.json(updated);
});

// DELETE /posts/:id
app.delete('/posts/:id', (req, res) => {
  res.json({});
});

// GET /users
app.get('/users', (req, res) => {
  res.json(users);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Mock server running on http://localhost:${PORT}`));