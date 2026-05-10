import os
import requests
from datetime import datetime, timezone, timedelta

class PandaScoreAPI:
    def __init__(self):
        self.api_key = os.getenv("PANDASCORE_API_KEY")
        self.base_url = "https://api.pandascore.co/valorant"
        self.headers = {"Authorization": f"Bearer {self.api_key}"}

    def _convert_to_ist(self, utc_time_str):
        if not utc_time_str:
            return None
        try:
            # Parse ISO 8601 string, replacing Z with +00:00 for python fromisoformat
            utc_time_str = utc_time_str.replace("Z", "+00:00")
            utc_dt = datetime.fromisoformat(utc_time_str)
            # Convert to IST (UTC +5:30)
            ist_dt = utc_dt.astimezone(timezone(timedelta(hours=5, minutes=30)))
            return ist_dt.strftime("%Y-%m-%d %I:%M %p IST")
        except ValueError:
            return utc_time_str

    def _format_match(self, match):
        """Helper to format match data cleanly"""
        teams = match.get("opponents", [])
        team1 = teams[0]["opponent"] if len(teams) > 0 else {}
        team2 = teams[1]["opponent"] if len(teams) > 1 else {}
        
        return {
            "id": match.get("id"),
            "name": match.get("name"),
            "status": match.get("status"),
            "scheduled_time_ist": self._convert_to_ist(match.get("begin_at")),
            "tournament": match.get("league", {}).get("name", "Unknown League") + " " + match.get("serie", {}).get("full_name", ""),
            "match_type": f"BO{match.get('number_of_games')}" if match.get("number_of_games") else "Unknown",
            "team1": {
                "id": team1.get("id"),
                "name": team1.get("name"),
                "logo": team1.get("image_url")
            },
            "team2": {
                "id": team2.get("id"),
                "name": team2.get("name"),
                "logo": team2.get("image_url")
            },
            "results": match.get("results", [])
        }

    def get_upcoming_matches(self):
        url = f"{self.base_url}/matches/upcoming"
        response = requests.get(url, headers=self.headers, params={"sort": "begin_at"})
        if response.status_code == 200:
            matches = response.json()
            return [self._format_match(m) for m in matches]
        return {"error": f"Failed to fetch: {response.status_code}"}

    def get_live_matches(self):
        url = f"{self.base_url}/matches/running"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            matches = response.json()
            return [self._format_match(m) for m in matches]
        return {"error": f"Failed to fetch: {response.status_code}"}

    def get_past_matches(self, limit=20):
        url = f"{self.base_url}/matches/past"
        # Fetch recent past matches globally
        response = requests.get(url, headers=self.headers, params={"per_page": limit, "sort": "-begin_at"})
        if response.status_code == 200:
            matches = response.json()
            return [self._format_match(m) for m in matches]
        return {"error": f"Failed to fetch: {response.status_code}"}

    def get_team_stats(self, team_id):
        # To get team stats, we can fetch the team's past matches
        url = f"https://api.pandascore.co/teams/{team_id}/matches"
        response = requests.get(url, headers=self.headers, params={"per_page": 20, "sort": "-begin_at"})
        
        if response.status_code != 200:
            return {"error": f"Failed to fetch team matches: {response.status_code}"}
            
        matches = response.json()
        total_matches = len(matches)
        wins = 0
        map_stats = {}

        for match in matches:
            # Determine if this team won the match
            team_won = False
            winner_id = match.get("winner_id")
            if winner_id == int(team_id):
                wins += 1
                team_won = True
                
            # Basic map stats extraction
            games = match.get("games", [])
            for game in games:
                # Pandascore stores map details in different ways based on the game,
                # for Valorant it might be in game.position or game.map if available
                map_info = game.get("map")
                if map_info and isinstance(map_info, dict):
                    map_name = map_info.get("name", "Unknown")
                    if map_name not in map_stats:
                        map_stats[map_name] = {"played": 0, "wins": 0}
                    
                    map_stats[map_name]["played"] += 1
                    if game.get("winner", {}).get("id") == int(team_id):
                        map_stats[map_name]["wins"] += 1

        win_rate = (wins / total_matches * 100) if total_matches > 0 else 0
        
        # Calculate win rates per map
        for m_name, stats in map_stats.items():
            stats["win_rate"] = (stats["wins"] / stats["played"] * 100) if stats["played"] > 0 else 0

        return {
            "team_id": team_id,
            "total_matches": total_matches,
            "wins": wins,
            "win_rate_percentage": round(win_rate, 2),
            "map_stats": map_stats,
            "recent_matches": [self._format_match(m) for m in matches]
        }
