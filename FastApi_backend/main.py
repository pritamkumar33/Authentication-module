from fastapi import FastAPI, Depends, HTTPException, Form, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text
import models, schemas, database
from fastapi.responses import FileResponse, JSONResponse
from passlib.context import CryptContext
from datetime import timedelta, datetime
from jose import JWTError, jwt
import logging
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from database import get_db, engine, SessionLocal
from crud import pwd_context
from pydantic import BaseModel
from models import User



logging.basicConfig(level=logging.DEBUG)



load_dotenv()

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

Origins = ["http://localhost:3000","http://192.168.31.7:3000"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=Origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
        
        
class UserCreate(BaseModel):
    username: str
    password: str
    email: str 
    contact: str
    address: str       

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()        

def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, email=user.email, contact=user.contact, address=user.address, password=hashed_password)
    db.add(db_user)
    db.commit()
    return "complete"
        
        
# def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     credentials_exception = HTTPException(
#         status_code=401,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#         user = crud.get_user_by_username(db, username=username)
#         if user is None:
#             raise credentials_exception
#     except jwt.PyJWTError:
#         raise credentials_exception
#     return user        

# # Security

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")





# @app.get("/users/me")
# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     return verify_token(token)


@app.get("/users/me")
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    username = payload.get("sub")

    if username is None:
        raise HTTPException(status_code=400, detail="Invalid authentication token")

    # Fetch the user details from the database
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "contact": user.contact,
        "address": user.address
    }



@app.options("/token")
async def preflight_token():
    return JSONResponse(content={"message": "CORS preflight passed"}, status_code=200)

# Routes
# @app.post("/token")
# def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = crud.get_user_by_username(db,form_data.username)
#     if user and pwd_context.verify(form_data.password, user.password):
#         access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#         access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
#         return {"access_token": access_token, "token_type": "bearer"}
#     raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Token is invalid or expired")
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid or expired")

@app.get("/verify-token/{token}")
async def verify_user_token(token: str):
    verify_token(token=token)
    return {"message": "Token is valid"}


@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return create_user(db=db, user=user)

print(dir(models)) 

def authenticate_user(username: str, password: str, db: Session):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not pwd_context.verify(password, user.password):
        return False
    return user



# @app.get("/users/me", response_model=schemas.User)
# def read_users_me(current_user: models.User = Depends(get_current_user)):
#     return current_user

# def create_access_token(data: dict, expires_delta: timedelta = None):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Token is invalid or expired")
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid or expired")

@app.get("/verify-token/{token}")
async def verify_user_token(token: str):
    verify_token(token=token)
    return {"message": "Token is valid"}



@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("favicon.ico")

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}


@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))  
        return {"status": "Connected to MySQL"}
    except Exception as e:
        return {"status": "Database connection failed", "error": str(e)}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logging.error(f"❌ Exception occurred: {exc}")
    return JSONResponse(status_code=500, content={"error": "Internal Server Error"})







