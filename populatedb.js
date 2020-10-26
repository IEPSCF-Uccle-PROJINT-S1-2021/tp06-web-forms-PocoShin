#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database."
);

const { sequelize, Author, Book, BookInstance, Genre } = require("./models/sequelize");

var authors = [];
var genres = [];
var books = [];
var bookinstances = [];

async function authorCreate(first_name, family_name, d_birth, d_death) {
  authordetail = { first_name: first_name, family_name: family_name };
  if (d_birth != false) authordetail.date_of_birth = d_birth;
  if (d_death != false) authordetail.date_of_death = d_death;

  var author = await Author.create(authordetail);

  console.log("New Author: " + author.id);
  authors.push(author);
  return author;
}

async function genreCreate(name) {
  var genre = await Genre.create({ name: name });

  console.log("New Genre: " + genre.id);
  genres.push(genre);
  return genre;
}

async function bookCreate(title, summary, isbn, author, genres) {
  try {
    bookdetail = {
      title: title,
      summary: summary,
      isbn: isbn,
    };

    const book = await Book.create(bookdetail);
    await book.setAuthor(author);
    if (genres != false) {
      for (let i = 0; i < genres.length; i++) {
        const genre = genres[i];
        await book.addGenre(genre);
      }
    }
    console.log("New Book: " + book.id);
    books.push(book);
    return book;
  } catch (err) {
    console.log(err);
  }
}

async function bookInstanceCreate(book, imprint, due_back, status) {
  bookinstancedetail = {
    imprint: imprint,
  };
  if (due_back != false) bookinstancedetail.due_back = due_back;
  if (status != false) bookinstancedetail.status = status;

  var bookinstance = await BookInstance.create(bookinstancedetail);
  await bookinstance.setBook(book);
  console.log("New BookInstance: " + bookinstance.id);
  bookinstances.push(bookinstance);
  return bookinstance;
}

async function createGenreAuthors() {
  return Promise.all([
    authorCreate("Patrick", "Rothfuss", "1973-06-06", false),
    authorCreate("Ben", "Bova", "1932-11-8", false),
    authorCreate("Isaac", "Asimov", "1920-01-02", "1992-04-06"),
    authorCreate("Bob", "Billings", false, false),
    authorCreate("Jim", "Jones", "1971-12-16", false),
    genreCreate("Fantasy"),
    genreCreate("Science Fiction"),
    genreCreate("French Poetry"),
  ]);
}

async function createBooks() {
  return Promise.all([
    bookCreate(
      "The Name of the Wind (The Kingkiller Chronicle, #1)",
      "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
      "9781473211896",
      authors[0],
      [genres[0]]
    ),
    bookCreate(
      "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
      "Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.",
      "9788401352836",
      authors[0],
      [genres[0]]
    ),
    bookCreate(
      "The Slow Regard of Silent Things (Kingkiller Chronicle)",
      "Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.",
      "9780756411336",
      authors[0],
      [genres[0]]
    ),
    bookCreate(
      "Apes and Angels",
      "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...",
      "9780765379528",
      authors[1],
      [genres[1]]
    ),
    bookCreate(
      "Death Wave",
      "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...",
      "9780765379504",
      authors[1],
      [genres[1]]
    ),
    bookCreate(
      "Test Book 1",
      "Summary of test book 1",
      "ISBN111111",
      authors[4],
      [genres[0], genres[1]]
    ),
    bookCreate(
      "Test Book 2",
      "Summary of test book 2",
      "ISBN222222",
      authors[4],
      false
    ),
  ]);
}

async function createBookInstances(cb) {
  return Promise.all([
    bookInstanceCreate(books[0], "London Gollancz, 2014.", false, "Available"),
    bookInstanceCreate(books[1], " Gollancz, 2011.", false, "Loaned"),
    bookInstanceCreate(books[2], " Gollancz, 2015.", false, false),
    bookInstanceCreate(
      books[3],
      "New York Tom Doherty Associates, 2016.",
      false,
      "Available"
    ),
    bookInstanceCreate(
      books[3],
      "New York Tom Doherty Associates, 2016.",
      false,
      "Available"
    ),
    bookInstanceCreate(
      books[3],
      "New York Tom Doherty Associates, 2016.",
      false,
      "Available"
    ),
    bookInstanceCreate(
      books[4],
      "New York, NY Tom Doherty Associates, LLC, 2015.",
      false,
      "Available"
    ),
    bookInstanceCreate(
      books[4],
      "New York, NY Tom Doherty Associates, LLC, 2015.",
      false,
      "Maintenance"
    ),
    bookInstanceCreate(
      books[4],
      "New York, NY Tom Doherty Associates, LLC, 2015.",
      false,
      "Loaned"
    ),
    bookInstanceCreate(books[0], "Imprint XXX2", false, false),
    bookInstanceCreate(books[1], "Imprint XXX3", false, false),
  ]);
}

(async () => {
  try {
    await sequelize.sync({ force: true });
    const genre_authors = await createGenreAuthors();
    const books = await createBooks();
    const book_instances = await createBookInstances();
    sequelize.close();
  } catch (err) {
    console.error("Error while populating DB: ", err);
  }
})();
