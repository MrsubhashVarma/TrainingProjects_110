from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from . import db
import datetime

# --- AUTHENTICATION ---

@api_view(['POST'])
def login_view(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'student') # 'student' or 'admin'
    
    if role == 'admin':
        if email == 'admin@gmail.com' and password == 'admin123':
            return Response({
                "message": "Admin Login successful",
                "role": "admin",
                "user": {"full_name": "Administrator", "email": email}
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid Administrator credentials"}, status=status.HTTP_400_BAD_REQUEST)
        
    student = db.get_student_by_email(email)
    if student and student['password'] == password:
        return Response({
            "message": "Student Login successful",
            "role": "student",
            "user": student
        }, status=status.HTTP_200_OK)
        
    return Response({"error": "Invalid Student credentials"}, status=status.HTTP_400_BAD_REQUEST)


# --- STUDENT MANAGEMENT ---

@api_view(['GET', 'POST'])
def students_list_or_add(request):
    if request.method == 'GET':
        students = db.get_all_students()
        return Response(students, status=status.HTTP_200_OK)
        
    elif request.method == 'POST':
        data = request.data
        if not data.get('full_name') or not data.get('email') or not data.get('password'):
            return Response({"error": "Missing required fields (full_name, email, password)"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if email already registered
        if db.get_student_by_email(data['email']):
            return Response({"error": "Student with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            student_id = db.add_student(data)
            return Response({
                "message": "Student registered successfully",
                "student_id": student_id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
def student_detail_update_delete(request, pk):
    # pk could be string, cast to int
    try:
        student_id = int(pk)
    except ValueError:
        return Response({"error": "Invalid Student ID format"}, status=status.HTTP_400_BAD_REQUEST)
        
    student = db.get_student_by_id(student_id)
    if not student:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        return Response(student, status=status.HTTP_200_OK)
        
    elif request.method == 'PUT':
        data = request.data
        if not data.get('full_name') or not data.get('email') or not data.get('password'):
            return Response({"error": "Missing required fields (full_name, email, password)"}, status=status.HTTP_400_BAD_REQUEST)
            
        updated = db.update_student(student_id, data)
        if updated:
            return Response({"message": "Student updated successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to update student"}, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        deleted = db.delete_student(student_id)
        if deleted:
            return Response({"message": "Student deleted successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to delete student"}, status=status.HTTP_400_BAD_REQUEST)


# --- EXAMINATION MANAGEMENT ---

@api_view(['GET', 'POST'])
def exams_list_or_add(request):
    if request.method == 'GET':
        exams = db.get_all_exams()
        return Response(exams, status=status.HTTP_200_OK)
        
    elif request.method == 'POST':
        data = request.data
        if not data.get('exam_title'):
            return Response({"error": "Missing required field: exam_title"}, status=status.HTTP_400_BAD_REQUEST)
            
        if db.get_exam_by_title(data['exam_title']):
            return Response({"error": "An exam with this title already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            exam_id = db.add_exam(data)
            return Response({
                "message": "Exam created successfully",
                "exam_id": exam_id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
def exam_detail_update_delete(request, pk):
    try:
        exam_id = int(pk)
    except ValueError:
        return Response({"error": "Invalid Exam ID format"}, status=status.HTTP_400_BAD_REQUEST)
        
    exam = db.get_exam_by_id(exam_id)
    if not exam:
        return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        return Response(exam, status=status.HTTP_200_OK)
        
    elif request.method == 'PUT':
        data = request.data
        if not data.get('exam_title'):
            return Response({"error": "Missing required field: exam_title"}, status=status.HTTP_400_BAD_REQUEST)
            
        updated = db.update_exam(exam_id, data)
        if updated:
            return Response({"message": "Exam updated successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to update exam"}, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        deleted = db.delete_exam(exam_id)
        if deleted:
            return Response({"message": "Exam deleted successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to delete exam"}, status=status.HTTP_400_BAD_REQUEST)


# --- QUESTION MANAGEMENT ---

@api_view(['GET', 'POST'])
def questions_list_or_add(request):
    if request.method == 'GET':
        # Check if filtering by exam_title
        exam_title = request.query_params.get('exam_title')
        if exam_title:
            questions = db.get_questions_by_exam_title(exam_title)
        else:
            questions = db.get_all_questions()
        return Response(questions, status=status.HTTP_200_OK)
        
    elif request.method == 'POST':
        data = request.data
        required_fields = ['exam_title', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)
                
        try:
            question_id = db.add_question(data)
            return Response({
                "message": "Question added successfully",
                "question_id": question_id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
def question_detail_update_delete(request, pk):
    try:
        question_id = int(pk)
    except ValueError:
        return Response({"error": "Invalid Question ID format"}, status=status.HTTP_400_BAD_REQUEST)
        
    question = db.get_question_by_id(question_id)
    if not question:
        return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        return Response(question, status=status.HTTP_200_OK)
        
    elif request.method == 'PUT':
        data = request.data
        required_fields = ['exam_title', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)
                
        updated = db.update_question(question_id, data)
        if updated:
            return Response({"message": "Question updated successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to update question"}, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        deleted = db.delete_question(question_id)
        if deleted:
            return Response({"message": "Question deleted successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to delete question"}, status=status.HTTP_400_BAD_REQUEST)


# --- EXAM SUBMISSION MANAGEMENT ---

@api_view(['GET', 'POST'])
def submissions_list_or_add(request):
    if request.method == 'GET':
        subs = db.get_all_submissions()
        return Response(subs, status=status.HTTP_200_OK)
        
    elif request.method == 'POST':
        data = request.data.copy()
        if not data.get('student_name') or not data.get('exam_title'):
            return Response({"error": "Missing required fields (student_name, exam_title)"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Automatically set submitted_at if not present
        if not data.get('submitted_at'):
            data['submitted_at'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
        # Automatically calculate score & populate result table if not calculated
        score = data.get('score')
        exam_title = data['exam_title']
        student_name = data['student_name']
        
        # Load questions for this exam to compute total marks and verify score
        questions = db.get_questions_by_exam_title(exam_title)
        exam = db.get_exam_by_title(exam_title)
        
        total_marks = exam['total_marks'] if exam else sum(q['marks'] for q in questions)
        if not total_marks:
            total_marks = 100 # default
            
        if score is None:
            # Let's calculate the score from answers
            # Submitted answers format: "Q301:def,Q302:list" or "301:def,302:list" or "Q1:def,Q2:list"
            submitted_answers_str = data.get('submitted_answers', '')
            score = 0
            answers_dict = {}
            if submitted_answers_str:
                for pair in submitted_answers_str.split(','):
                    if ':' in pair:
                        q_key, val = pair.split(':', 1)
                        # clean q_key from Q1, Q301 to raw id
                        q_key_clean = q_key.replace('Q', '').strip()
                        answers_dict[q_key_clean] = val.strip()
            
            # Map questions
            for idx, q in enumerate(questions):
                q_id_str = str(q['question_id'])
                seq_key = str(idx + 1)
                
                # Check match against question_id or sequence index
                ans = answers_dict.get(q_id_str) or answers_dict.get(seq_key)
                if ans and ans.lower() == q['correct_answer'].lower():
                    score += q['marks']
            
            data['score'] = score
            
        try:
            submission_id = db.add_submission(data)
            
            # Auto create Result record too
            percentage = round((score / total_marks) * 100, 2) if total_marks > 0 else 0.0
            status_val = "Pass" if percentage >= 50.0 else "Fail"
            
            result_data = {
                "student_name": student_name,
                "exam_title": exam_title,
                "total_marks": total_marks,
                "obtained_marks": score,
                "percentage": percentage,
                "result_status": status_val
            }
            result_id = db.add_result(result_data)
            
            return Response({
                "message": "Submission received successfully",
                "submission_id": submission_id,
                "score": score,
                "result_id": result_id,
                "percentage": percentage,
                "result_status": status_val
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
def submission_detail_update_delete(request, pk):
    try:
        submission_id = int(pk)
    except ValueError:
        return Response({"error": "Invalid Submission ID format"}, status=status.HTTP_400_BAD_REQUEST)
        
    sub = db.get_submission_by_id(submission_id)
    if not sub:
        return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        return Response(sub, status=status.HTTP_200_OK)
        
    elif request.method == 'PUT':
        data = request.data
        if not data.get('student_name') or not data.get('exam_title'):
            return Response({"error": "Missing required fields (student_name, exam_title)"}, status=status.HTTP_400_BAD_REQUEST)
            
        updated = db.update_submission(submission_id, data)
        if updated:
            return Response({"message": "Submission updated successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to update submission"}, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        deleted = db.delete_submission(submission_id)
        if deleted:
            return Response({"message": "Submission deleted successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to delete submission"}, status=status.HTTP_400_BAD_REQUEST)


# --- RESULT MANAGEMENT ---

@api_view(['GET', 'POST'])
def results_list_or_add(request):
    if request.method == 'GET':
        results = db.get_all_results()
        
        # Filter by student_name or exam_title if queried
        student_name = request.query_params.get('student_name')
        exam_title = request.query_params.get('exam_title')
        
        if student_name and exam_title:
            results = [r for r in results if r['student_name'] == student_name and r['exam_title'] == exam_title]
        elif student_name:
            results = [r for r in results if r['student_name'] == student_name]
        elif exam_title:
            results = [r for r in results if r['exam_title'] == exam_title]
            
        return Response(results, status=status.HTTP_200_OK)
        
    elif request.method == 'POST':
        data = request.data
        required_fields = ['student_name', 'exam_title', 'total_marks', 'obtained_marks']
        for field in required_fields:
            if data.get(field) is None:
                return Response({"error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)
                
        # Calculate percentage & status if not sent
        total = int(data['total_marks'])
        obtained = int(data['obtained_marks'])
        percentage = data.get('percentage')
        if percentage is None:
            percentage = round((obtained / total) * 100, 2) if total > 0 else 0.0
            
        status_val = data.get('result_status')
        if not status_val:
            status_val = "Pass" if percentage >= 50.0 else "Fail"
            
        final_data = {
            "result_id": data.get('result_id'),
            "student_name": data['student_name'],
            "exam_title": data['exam_title'],
            "total_marks": total,
            "obtained_marks": obtained,
            "percentage": percentage,
            "result_status": status_val
        }
        
        try:
            result_id = db.add_result(final_data)
            return Response({
                "message": "Result recorded successfully",
                "result_id": result_id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
def result_detail_update_delete(request, pk):
    try:
        result_id = int(pk)
    except ValueError:
        return Response({"error": "Invalid Result ID format"}, status=status.HTTP_400_BAD_REQUEST)
        
    res = db.get_result_by_id(result_id)
    if not res:
        return Response({"error": "Result not found"}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        return Response(res, status=status.HTTP_200_OK)
        
    elif request.method == 'PUT':
        data = request.data
        required_fields = ['student_name', 'exam_title', 'total_marks', 'obtained_marks']
        for field in required_fields:
            if data.get(field) is None:
                return Response({"error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)
                
        updated = db.update_result(result_id, data)
        if updated:
            return Response({"message": "Result updated successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to update result"}, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        deleted = db.delete_result(result_id)
        if deleted:
            return Response({"message": "Result deleted successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to delete result"}, status=status.HTTP_400_BAD_REQUEST)
