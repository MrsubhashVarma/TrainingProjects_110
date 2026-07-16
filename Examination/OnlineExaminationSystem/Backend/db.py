import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'db.sqlite3')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Students Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        student_id INTEGER PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        college TEXT,
        password TEXT NOT NULL
    )
    """)
    
    # 2. Exams Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS exams (
        exam_id INTEGER PRIMARY KEY,
        exam_title TEXT UNIQUE NOT NULL,
        subject TEXT,
        duration INTEGER,
        total_marks INTEGER,
        exam_date TEXT
    )
    """)
    
    # 3. Questions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        question_id INTEGER PRIMARY KEY,
        exam_title TEXT NOT NULL,
        question TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        marks INTEGER NOT NULL
    )
    """)
    
    # 4. Submissions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS submissions (
        submission_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT NOT NULL,
        exam_title TEXT NOT NULL,
        submitted_answers TEXT,
        score INTEGER,
        submitted_at TEXT
    )
    """)
    
    # 5. Results Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS results (
        result_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT NOT NULL,
        exam_title TEXT NOT NULL,
        total_marks INTEGER,
        obtained_marks INTEGER,
        percentage REAL,
        result_status TEXT
    )
    """)
    
    # --- SEED MOCK DATA ---
    # Seed sample student if empty
    if cursor.execute("SELECT COUNT(*) FROM students").fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO students (student_id, full_name, email, phone, college, password)
        VALUES (101, 'Rahul Sharma', 'rahul@gmail.com', '9876543210', 'ABC Engineering College', 'rahul123')
        """)
        
    # Seed sample exam if empty
    if cursor.execute("SELECT COUNT(*) FROM exams").fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO exams (exam_id, exam_title, subject, duration, total_marks, exam_date)
        VALUES (201, 'Python Programming Test', 'Python', 60, 100, '2026-08-15')
        """)
        
    # Seed sample questions if empty
    if cursor.execute("SELECT COUNT(*) FROM questions").fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO questions (question_id, exam_title, question, option_a, option_b, option_c, option_d, correct_answer, marks)
        VALUES (301, 'Python Programming Test', 'Which keyword is used to define a function in Python?', 'function', 'def', 'func', 'define', 'def', 5)
        """)
        cursor.execute("""
        INSERT INTO questions (question_id, exam_title, question, option_a, option_b, option_c, option_d, correct_answer, marks)
        VALUES (302, 'Python Programming Test', 'Which of the following is an immutable data type in Python?', 'list', 'dictionary', 'tuple', 'set', 'tuple', 5)
        """)
        cursor.execute("""
        INSERT INTO questions (question_id, exam_title, question, option_a, option_b, option_c, option_d, correct_answer, marks)
        VALUES (303, 'Python Programming Test', 'What is the output of len(["hello", "world"]) in Python?', '10', '2', '1', '5', '2', 5)
        """)

    # Seed sample submissions if empty
    if cursor.execute("SELECT COUNT(*) FROM submissions").fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO submissions (submission_id, student_name, exam_title, submitted_answers, score, submitted_at)
        VALUES (401, 'Rahul Sharma', 'Python Programming Test', 'Q301:def,Q302:list,Q303:tuple', 90, '2026-08-15 11:30:00')
        """)

    # Seed sample results if empty
    if cursor.execute("SELECT COUNT(*) FROM results").fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO results (result_id, student_name, exam_title, total_marks, obtained_marks, percentage, result_status)
        VALUES (501, 'Rahul Sharma', 'Python Programming Test', 100, 90, 90.0, 'Pass')
        """)
        
    conn.commit()
    conn.close()


# Auto-initialize database tables when this module is imported
init_db()

# --- STUDENT CRUD ---

def get_all_students():
    conn = get_db_connection()
    students = conn.execute("SELECT * FROM students").fetchall()
    conn.close()
    return [dict(s) for s in students]

def get_student_by_id(student_id):
    conn = get_db_connection()
    student = conn.execute("SELECT * FROM students WHERE student_id = ?", (student_id,)).fetchone()
    conn.close()
    return dict(student) if student else None

def get_student_by_email(email):
    conn = get_db_connection()
    student = conn.execute("SELECT * FROM students WHERE email = ?", (email,)).fetchone()
    conn.close()
    return dict(student) if student else None

def add_student(student_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    # Check if student_id is provided, otherwise let it auto-increment or find max
    student_id = student_data.get('student_id')
    if not student_id:
        max_id = cursor.execute("SELECT MAX(student_id) FROM students").fetchone()[0]
        student_id = (max_id if max_id else 100) + 1
        
    cursor.execute("""
    INSERT INTO students (student_id, full_name, email, phone, college, password)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        student_id,
        student_data['full_name'],
        student_data['email'],
        student_data.get('phone', ''),
        student_data.get('college', ''),
        student_data['password']
    ))
    conn.commit()
    conn.close()
    return student_id

def update_student(student_id, student_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE students
    SET full_name = ?, email = ?, phone = ?, college = ?, password = ?
    WHERE student_id = ?
    """, (
        student_data['full_name'],
        student_data['email'],
        student_data.get('phone', ''),
        student_data.get('college', ''),
        student_data['password'],
        student_id
    ))
    conn.commit()
    rowcount = cursor.rowcount
    conn.close()
    return rowcount > 0

def delete_student(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM students WHERE student_id = ?", (student_id,))
    conn.commit()
    rowcount = cursor.rowcount
    conn.close()
    return rowcount > 0


# --- EXAMINATION CRUD ---

def get_all_exams():
    conn = get_db_connection()
    exams = conn.execute("SELECT * FROM exams").fetchall()
    conn.close()
    return [dict(e) for e in exams]

def get_exam_by_id(exam_id):
    conn = get_db_connection()
    exam = conn.execute("SELECT * FROM exams WHERE exam_id = ?", (exam_id,)).fetchone()
    conn.close()
    return dict(exam) if exam else None

def get_exam_by_title(exam_title):
    conn = get_db_connection()
    exam = conn.execute("SELECT * FROM exams WHERE exam_title = ?", (exam_title,)).fetchone()
    conn.close()
    return dict(exam) if exam else None

def add_exam(exam_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    exam_id = exam_data.get('exam_id')
    if not exam_id:
        max_id = cursor.execute("SELECT MAX(exam_id) FROM exams").fetchone()[0]
        exam_id = (max_id if max_id else 200) + 1
        
    cursor.execute("""
    INSERT INTO exams (exam_id, exam_title, subject, duration, total_marks, exam_date)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        exam_id,
        exam_data['exam_title'],
        exam_data.get('subject', ''),
        int(exam_data.get('duration', 60)),
        int(exam_data.get('total_marks', 100)),
        exam_data.get('exam_date', '')
    ))
    conn.commit()
    conn.close()
    return exam_id

def update_exam(exam_id, exam_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE exams
    SET exam_title = ?, subject = ?, duration = ?, total_marks = ?, exam_date = ?
    WHERE exam_id = ?
    """, (
        exam_data['exam_title'],
        exam_data.get('subject', ''),
        int(exam_data.get('duration', 60)),
        int(exam_data.get('total_marks', 100)),
        exam_data.get('exam_date', ''),
        exam_id
    ))
    conn.commit()
    rowcount = cursor.rowcount
    conn.close()
    return rowcount > 0

def delete_exam(exam_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM exams WHERE exam_id = ?", (exam_id,))
    conn.commit()
    rowcount = cursor.rowcount
    conn.close()
    return rowcount > 0


# --- QUESTION CRUD ---

def get_all_questions():
    conn = get_db_connection()
    questions = conn.execute("SELECT * FROM questions").fetchall()
    conn.close()
    return [dict(q) for q in questions]

def get_question_by_id(question_id):
    conn = get_db_connection()
    question = conn.execute("SELECT * FROM questions WHERE question_id = ?", (question_id,)).fetchone()
    conn.close()
    return dict(question) if question else None

def get_questions_by_exam_title(exam_title):
    conn = get_db_connection()
    questions = conn.execute("SELECT * FROM questions WHERE exam_title = ?", (exam_title,)).fetchall()
    conn.close()
    return [dict(q) for q in questions]

def add_question(q_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    question_id = q_data.get('question_id')
    if not question_id:
        max_id = cursor.execute("SELECT MAX(question_id) FROM questions").fetchone()[0]
        question_id = (max_id if max_id else 300) + 1
        
    cursor.execute("""
    INSERT INTO questions (question_id, exam_title, question, option_a, option_b, option_c, option_d, correct_answer, marks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        question_id,
        q_data['exam_title'],
        q_data['question'],
        q_data['option_a'],
        q_data['option_b'],
        q_data['option_c'],
        q_data['option_d'],
        q_data['correct_answer'],
        int(q_data.get('marks', 5))
    ))
    conn.commit()
    conn.close()
    return question_id

def update_question(question_id, q_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE questions
    SET exam_title = ?, question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ?, marks = ?
    WHERE question_id = ?
    """, (
        q_data['exam_title'],
        q_data['question'],
        q_data['option_a'],
        q_data['option_b'],
        q_data['option_c'],
        q_data['option_d'],
        q_data['correct_answer'],
        int(q_data.get('marks', 5)),
        question_id
    ))
    conn.commit()
    rowcount = cursor.rowcount
    conn.close()
    return rowcount > 0

def delete_question(question_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM questions WHERE question_id = ?", (question_id,))
    conn.commit()
    rowcount = cursor.rowcount
    conn.close()
    return rowcount > 0


# --- EXAM SUBMISSION CRUD ---

def get_all_submissions():
    conn = get_db_connection()
    subs = conn.execute("SELECT * FROM submissions").fetchall()
    conn.close()
    return [dict(s) for s in subs]

def get_submission_by_id(submission_id):
    conn = get_db_connection()
    sub = conn.execute("SELECT * FROM submissions WHERE submission_id = ?", (submission_id,)).fetchone()
    conn.close()
    return dict(sub) if sub else None

def add_submission(sub_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    submission_id = sub_data.get('submission_id')
    if not submission_id:
        # Check database for auto-increment index
        pass
        
    cursor.execute("""
    INSERT INTO submissions (submission_id, student_name, exam_title, submitted_answers, score, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        submission_id,  # Can be None, which SQL auto-increments
        sub_data['student_name'],
        sub_data['exam_title'],
        sub_data.get('submitted_answers', ''),
        int(sub_data.get('score', 0)),
        sub_data.get('submitted_at', '')
    ))
    conn.commit()
    last_id = cursor.lastrowid
    inserted_id = submission_id if submission_id else last_id
    conn.close()
    return inserted_id

def update_submission(submission_id, sub_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE submissions
    SET student_name = ?, exam_title = ?, submitted_answers = ?, score = ?, submitted_at = ?
    WHERE submission_id = ?
    """, (
        sub_data['student_name'],
        sub_data['exam_title'],
        sub_data.get('submitted_answers', ''),
        int(sub_data.get('score', 0)),
        sub_data.get('submitted_at', ''),
        submission_id
    ))
    conn.commit()
    rowcount = cursor.rowcount
    conn.close()
    return rowcount > 0

def delete_submission(submission_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM submissions WHERE submission_id = ?", (submission_id,))
    conn.commit()
    rowcount = cursor.rowcount
    conn.close()
    return rowcount > 0


# --- RESULT CRUD ---

def get_all_results():
    conn = get_db_connection()
    results = conn.execute("SELECT * FROM results").fetchall()
    conn.close()
    return [dict(r) for r in results]

def get_result_by_id(result_id):
    conn = get_db_connection()
    res = conn.execute("SELECT * FROM results WHERE result_id = ?", (result_id,)).fetchone()
    conn.close()
    return dict(res) if res else None

def add_result(res_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    result_id = res_data.get('result_id')
    
    cursor.execute("""
    INSERT INTO results (result_id, student_name, exam_title, total_marks, obtained_marks, percentage, result_status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        result_id,  # Can be None, SQL auto-increments
        res_data['student_name'],
        res_data['exam_title'],
        int(res_data.get('total_marks', 100)),
        int(res_data.get('obtained_marks', 0)),
        float(res_data.get('percentage', 0.0)),
        res_data.get('result_status', 'Fail')
    ))
    conn.commit()
    last_id = cursor.lastrowid
    inserted_id = result_id if result_id else last_id
    conn.close()
    return inserted_id

def update_result(result_id, res_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE results
    SET student_name = ?, exam_title = ?, total_marks = ?, obtained_marks = ?, percentage = ?, result_status = ?
    WHERE result_id = ?
    """, (
        res_data['student_name'],
        res_data['exam_title'],
        int(res_data.get('total_marks', 100)),
        int(res_data.get('obtained_marks', 0)),
        float(res_data.get('percentage', 0.0)),
        res_data.get('result_status', 'Fail'),
        result_id
    ))
    conn.commit()
    rowcount = cursor.rowcount
    conn.close()
    return rowcount > 0

def delete_result(result_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM results WHERE result_id = ?", (result_id,))
    conn.commit()
    rowcount = cursor.rowcount
    conn.close()
    return rowcount > 0
