from sqlalchemy import Column, Integer, String, Boolean, Float

from database import Base
from database import engine



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True)
    email = Column(String(100), unique=True, index=True, nullable=True)
    contact = Column(String(100), nullable=False)
    address = Column(String(100), nullable=False)
    password = Column(String(100), nullable=False)
    


User.metadata.create_all(bind=engine)

def __repr__(self):
    return f"User(username={self.username}, email={self.email}, contact={self.contact}, address={self.address})"
