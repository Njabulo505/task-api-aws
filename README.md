# Cloud Task Management API

A production-style backend API built using FastAPI, deployed on AWS EC2, and connected to a managed PostgreSQL database on AWS RDS.

---

## Features

- User registration and login (JWT authentication)
- Create, read, update, delete tasks
- PostgreSQL database (AWS RDS)
- Deployed on AWS EC2
- Interactive API documentation (Swagger UI)

---

##  Architecture

Client → FastAPI (EC2) → PostgreSQL (RDS)

---

##  Tech Stack

- Python (FastAPI)
- SQLAlchemy (ORM)
- PostgreSQL
- AWS EC2
- AWS RDS
- JWT Authentication

---

##  Live API

http://16.171.0.204:8000/docs

---

##  Local Setup

```bash
git clone https://github.com/Njabulo505/task-api-aws.git
cd task-api-aws
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload