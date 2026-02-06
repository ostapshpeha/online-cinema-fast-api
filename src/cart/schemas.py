from pydantic import BaseModel
from datetime import datetime
from typing import List

from src.movies.schemas import GenreRead


class CartItemRead(BaseModel):
    movie_title: str
    movie_price: float
    movie_genre: GenreRead
    release_year: int


class CartRead(BaseModel):
    id: int
    user_id: str
    items: List[CartItemRead]
    total_price: float


class CartItemCreate(BaseModel):
    movie_id: int

class MessageSchema(BaseModel):
    message: str