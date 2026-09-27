const express = require('express');
const logger = require('./middleware/logger');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware to parse JSON request bodies
app.use(express.json());

// Custom request logging middleware
app.use(logger);

// Mount CRUD routes for students
app.use('/students', studentRoutes);

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Student Records Management API',
    endpoints: {
      getAllStudents: 'GET /students',
      getStudentById: 'GET /students/:id',
      createStudent: 'POST /students',
      updateStudent: 'PUT /students/:id',
      deleteStudent: 'DELETE /students/:id'
    }
  });
});

// 404 handler for non-existent routes
app.use((req, res, next) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`
  });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  // Handle JSON parse errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Malformed JSON payload in request body'
    });
  }

  console.error('[Unhandled Error]', err);

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error'
  });
});

// Start the server only if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running and listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
