# from pydantic import BaseModel
# from typing import Optional

# class UserBase(BaseModel):
#     username: str
#     email: Optional[str] = None

# class UserCreate(UserBase):
#     password: str

# class User(UserBase):
#     id: int

#     class Config:
#         orm_mode = True

# class Login(BaseModel):
#     username: str
#     password: str
