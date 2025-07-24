import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
import tweepy
from textblob import TextBlob

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

TWITTER_BEARER_TOKEN = os.getenv('TWITTER_BEARER_TOKEN')

# Tweepy v2 Client authentication
client = tweepy.Client(bearer_token=TWITTER_BEARER_TOKEN)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    query: str
    count: int = 10  # default number of tweets (max 100 for free tier)

class TweetSentiment(BaseModel):
    text: str
    sentiment: str

@app.get("/")
def read_root():
    return {"message": "Twitter Sentiment Analysis API is running!"}

@app.post("/analyze/", response_model=List[TweetSentiment])
def analyze_tweets(request: AnalyzeRequest):
    try:
        # Twitter API v2: max_results must be between 10 and 100
        max_results = min(max(request.count, 10), 100)
        response = client.search_recent_tweets(query=request.query, max_results=max_results, tweet_fields=["text", "lang"])
        tweets = response.data if response.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tweets: {str(e)}")

    results = []
    for tweet in tweets:
        text = tweet.text
        analysis = TextBlob(text)
        polarity = analysis.sentiment.polarity
        if polarity > 0.05:
            sentiment = "positive"
        elif polarity < -0.05:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        results.append(TweetSentiment(text=text, sentiment=sentiment))
    return results 