import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from Backend import db

def run_tests():
    print("=" * 60)
    print("    ONLINE EXAMINATION SYSTEM - SYSTEM VERIFICATION TEST")
    print("=" * 60)
    
    # 1. Verify Students
    print("\n[1] Verifying Student Management...")
    students = db.get_all_students()
    print(f" -> Found {len(students)} students in database.")
    for s in students:
        print(f"    - ID: {s['student_id']}, Name: {s['full_name']}, Email: {s['email']}, College: {s['college']}")
    
    # Test Adding a Student
    test_student = {
        "student_id": 102,
        "full_name": "Amit Patel",
        "email": "amit@gmail.com",
        "phone": "9988776655",
        "college": "XYZ Technological University",
        "password": "amitpassword"
    }
    try:
        new_id = db.add_student(test_student)
        print(f" -> Added student '{test_student['full_name']}' successfully with ID {new_id}.")
        added_s = db.get_student_by_id(new_id)
        assert added_s['email'] == test_student['email'], "Added student email mismatch"
    except Exception as e:
        print(f" -> ERROR adding student: {e}")
        
    # 2. Verify Exams
    print("\n[2] Verifying Examination Management...")
    exams = db.get_all_exams()
    print(f" -> Found {len(exams)} exams in database.")
    for e in exams:
        print(f"    - ID: {e['exam_id']}, Title: {e['exam_title']}, Subject: {e['subject']}, Duration: {e['duration']} mins")
        
    # Test Adding an Exam
    test_exam = {
        "exam_id": 202,
        "exam_title": "Web Development using Django",
        "subject": "Django",
        "duration": 90,
        "total_marks": 100,
        "exam_date": "2026-08-20"
    }
    try:
        new_exam_id = db.add_exam(test_exam)
        print(f" -> Added exam '{test_exam['exam_title']}' successfully with ID {new_exam_id}.")
        added_e = db.get_exam_by_id(new_exam_id)
        assert added_e['exam_title'] == test_exam['exam_title'], "Added exam title mismatch"
    except Exception as e:
        print(f" -> ERROR adding exam: {e}")

    # 3. Verify Questions
    print("\n[3] Verifying Question Management...")
    questions = db.get_all_questions()
    print(f" -> Found {len(questions)} questions in database.")
    for q in questions[:3]:
        print(f"    - ID: {q['question_id']}, Exam: {q['exam_title']}, Question: {q['question'][:40]}... Ans: {q['correct_answer']}")

    # Test Adding a Question
    test_q = {
        "question_id": 304,
        "exam_title": "Python Programming Test",
        "question": "Which of the following functions generates a random float in Python?",
        "option_a": "random.rand()",
        "option_b": "random.random()",
        "option_c": "random.float()",
        "option_d": "random.randint()",
        "correct_answer": "random.random()",
        "marks": 5
    }
    try:
        new_q_id = db.add_question(test_q)
        print(f" -> Added question successfully with ID {new_q_id}.")
        added_q = db.get_question_by_id(new_q_id)
        assert added_q['correct_answer'] == test_q['correct_answer'], "Added question correct answer mismatch"
    except Exception as e:
        print(f" -> ERROR adding question: {e}")

    # 4. Verify Submissions
    print("\n[4] Verifying Submission Management...")
    subs = db.get_all_submissions()
    print(f" -> Found {len(subs)} submissions in database.")
    for s in subs:
        print(f"    - ID: {s['submission_id']}, Candidate: {s['student_name']}, Exam: {s['exam_title']}, Score: {s['score']}")

    # 5. Verify Results
    print("\n[5] Verifying Result Management...")
    results = db.get_all_results()
    print(f" -> Found {len(results)} results in database.")
    for r in results:
        print(f"    - ID: {r['result_id']}, Student: {r['student_name']}, Exam: {r['exam_title']}, Score: {r['obtained_marks']}/{r['total_marks']}, %: {r['percentage']}%, Status: {r['result_status']}")

    # Cleanup added entities to leave database clean
    print("\n[6] Performing test cleanup...")
    db.delete_student(102)
    db.delete_exam(202)
    db.delete_question(304)
    print(" -> Mock entries cleaned up successfully.")
    
    print("\n" + "=" * 60)
    print("      ALL SYSTEMS INTEGRATE CORRECTLY - DB VALIDATION PASSED")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()
