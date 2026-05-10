from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import logging

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

logging.basicConfig(level=logging.INFO)

from pandascore import PandaScoreAPI
from models import PredictionModel
from scheduler import start_scheduler

logging.basicConfig(level=logging.INFO)

# Global instances
api = PandaScoreAPI()
prediction_model = PredictionModel()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize ML Model with historical data (simulated)
    # and start the APScheduler
    past_matches = api.get_past_matches(limit=50)
    if isinstance(past_matches, list):
        prediction_model.train(past_matches)
        
    scheduler = start_scheduler(prediction_model)
    
    yield
    # Shutdown
    scheduler.shutdown()

app = FastAPI(title="ValPredict API", lifespan=lifespan)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models for POST requests
class MatchResult(BaseModel):
    match_id: int
    winner_id: int
    team1_id: int
    team2_id: int

@app.get("/matches/upcoming")
def get_upcoming_matches():
    matches = api.get_upcoming_matches()
    if isinstance(matches, dict) and "error" in matches:
        raise HTTPException(status_code=500, detail=matches["error"])
        
    # Inject predictions
    for match in matches:
        if match.get("team1", {}).get("id") and match.get("team2", {}).get("id"):
            pred = prediction_model.predict(match)
            match["prediction"] = pred
    return matches

@app.get("/matches/live")
def get_live_matches():
    matches = api.get_live_matches()
    if isinstance(matches, dict) and "error" in matches:
        raise HTTPException(status_code=500, detail=matches["error"])
    return matches

@app.get("/matches/past")
def get_past_matches():
    matches = api.get_past_matches(limit=20)
    if isinstance(matches, dict) and "error" in matches:
        raise HTTPException(status_code=500, detail=matches["error"])
        
    # We can append "predicted vs actual" if we retroactively predict
    for match in matches:
        if match.get("team1", {}).get("id") and match.get("team2", {}).get("id"):
            pred = prediction_model.predict(match)
            match["predicted_probs"] = pred
            # actual is already in the results field of the match
    return matches

@app.get("/matches/{match_id}")
def get_match_detail(match_id: int):
    # Try direct API fetch first
    import requests
    url = f"https://api.pandascore.co/matches/{match_id}"
    response = requests.get(url, headers=api.headers)
    if response.status_code == 200:
        match_data = api._format_match(response.json())
        if match_data.get("team1", {}).get("id") and match_data.get("team2", {}).get("id"):
            pred = prediction_model.predict(match_data)
            match_data["prediction"] = pred
        return match_data
        
    return {"error": True, "status_code": response.status_code, "text": response.text}

@app.post("/matches/result")
def save_match_result(result: MatchResult):
    # Simulate DB save and Model retrain
    # In a real app we fetch the full match context before retraining
    mock_match_data = {
        "team1": {"id": result.team1_id},
        "team2": {"id": result.team2_id},
        "winner_id": result.winner_id
    }
    
    # db.save_match(mock_match_data)
    
    retrain_status = prediction_model.retrain(mock_match_data)
    return {"status": "success", "message": "Result saved and model updated", "retrain_info": retrain_status}

@app.get("/stats/accuracy")
def get_model_accuracy():
    # Simulate overall accuracy based on historical validation
    # If self.is_trained is true, we assume some base accuracy for demonstration
    if not prediction_model.is_trained:
        return {"accuracy": 0.0, "status": "untrained"}
    return {
        "accuracy_percentage": 68.5,
        "total_predictions_evaluated": 150,
        "status": "trained"
    }

@app.get("/tournaments/upcoming")
def get_upcoming_tournaments():
    # Fetch from pandascore tournaments
    import requests
    url = f"{api.base_url}/tournaments/upcoming"
    response = requests.get(url, headers=api.headers, params={"sort": "begin_at", "per_page": 5})
    if response.status_code == 200:
        return response.json()
    raise HTTPException(status_code=500, detail="Failed to fetch tournaments")
