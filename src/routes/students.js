const express = require('express');
const {
  listStudents,
  getStudent,
  createStudent,
  deleteStudent,
  updateStudent,
} = require('../controllers/studentsController');

const router = express.Router();
router.get('/', listStudents);
router.get('/:id', getStudent);
router.post('/', createStudent);
router.delete('/:id', deleteStudent);
router.put('/:id', updateStudent);

module.exports = router;
