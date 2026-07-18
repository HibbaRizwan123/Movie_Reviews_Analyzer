from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from dotenv import load_dotenv
import os

load_dotenv()

URI = os.environ["URI"]


# Motor is a library in Python that helps you work with MongoDB databases asynchronously.
client = AsyncIOMotorClient(URI)
db = client["Sentiment_Analyzer"]
user_collection = db["users"]

# Send a ping to confirm a successful connection
async def test_connection():
    try:
        # Send a ping to confirm a successful connection
        await client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)

