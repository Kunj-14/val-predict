const API_BASE = import.meta.env.VITE_API_URL || "https://val-predict.onrender.com";

export const getUpcomingMatches = async () => {
    try {
        const response = await fetch(`${API_BASE}/matches/upcoming`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching upcoming matches:", error);
        return [];
    }
};

export const getTournaments = async () => {
    try {
        const response = await fetch(`${API_BASE}/tournaments/upcoming`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching tournaments:", error);
        return [];
    }
};

export const getLiveMatches = async () => {
    try {
        const response = await fetch(`${API_BASE}/matches/live`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching live matches:", error);
        return [];
    }
};

export const getPastMatches = async () => {
    try {
        const response = await fetch(`${API_BASE}/matches/past`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching past matches:", error);
        return [];
    }
};

export const getMatchDetail = async (matchId) => {
    try {
        const response = await fetch(`${API_BASE}/matches/${matchId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching match detail:", error);
        return null;
    }
};

export const getAccuracyStats = async () => {
    try {
        const response = await fetch(`${API_BASE}/stats/accuracy`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching accuracy stats:", error);
        return null;
    }
};
