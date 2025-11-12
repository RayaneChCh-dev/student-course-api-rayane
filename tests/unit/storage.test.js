const storage = require('../../src/services/storage');

beforeEach(() => {
  storage.reset();
  storage.seed();
});

test('should NOT allow duplicate course title', () => {
  const result = storage.create('courses', {
    title: 'Math',
    teacher: 'Someone',
  });
  expect(result.error).toBe('Course title must be unique');
});

test('should list seeded students', () => {
  const students = storage.list('students');
  expect(students.length).toBe(3);
  expect(students[0].name).toBe('Alice');
});

test('should create a new student', () => {
  const result = storage.create('students', {
    name: 'David',
    email: 'david@example.com',
  });
  expect(result.name).toBe('David');
  expect(storage.list('students').length).toBe(4);
});

test('should not allow duplicate student email', () => {
  const result = storage.create('students', {
    name: 'Eve',
    email: 'alice@example.com',
  });
  expect(result.error).toBe('Email must be unique');
});

test('should delete a student', () => {
  const students = storage.list('students');
  const result = storage.remove('students', students[0].id);
  expect(result).toBe(true);
});

test('should NOT allow more than 3 students in a course', () => {
  const students = storage.list('students');
  const course = storage.list('courses')[0];
  storage.create('students', { name: 'Extra', email: 'extra@example.com' });
  storage.create('students', { name: 'Extra2', email: 'extra2@example.com' });
  storage.enroll(students[0].id, course.id);
  storage.enroll(students[1].id, course.id);
  storage.enroll(students[2].id, course.id);
  const result = storage.enroll(4, course.id);
  expect(result.error).toBe('Course is full');
});

// Additional unit tests for edge cases and error handling
test('should not allow enrolling non-existent student', () => {
  const course = storage.list('courses')[0];
  const result = storage.enroll(999, course.id);
  expect(result.error).toBe('Student not found');
});

test('should not allow enrolling in non-existent course', () => {
  const student = storage.list('students')[0];
  const result = storage.enroll(student.id, 999);
  expect(result.error).toBe('Course not found');
});

test('should not allow duplicate enrollment', () => {
  const student = storage.list('students')[0];
  const course = storage.list('courses')[0];
  storage.enroll(student.id, course.id);
  const result = storage.enroll(student.id, course.id);
  expect(result.error).toBe('Student already enrolled in this course');
});

test('should unenroll a student from course', () => {
  const student = storage.list('students')[0];
  const course = storage.list('courses')[0];
  storage.enroll(student.id, course.id);
  const result = storage.unenroll(student.id, course.id);
  expect(result.success).toBe(true);
});

test('should not allow unenrolling from non-existent enrollment', () => {
  const student = storage.list('students')[0];
  const course = storage.list('courses')[0];
  const result = storage.unenroll(student.id, course.id);
  expect(result.error).toBe('Enrollment not found');
});

test('should get student courses', () => {
  const student = storage.list('students')[0];
  const courses = storage.list('courses');
  storage.enroll(student.id, courses[0].id);
  storage.enroll(student.id, courses[1].id);
  const studentCourses = storage.getStudentCourses(student.id);
  expect(studentCourses.length).toBe(2);
  expect(studentCourses[0].title).toBe('Math');
});

test('should get course students', () => {
  const students = storage.list('students');
  const courses = storage.list('courses');
  const course = courses[1];
  storage.enroll(students[0].id, course.id);
  storage.enroll(students[1].id, course.id);
  const courseStudents = storage.getCourseStudents(course.id);
  expect(courseStudents.length).toBe(2);
  expect(courseStudents[0].name).toBe('Alice');
  expect(courseStudents[1].name).toBe('Bob');
});

test('should not allow deleting student enrolled in course', () => {
  const student = storage.list('students')[0];
  const course = storage.list('courses')[0];
  storage.enroll(student.id, course.id);
  const result = storage.remove('students', student.id);
  expect(result.error).toBe('Cannot delete student: enrolled in a course');
});

test('should allow deleting course with enrolled students (cascade)', () => {
  const student = storage.list('students')[0];
  const course = storage.list('courses')[0];
  storage.enroll(student.id, course.id);
  const result = storage.remove('courses', course.id);
  expect(result).toBe(true);
  expect(storage.list('courses').length).toBe(2);
});

test('should return false when deleting non-existent student', () => {
  const result = storage.remove('students', 999);
  expect(result).toBe(false);
});

test('should return false when deleting non-existent course', () => {
  const result = storage.remove('courses', 999);
  expect(result).toBe(false);
});

test('should get student by id', () => {
  const students = storage.list('students');
  const student = storage.get('students', students[0].id);
  expect(student.name).toBe('Alice');
});

test('should return undefined for non-existent student', () => {
  const result = storage.get('students', 999);
  expect(result).toBeUndefined();
});
