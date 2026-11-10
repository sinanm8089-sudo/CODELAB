import pytest
from fastapi.testclient import TestClient
from apps.api.app.main import app
from apps.api.app.config import settings

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["product"] in ["CODELAB IDE", "CODEVERSE LAB"]
    assert data["developer"] == "Sinan Mohammed"

def test_algorithms_multi_language():
    response = client.get("/api/algorithms")
    assert response.status_code == 200
    algos = response.json()
    assert len(algos) >= 10
    
    expected_langs = ["python", "javascript", "typescript", "c", "cpp", "java", "csharp", "go", "rust"]
    for algo in algos:
        for lang in expected_langs:
            assert lang in algo["code_implementations"], f"Missing {lang} in {algo['id']}"
            assert len(algo["code_implementations"][lang]) > 20, f"Code for {lang} in {algo['id']} is empty"

def test_registration_and_login():
    email = f"teststudent_{pytest.approx(0, abs=100000)}@codeverse.edu"
    reg_payload = {
        "name": "Sinan Test Student",
        "email": "sinan.student@codeverse.edu",
        "password": "Password123!"
    }
    # Clean previous run if exists
    login_resp = client.post("/api/auth/login", json={"email": reg_payload["email"], "password": reg_payload["password"]})
    if login_resp.status_code != 200:
        reg_resp = client.post("/api/auth/register", json=reg_payload)
        assert reg_resp.status_code == 200
        data = reg_resp.json()
        assert "access_token" in data
        assert data["user"]["student_id"].startswith("STU-")
        assert data["user"]["email"] == reg_payload["email"]
    else:
        data = login_resp.json()
        assert "access_token" in data
        assert data["user"]["student_id"].startswith("STU-")

def test_execution_python_code():
    # Login to get token
    login_resp = client.post("/api/auth/login", json={"email": "sinan.student@codeverse.edu", "password": "Password123!"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    exec_payload = {
        "language": "python",
        "source_code": "a = 25\nb = 17\nprint('SUM:', a + b)",
        "stdin": ""
    }
    res = client.post("/api/execution/run", json=exec_payload, headers=headers)
    assert res.status_code == 200
    out = res.json()
    assert out["status"] == "success"
    assert "SUM: 42" in out["stdout"]
    assert out["execution_time_ms"] > 0

def test_execution_syntax_error_diagnostics():
    login_resp = client.post("/api/auth/login", json={"email": "sinan.student@codeverse.edu", "password": "Password123!"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    exec_payload = {
        "language": "python",
        "source_code": "def broken(\n    print('Missing paren')",
        "stdin": ""
    }
    res = client.post("/api/execution/run", json=exec_payload, headers=headers)
    assert res.status_code == 200
    out = res.json()
    assert out["status"] == "error"
    assert out["error_details"] is not None
    assert out["error_details"]["error_type"] == "Syntax Error"

def test_visual_debugger_tracer():
    login_resp = client.post("/api/auth/login", json={"email": "sinan.student@codeverse.edu", "password": "Password123!"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    debug_payload = {
        "language": "python",
        "source_code": "x = 10\ny = 20\nsum_val = x + y\nprint(sum_val)"
    }
    res = client.post("/api/execution/debug", json=debug_payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["total_steps"] >= 3
    # Verify variable capture
    last_step = data["steps"][-1]
    assert "sum_val" in last_step["variables"]
    assert last_step["variables"]["sum_val"] == "30"

def test_lessons_and_quiz():
    login_resp = client.post("/api/auth/login", json={"email": "sinan.student@codeverse.edu", "password": "Password123!"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List lessons
    res = client.get("/api/learning/lessons", headers=headers)
    assert res.status_code == 200
    lessons = res.json()
    assert len(lessons) >= 20

    # Get lesson 1
    l1 = client.get(f"/api/learning/lessons/{lessons[0]['id']}", headers=headers).json()
    assert l1["title"] == "Introduction to Programming"
    assert "recipe" in l1["analogy"].lower()

    # Submit quiz
    quiz_res = client.post(
        f"/api/learning/lessons/{lessons[0]['id']}/quiz",
        json={"selected_index": 0},
        headers=headers
    )
    assert quiz_res.status_code == 200
    q_data = quiz_res.json()
    assert q_data["correct"] is True
    assert q_data["lesson_completed"] is True

def test_practice_problem_submission():
    login_resp = client.post("/api/auth/login", json={"email": "sinan.student@codeverse.edu", "password": "Password123!"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List problems
    problems = client.get("/api/practice/problems", headers=headers).json()
    assert len(problems) > 0
    p1 = problems[0]

    # Submit correct solution
    sub_payload = {
        "language": "python",
        "source_code": "import sys\ndata = sys.stdin.read().split()\nif data:\n    print(int(data[0]) + int(data[1]))\n"
    }
    sub_res = client.post(f"/api/practice/problems/{p1['id']}/submit", json=sub_payload, headers=headers)
    assert sub_res.status_code == 200
    res_data = sub_res.json()
    assert res_data["status"] == "passed"
    assert res_data["passed_count"] == res_data["total_count"]
    assert res_data["score"] == 100.0

def test_analytics_overview():
    login_resp = client.post("/api/auth/login", json={"email": "sinan.student@codeverse.edu", "password": "Password123!"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/analytics/overview", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["student_name"] == "Sinan Test Student"
    assert data["student_id"].startswith("STU-")
    assert data["programs_executed_count"] >= 1
    assert data["lessons_completed_count"] >= 1
    assert data["problems_solved_count"] >= 1
    assert "python" in data["language_breakdown"]

def test_ai_endpoints():
    # 1. AI status check
    status_res = client.get("/api/ai/status")
    assert status_res.status_code == 200
    st_data = status_res.json()
    assert st_data["status"] == "online"
    assert st_data["engine"] == "CODELAB AI Code Intelligence"

    # 2. AI Tutor
    tutor_res = client.post(
        "/api/ai/tutor",
        json={
            "messages": [{"role": "user", "content": "What is a variable?"}],
            "language": "python",
            "mode": "simple"
        }
    )
    assert tutor_res.status_code == 200
    tut_data = tutor_res.json()
    assert tut_data["model"] == "CODELAB AI Intelligence"
    assert len(tut_data["response"]) > 10

    # 3. AI Explain Code
    explain_res = client.post(
        "/api/ai/explain-code",
        json={
            "language": "python",
            "source_code": "x = [i * 2 for i in range(5)]",
            "mode": "line_by_line"
        }
    )
    assert explain_res.status_code == 200
    exp_data = explain_res.json()
    assert exp_data["model"] == "CODELAB AI Intelligence"
    assert "explanation" in exp_data or "high_level_purpose" in exp_data

    # 4. AI Explain Error
    err_res = client.post(
        "/api/ai/explain-error",
        json={
            "language": "python",
            "source_code": "print(y)",
            "stderr": "NameError: name 'y' is not defined"
        }
    )
    assert err_res.status_code == 200
    err_data = err_res.json()
    assert err_data["model"] == "CODELAB AI Intelligence"
    assert "meaning" in err_data

    # 5. Generic Chat (Provider Neutral)
    chat_res = client.post(
        "/api/ai/chat",
        json={
            "message": "Hello, how does binary search work?",
            "language": "python"
        }
    )
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert chat_data["model"] == "CODELAB AI Intelligence"
    assert "response" in chat_data

    # 6. Generate Code
    gen_res = client.post(
        "/api/ai/generate",
        json={
            "prompt": "Create a linked list node class in python",
            "language": "python"
        }
    )
    assert gen_res.status_code == 200
    gen_data = gen_res.json()
    assert gen_data["model"] == "CODELAB AI Intelligence"
    assert "generated_code" in gen_data


