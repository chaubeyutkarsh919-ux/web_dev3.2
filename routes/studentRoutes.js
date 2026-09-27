const express = require('express');
const router = express.Router();
const students = require('../data/students');

// Email regex helper
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @route   GET /students
 * @desc    Get all students
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json(students);
});

/**
 * @route   GET /students/:id
 * @desc    Get single student by ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  const student = students.find((s) => String(s.id) === req.params.id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.status(200).json(student);
});

/**
 * @route   POST /students
 * @desc    Create a new student
 * @access  Public
 */
router.post('/', (req, res) => {
  const { name, age, course, email } = req.body;

  // Validate presence of all required fields
  if (!name || age === undefined || age === null || !course || !email) {
    return res.status(400).json({
      message: 'Missing required fields: name, age, course, and email are required.'
    });
  }

  // Validate field types and formats
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      message: 'Invalid field: name must be a non-empty string.'
    });
  }

  const parsedAge = Number(age);
  if (Number.isNaN(parsedAge) || parsedAge <= 0 || !Number.isInteger(parsedAge)) {
    return res.status(400).json({
      message: 'Invalid field: age must be a positive integer.'
    });
  }

  if (typeof course !== 'string' || course.trim() === '') {
    return res.status(400).json({
      message: 'Invalid field: course must be a non-empty string.'
    });
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      message: 'Invalid field: email must be a valid email address.'
    });
  }

  // Auto-generate a unique ID
  const nextId =
    students.length > 0
      ? Math.max(...students.map((s) => Number(s.id) || 0)) + 1
      : 1;

  const newStudent = {
    id: nextId,
    name: name.trim(),
    age: parsedAge,
    course: course.trim(),
    email: email.trim().toLowerCase()
  };

  students.push(newStudent);

  res.status(201).json(newStudent);
});

/**
 * @route   PUT /students/:id
 * @desc    Update fields of an existing student
 * @access  Public
 */
router.put('/:id', (req, res) => {
  const student = students.find((s) => String(s.id) === req.params.id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  // Validate payload existence and type
  if (
    !req.body ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body) ||
    Object.keys(req.body).length === 0
  ) {
    return res.status(400).json({
      message: 'Invalid payload: Request body cannot be empty.'
    });
  }

  const { name, age, course, email } = req.body;

  // Ensure at least one updatable field is provided
  if (name === undefined && age === undefined && course === undefined && email === undefined) {
    return res.status(400).json({
      message: 'Invalid payload: At least one field (name, age, course, email) must be provided.'
    });
  }

  // Validate provided fields
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        message: 'Invalid field: name must be a non-empty string.'
      });
    }
  }

  if (age !== undefined) {
    const parsedAge = Number(age);
    if (Number.isNaN(parsedAge) || parsedAge <= 0 || !Number.isInteger(parsedAge)) {
      return res.status(400).json({
        message: 'Invalid field: age must be a positive integer.'
      });
    }
  }

  if (course !== undefined) {
    if (typeof course !== 'string' || course.trim() === '') {
      return res.status(400).json({
        message: 'Invalid field: course must be a non-empty string.'
      });
    }
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        message: 'Invalid field: email must be a valid email address.'
      });
    }
  }

  // Apply updates
  if (name !== undefined) student.name = name.trim();
  if (age !== undefined) student.age = Number(age);
  if (course !== undefined) student.course = course.trim();
  if (email !== undefined) student.email = email.trim().toLowerCase();

  res.status(200).json(student);
});

/**
 * @route   DELETE /students/:id
 * @desc    Delete a student by ID
 * @access  Public
 */
router.delete('/:id', (req, res) => {
  const studentIndex = students.findIndex((s) => String(s.id) === req.params.id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  students.splice(studentIndex, 1);

  res.status(200).json({ message: 'Student deleted successfully' });
});

module.exports = router;
