const express = require('express');
const swaggerUi = require('swagger-ui-express');

const studentsRouter = require('./routes/students');
const coursesRouter = require('./routes/courses');

const swaggerJson = require('../swagger.json');

const app = express();
app.use(express.json());

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = require('../swaggerDef');

const options = {
  swaggerDefinition,
  apis: ['./src/controllers/*.js'], // Chemin vers les fichiers avec les commentaires JSDoc
};

// Generate spec if needed, but use the static swagger JSON by default
swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

const storage = require('./services/storage');

storage.seed();

app.use('/students', studentsRouter);
app.use('/courses', coursesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
