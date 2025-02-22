from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pymysql

from dotenv import load_dotenv
import os


load_dotenv()

DATABASE_URL = "mysql+pymysql://root:Pritam%401234@localhost:3306/auth_project"


try:
    engine = create_engine(DATABASE_URL)
    connection  = engine.connect()
    print("SuccessFully Connected to MySql Database")
    connection.close
except Exception as e:
    print(f"Database connection failed: {e}")    
    


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

Base.metadata.create_all(engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()