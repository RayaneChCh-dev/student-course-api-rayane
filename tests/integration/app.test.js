const request = require('supertest');
const app = require('../../src/app');

describe('Student-Course API integration', () => {
  beforeEach(() => {
    require('../../src/services/storage').reset();
    require('../../src/services/storage').seed();
  });

  // ========== STUDENTS TESTS ==========
  describe('Students endpoints', () => {
    test('GET /students should return seeded students', async () => {
      const res = await request(app).get('/students');
      expect(res.statusCode).toBe(200);
      expect(res.body.students.length).toBe(3);
      expect(res.body.students[0].name).toBe('Alice');
    });

    test('GET /students should support pagination', async () => {
      const res = await request(app).get('/students?page=1&limit=2');
      expect(res.statusCode).toBe(200);
      expect(res.body.students.length).toBe(2);
      expect(res.body.total).toBe(3);
    });

    test('GET /students should support name filtering', async () => {
      const res = await request(app).get('/students?name=Alice');
      expect(res.statusCode).toBe(200);
      expect(res.body.students.length).toBe(1);
      expect(res.body.students[0].name).toBe('Alice');
    });

    test('GET /students should support email filtering', async () => {
      const res = await request(app).get('/students?email=bob@example.com');
      expect(res.statusCode).toBe(200);
      expect(res.body.students.length).toBe(1);
      expect(res.body.students[0].email).toBe('bob@example.com');
    });

    test('GET /students/:id should return a specific student with courses', async () => {
      const res = await request(app).get('/students/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.student.name).toBe('Alice');
      expect(res.body.courses).toBeDefined();
    });

    test('GET /students/:id should return 404 for non-existent student', async () => {
      const res = await request(app).get('/students/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Student not found');
    });

    test('POST /students should create a new student', async () => {
      const res = await request(app)
        .post('/students')
        .send({ name: 'David', email: 'david@example.com' });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('David');
      expect(res.body.email).toBe('david@example.com');
    });

    test('POST /students should not allow duplicate email', async () => {
      const res = await request(app)
        .post('/students')
        .send({ name: 'Eve', email: 'alice@example.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email must be unique');
    });

    test('POST /students should require name and email', async () => {
      const res = await request(app).post('/students').send({ name: 'Frank' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('name and email required');
    });

    test('PUT /students/:id should update a student', async () => {
      const res = await request(app)
        .put('/students/1')
        .send({ name: 'Alice Updated', email: 'alice-new@example.com' });
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Alice Updated');
      expect(res.body.email).toBe('alice-new@example.com');
    });

    test('PUT /students/:id should not allow duplicate email', async () => {
      const res = await request(app)
        .put('/students/1')
        .send({ email: 'bob@example.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email must be unique');
    });

    test('PUT /students/:id should return 404 for non-existent student', async () => {
      const res = await request(app)
        .put('/students/999')
        .send({ name: 'Updated' });
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Student not found');
    });

    test('DELETE /students/:id should delete a student', async () => {
      const res = await request(app).delete('/students/1');
      expect(res.statusCode).toBe(204);
      const checkRes = await request(app).get('/students/1');
      expect(checkRes.statusCode).toBe(404);
    });

    test('DELETE /students/:id should not delete enrolled student', async () => {
      await request(app).post('/courses/1/students/1');
      const res = await request(app).delete('/students/1');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe(
        'Cannot delete student: enrolled in a course',
      );
    });

    test('DELETE /students/:id should return 404 for non-existent student', async () => {
      const res = await request(app).delete('/students/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Student not found');
    });
  });

  // ========== COURSES TESTS ==========
  describe('Courses endpoints', () => {
    test('GET /courses should return seeded courses', async () => {
      const res = await request(app).get('/courses');
      expect(res.statusCode).toBe(200);
      expect(res.body.courses.length).toBe(3);
      expect(res.body.courses[0].title).toBe('Math');
    });

    test('GET /courses should support title filtering', async () => {
      const res = await request(app).get('/courses?title=Math');
      expect(res.statusCode).toBe(200);
      expect(res.body.courses.length).toBe(1);
      expect(res.body.courses[0].title).toBe('Math');
    });

    test('GET /courses should support teacher filtering', async () => {
      const res = await request(app).get('/courses?teacher=Mr.%20Smith');
      expect(res.statusCode).toBe(200);
      expect(res.body.courses[0].teacher).toContain('Mr. Smith');
    });

    test('GET /courses should support pagination', async () => {
      const res = await request(app).get('/courses?page=1&limit=2');
      expect(res.statusCode).toBe(200);
      expect(res.body.courses.length).toBe(2);
      expect(res.body.total).toBe(3);
    });

    test('GET /courses/:id should return a specific course with students', async () => {
      const res = await request(app).get('/courses/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.course.title).toBe('Math');
      expect(Array.isArray(res.body.students)).toBe(true);
    });

    test('GET /courses/:id should return 404 for non-existent course', async () => {
      const res = await request(app).get('/courses/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Course not found');
    });

    test('POST /courses should create a new course', async () => {
      const res = await request(app)
        .post('/courses')
        .send({ title: 'Chemistry', teacher: 'Dr. Green' });
      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe('Chemistry');
      expect(res.body.teacher).toBe('Dr. Green');
    });

    test('POST /courses should not allow duplicate title', async () => {
      const res = await request(app)
        .post('/courses')
        .send({ title: 'Math', teacher: 'Someone' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Course title must be unique');
    });

    test('POST /courses should require title and teacher', async () => {
      const res = await request(app)
        .post('/courses')
        .send({ title: 'Biology' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('title and teacher required');
    });

    test('PUT /courses/:id should update a course', async () => {
      const res = await request(app)
        .put('/courses/1')
        .send({ title: 'Advanced Math', teacher: 'Prof. Smith' });
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Advanced Math');
      expect(res.body.teacher).toBe('Prof. Smith');
    });

    test('PUT /courses/:id should not allow duplicate title', async () => {
      const res = await request(app)
        .put('/courses/1')
        .send({ title: 'Physics' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Course title must be unique');
    });

    test('PUT /courses/:id should return 404 for non-existent course', async () => {
      const res = await request(app)
        .put('/courses/999')
        .send({ title: 'Updated' });
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Course not found');
    });

    test('DELETE /courses/:id should delete a course even if students are enrolled', async () => {
      await request(app).post('/courses/1/students/1');
      const res = await request(app).delete('/courses/1');
      expect(res.statusCode).toBe(204);
    });

    test('DELETE /courses/:id should return 404 for non-existent course', async () => {
      const res = await request(app).delete('/courses/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Course not found');
    });
  });

  // ========== ENROLLMENT TESTS ==========
  describe('Enrollment endpoints', () => {
    test('POST /courses/:courseId/students/:studentId should enroll student', async () => {
      const res = await request(app).post('/courses/1/students/1');
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });

    test('POST /courses/:courseId/students/:studentId should not allow duplicate enrollment', async () => {
      await request(app).post('/courses/1/students/1');
      const res = await request(app).post('/courses/1/students/1');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Student already enrolled in this course');
    });

    test('POST /courses/:courseId/students/:studentId should not exceed 3 students', async () => {
      await request(app).post('/courses/1/students/1');
      await request(app).post('/courses/1/students/2');
      await request(app).post('/courses/1/students/3');
      const res = await request(app).post('/courses/1/students/1');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Student already enrolled in this course');
    });

    test('POST /courses/:courseId/students/:studentId should return error for non-existent course', async () => {
      const res = await request(app).post('/courses/999/students/1');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Course not found');
    });

    test('POST /courses/:courseId/students/:studentId should return error for non-existent student', async () => {
      const res = await request(app).post('/courses/1/students/999');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Student not found');
    });

    test('DELETE /courses/:courseId/students/:studentId should unenroll student', async () => {
      await request(app).post('/courses/1/students/1');
      const res = await request(app).delete('/courses/1/students/1');
      expect(res.statusCode).toBe(204);
    });

    test('DELETE /courses/:courseId/students/:studentId should return 404 for non-existent enrollment', async () => {
      const res = await request(app).delete('/courses/1/students/1');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Enrollment not found');
    });
  });

  // ========== ERROR HANDLING TESTS ==========
  describe('Error handling', () => {
    test('GET /nonexistent should return 404', async () => {
      const res = await request(app).get('/nonexistent');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });
  });
});
