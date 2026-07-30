from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Configure CORS to allow frontend requests
origins = [
    "http://localhost",
    "http://localhost:3000", # Frontend port
    "http://localhost:8000"  # Backend port if serving frontend from here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# --- Movie Data (In-memory 'database') ---
movies_db = [
    {
        "id": 1,
        "title": "How to Train Your Dragon",
        "description": "A young Viking who defies tradition befriends a fearsome dragon, leading to an adventure that changes their world.",
        "imageUrl": "https://images.pexels.com/photos/23789/pexels-photo.jpg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" # Image 7 - Man with beard, fits adventure/fantasy
    },
    {
        "id": 2,
        "title": "Avatar",
        "description": "A paraplegic marine dispatched to the moon Pandora on a unique mission becomes torn between following orders and protecting the world he feels is his home.",
        "imageUrl": "https://images.pexels.com/photos/28173991/pexels-photo-28173991.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" # Image 2 - Abstract blue/purple for sci-fi
    },
    {
        "id": 3,
        "title": "Interstellar",
        "description": "A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
        "imageUrl": "https://images.pexels.com/photos/7886856/pexels-photo-7886856.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" # Image 6 - Space/stars for sci-fi
    },
    {
        "id": 4,
        "title": "The Dark Knight",
        "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        "imageUrl": "https://images.pexels.com/photos/30570301/pexels-photo-30570301.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" # Image 8 - Dark, dramatic clouds for a 'dark' theme
    }
]

@app.get("/api/movies")
async def get_movies():
    """Returns a list of available movies."""
    return movies_db

# --- Contact Form Endpoint ---
class ContactForm(BaseModel):
    name: str
    email: str
    message: str

@app.post("/api/contact")
async def submit_contact(form_data: ContactForm):
    """Receives and processes contact form submissions."""
    print(f"Received contact form submission:\nName: {form_data.name}\nEmail: {form_data.email}\nMessage: {form_data.message}")
    # In a real application, you would save this to a database, send an email, etc.
    return {"message": "Thank you for your message! We'll get back to you soon."}

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Prime Movies API!"}
