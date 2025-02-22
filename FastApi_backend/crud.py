from sqlalchemy.orm import Session
import models, schemas
from models import User

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")




# def get_user_by_username(db: Session, username: str):
#     return db.query(models.User).filter(models.User.username == username).first()

# def create_user(db: Session, user: schemas.UserCreate):
#     hashed_password = pwd_context.hash(user.password)
#     db_user = User(username=user.username, email=user.email, password=hashed_password)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user
