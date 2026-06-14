from fastapi import APIRouter, HTTPException

from models.user_model import Users,UserLogin
from config.connection import user_collection
from passlib.context import CryptContext

from fastapi_login.exceptions import InvalidCredentialsException
from config.auth import manager
from pydantic import EmailStr


router = APIRouter()

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# End points

# Get Users
@router.get("/users")
async def get_users():
    users = await user_collection.find().to_list(length=10)
    for user in users:
        user["_id"] = str(user["_id"])
    return users

# Create Users
@router.post("/users")
async def signup(user: Users):
    
    existing_user = await user_collection.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing_user:
        if existing_user.get("username") == user.username:
            raise HTTPException(status_code=400, detail="Username already exists!")
        if existing_user.get("email") == user.email:
            raise HTTPException(status_code=400, detail="Email already exists!")

    # Hash the password and store user data
    hashed_password = pwd_context.hash(user.password)
    user_data = {"username": user.username, "email": user.email, "password": hashed_password}
    result = await user_collection.insert_one(user_data)
    
    if result.inserted_id:
        return {"message": "Signup successful","username": user.username}
    else:
        raise HTTPException(status_code=500, detail="Failed to signup")

@manager.user_loader
async def load_user(email: EmailStr):
    user = await user_collection.find_one({"email": email})
    return user

# Authentication
@router.post("/users/login")
async def login(user: UserLogin):
    existing_user = await user_collection.find_one({"email": user.email})
    if not existing_user:
        raise InvalidCredentialsException

    # Verify the password
    if not pwd_context.verify(user.password, existing_user["password"]):
        raise InvalidCredentialsException
        
    
    access_token = manager.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}



