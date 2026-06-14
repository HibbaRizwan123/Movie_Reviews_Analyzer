from pydantic import BaseModel,EmailStr

class Users(BaseModel):
    username: str
    email: EmailStr #This type is specifically designed for email validation and ensures that the email address follows a valid format.
    password: str
   
class UserLogin(BaseModel):
    email: EmailStr
    password: str 
    
    