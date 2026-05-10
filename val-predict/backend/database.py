import os
import logging
from supabase import create_client, Client

logger = logging.getLogger(__name__)

"""
--- SQL Schema (Run this in Supabase SQL Editor) ---

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    match_id INT UNIQUE NOT NULL,
    team1_name TEXT,
    team2_name TEXT,
    team1_logo TEXT,
    team2_logo TEXT,
    team1_tag TEXT,
    team2_tag TEXT,
    tournament_name TEXT,
    match_type TEXT,
    scheduled_time TIMESTAMPTZ,
    predicted_winner TEXT,
    team1_win_prob FLOAT,
    team2_win_prob FLOAT,
    confidence TEXT,
    prediction_reason TEXT,
    status TEXT
);

CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    match_id INT UNIQUE REFERENCES matches(match_id),
    actual_winner TEXT,
    team1_score INT,
    team2_score INT,
    prediction_correct BOOLEAN,
    finished_at TIMESTAMPTZ
);

CREATE TABLE tournaments (
    id SERIAL PRIMARY KEY,
    tournament_id INT UNIQUE NOT NULL,
    name TEXT,
    location TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    logo_url TEXT
);
"""

class Database:
    def __init__(self):
        url: str = os.getenv("SUPABASE_URL", "")
        key: str = os.getenv("SUPABASE_KEY", "")
        if url and key:
            self.supabase: Client = create_client(url, key)
        else:
            self.supabase = None
            logger.warning("Supabase credentials not found. Database operations will be mocked.")

    def save_match(self, match_data: dict):
        if not self.supabase:
            return {"status": "mock", "data": match_data}
        try:
            response = self.supabase.table("matches").upsert(match_data, on_conflict="match_id").execute()
            return response.data
        except Exception as e:
            logger.error(f"Failed to save match: {e}")
            return None

    def save_result(self, result_data: dict):
        if not self.supabase:
            return {"status": "mock", "data": result_data}
        try:
            response = self.supabase.table("results").upsert(result_data, on_conflict="match_id").execute()
            return response.data
        except Exception as e:
            logger.error(f"Failed to save result: {e}")
            return None

    def get_accuracy(self):
        if not self.supabase:
            return 0.0
        try:
            response = self.supabase.table("results").select("prediction_correct").execute()
            results = response.data
            if not results:
                return 0.0
            
            correct = sum(1 for r in results if r.get("prediction_correct"))
            return (correct / len(results)) * 100.0
        except Exception as e:
            logger.error(f"Failed to calculate accuracy: {e}")
            return 0.0

    def save_tournament(self, tournament_data: dict):
        if not self.supabase:
            return {"status": "mock", "data": tournament_data}
        try:
            response = self.supabase.table("tournaments").upsert(tournament_data, on_conflict="tournament_id").execute()
            return response.data
        except Exception as e:
            logger.error(f"Failed to save tournament: {e}")
            return None

    def get_upcoming_tournaments(self):
        if not self.supabase:
            return []
        try:
            # Assuming we want to fetch tournaments that are not in the past
            # For this MVP we just fetch all and return
            response = self.supabase.table("tournaments").select("*").execute()
            return response.data
        except Exception as e:
            logger.error(f"Failed to get tournaments: {e}")
            return []
