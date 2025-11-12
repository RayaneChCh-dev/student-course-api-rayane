const storage = require('../services/storage');

exports.listStudents = (req, res) => {
  let students = storage.list('students');
  const {
    name, email, page = 1, limit = 10,
  } = req.query;
  if (name) students = students.filter((student) => student.name.includes(name));
  if (email) students = students.filter((student) => student.email.includes(email));
  const start = (page - 1) * limit;
  const paginated = students.slice(start, start + Number(limit));
  res.json({ students: paginated, total: students.length });
};

exports.getStudent = (req, res) => {
  const student = storage.get('students', req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  const courses = storage.getStudentCourses(req.params.id);
  return res.json({ student, courses });
};

exports.createStudent = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  const result = storage.create('students', { name, email });
  if (result.error) return res.status(400).json({ error: result.error });
  return res.status(201).json(result);
};

exports.deleteStudent = (req, res) => {
  const result = storage.remove('students', req.params.id);
  if (result === false) return res.status(404).json({ error: 'Student not found' });
  if (result.error) return res.status(400).json({ error: result.error });
  return res.status(204).send();
};

exports.updateStudent = (req, res) => {
  const student = storage.get('students', req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  const { name, email } = req.body;
  if (
    email
    && storage
      .list('students')
      .find((st) => st.email === email && st.id !== student.id)
  ) {
    return res.status(400).json({ error: 'Email must be unique' });
  }
  if (name) student.name = name;
  if (email) student.email = email;
  return res.json(student);
};
