from fastapi import FastAPI, Path, Query, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from starlette import status



app = FastAPI()


class Book(BaseModel):
    id: Optional[int] = None
    title: str = Field(..., min_length=3)
    author: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1, max_length=200)
    rating: int = Field(..., ge=0, le=25)
    published_year: int = Field(..., ge=1900, le=2100)


BOOKS: List[Book] = [
   Book(id=1, title="Computer Science", author="Coding with Me",
         description="A very Nice Book", rating=8, published_year=2018),

    Book(id=2, title="Data Science", author="Python for Pros",
         description="Master data analysis", rating=12, published_year=2019),

    Book(id=3, title="Artificial Intelligence", author="Neural Networks 101",
         description="Deep learning basics", rating=15, published_year=2020),

    Book(id=4, title="Cybersecurity", author="The Ethical Hacker",
         description="Protecting digital assets", rating=9, published_year=2017),

    Book(id=5, title="Web Development", author="React Mastery",
         description="Build modern web apps", rating=11, published_year=2021),

    Book(id=6, title="Physics", author="Quantum Realms",
         description="Understanding the subatomic", rating=7, published_year=2016),

    Book(id=7, title="Graphic Design", author="The Power of Color",
         description="Visual theory for artists", rating=14, published_year=2018),

    Book(id=8, title="Astronomy", author="Beyond the Stars",
         description="A guide to the galaxy", rating=20, published_year=2022),

    Book(id=9, title="Software Engineering", author="Clean Code Ethics",
         description="Writing maintainable logic", rating=18, published_year=2020),

    Book(id=10, title="History", author="The Digital Age",
         description="Evolution of computing", rating=5, published_year=2015),

    Book(id=11, title="Mathematics", author="The Logic of Prime",
         description="Deep dive into numbers", rating=22, published_year=2014),
]


@app.get("/all-books" , status_code=status.HTTP_200_OK)
def get_all_books():
    return BOOKS


@app.post("/create-book", status_code=201)
def create_book(book: Book):
    book.id = BOOKS[-1].id + 1 if BOOKS else 1
    BOOKS.append(book)
    return book


@app.get("/book/{book_id}")
def find_book(book_id: int = Path(gt=0)):
    for book in BOOKS:
        if book.id == book_id:
            return book
    raise HTTPException(status_code=404, detail="Book not found")


@app.get("/books-by-rating")
def read_books_by_rating(book_rating: int = Query(ge=0, le=25)):
    return [book for book in BOOKS if book.rating == book_rating]


@app.get("/books-by-date")
def read_books_by_date(book_date: int = Query(ge=1900, le=2100)):
    return [book for book in BOOKS if book.published_year == book_date]


@app.put("/update_book", status_code=status.HTTP_200_OK)
def update_book(book: Book):
    for index, existing_book in enumerate(BOOKS):
        if existing_book.id == book.id:
            BOOKS[index] = book
            return book
    raise HTTPException(status_code=404, detail="Book not found")


@app.delete("/delete_book/{book_id}")
def delete_book(book_id: int = Path(gt=0)):
    for i, book in enumerate(BOOKS):
        if book.id == book_id:
            BOOKS.pop(i)
            return {"message": "Book deleted successfully"}
    raise HTTPException(status_code=404, detail="Book not found")
