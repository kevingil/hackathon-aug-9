
from typing import List, Optional, Dict, Literal, Union
from pydantic import BaseModel # type: ignore


# === COMMON TYPES ===

class PriceMovement(BaseModel):
    movement: Optional[Literal["Up", "Down", "Neutral"]]
    percentage: Optional[float]
    value: Optional[float]


class MarketResult(BaseModel):
    type: Literal["market"] = "market"
    name: Optional[str]
    link: Optional[str]
    stock: Optional[str]
    price: Optional[float]
    price_movement: Optional[PriceMovement]
    serpapi_link: Optional[str]
    region: Optional[str] = None  # for flattened use


class OrganicResult(BaseModel):
    type: Literal["organic"] = "organic"
    title: Optional[str]
    link: Optional[str]
    displayed_link: Optional[str]
    snippet: Optional[str]
    source: Optional[str]
    date: Optional[str]
    favicon: Optional[str]
    position: Optional[int]
    redirect_link: Optional[str]


class ForumAnswer(BaseModel):
    link: Optional[str]
    snippet: Optional[str]
    extensions: Optional[List[str]] = None


class ForumResult(BaseModel):
    type: Literal["forum"] = "forum"
    title: Optional[str]
    link: Optional[str]
    source: Optional[str]
    date: Optional[str]
    extensions: List[str]
    answers: List[ForumAnswer]



class AIPreviewResult(BaseModel):
    type: Literal["ai_overview"] = "ai_overview"


class SearchResults(BaseModel):
    ai_overview: Optional[AIPreviewResult]
    organic_results: Optional[List[OrganicResult]]
    discussions_and_forums: Optional[List[ForumResult]]
    markets: Optional[Dict[str, List[MarketResult]]]  # e.g., {"asia": [...], "us": [...]}


class UnifiedSearchResponse(BaseModel):
    search_results: SearchResults
