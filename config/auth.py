from fastapi_login import LoginManager
from dotenv import load_dotenv
import os

load_dotenv()
SECRET = os.environ["SECRET"]
manager = LoginManager(SECRET, token_url="users/login")
