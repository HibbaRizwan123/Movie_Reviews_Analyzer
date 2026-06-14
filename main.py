from fastapi import FastAPI
from routes.users import router
from config.connection import test_connection
from fastapi.middleware.cors import CORSMiddleware
from routes.analysis import analysis_router



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Run the test connection function to ensure MongoDB is reachable
    await test_connection()
@app.get('/')
def root():
    return 'Welcome'




app.include_router(router)
app.include_router(analysis_router)

