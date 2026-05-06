from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import engine, SessionLocal
from auth import hash_password, verify_password, create_access_token, verify_token


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREATE
@app.post("/tasks/", response_model=schemas.TaskResponse)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    username=Depends(verify_token)
):
    user = db.query(models.User).filter(models.User.username == username).first()

    db_task = models.Task(
        title=task.title,
        description=task.description,
        user_id=user.id   # 👈 assign owner
    )

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task

@app.post ("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_pw = hash_password(user.password)
    db_user =models.User (username=user.username, password=hashed_pw)

    db.add(db_user)
    db.commit()

    return {"message": "User created"}

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token ({"sub": db_user.username})
    return {"access_token": token}

# READ ALL
@app.get("/tasks/", response_model=list[schemas.TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    username=Depends(verify_token)
):
    user = db.query(models.User).filter(models.User.username == username).first()

    return db.query(models.Task).filter(models.Task.user_id == user.id).all()

# UPDATE
@app.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    username=Depends(verify_token)
):
    user = db.query(models.User).filter(models.User.username == username).first()

    db_task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == user.id
    ).first()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_task.title = task.title
    db_task.description = task.description

    db.commit()
    db.refresh(db_task)

    return db_task

# DELETE
@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    username=Depends(verify_token)
):
    user = db.query(models.User).filter(models.User.username == username).first()

    db_task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == user.id
    ).first()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(db_task)
    db.commit()

    return {"message": "Task deleted"}

@app.get("/")
def root():
    return {"message": "Task API is running"}
