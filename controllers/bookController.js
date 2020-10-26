const { Author, Book, BookInstance, Genre } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");

exports.index = async function (req, res, next) {
  try {
    const book_count_promise = Book.count();
    const bookinstance_count_promise = BookInstance.count();
    const bookinstance_available_count_promise = BookInstance.count({
      where: {
        status: "Available",
      },
    });
    const author_count_promise = Author.count();
    const genre_count_promise = Genre.count();

    const results = await Promise.all([
      book_count_promise,
      bookinstance_count_promise,
      bookinstance_available_count_promise,
      author_count_promise,
      genre_count_promise,
    ]);
    res.render("index", {
      title: "Local Library Home",
      data: {
        book_count: results[0],
        book_instance_count: results[1],
        book_instance_available_count: results[2],
        author_count: results[3],
        genre_count: results[4],
      },
    });
  } catch (error) {
    next(error);
  }
};

// Display list of all books.
exports.book_list = async function (req, res, next) {
  try {
    const book_list = await Book.findAll({
      include: Author,
    });
    res.render("book_list", { title: "Book List", book_list });
  } catch (error) {
    next(error);
  }
};

// Display detail page for a specific book.
exports.book_detail = async function (req, res, next) {
  try {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId, {
      include: [Author, Genre, BookInstance],
    });
    if (book !== null) {
      res.render("book_detail", { title: "Book Detail", book });
    } else {
      next(createError(404, "Book not found"));
    }
  } catch (error) {
    next(error);
  }
};

// Display book create form on GET.
exports.book_create_get = async function (req, res, next) {
  try {
    const [authors, genres] = await Promise.all([
      Author.findAll(),
      Genre.findAll(),
    ]);
    res.render("book_form", { title: "Create Book", authors, genres });
  } catch (error) {
    next(error);
  }
};

// Handle book create on POST.
exports.book_create_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },
  body("title", "Title must not be empty.").trim().notEmpty().escape(),
  body("author", "Author must not be empty.").trim().notEmpty().escape(),
  body("summary", "Summary must not be empty.").trim().notEmpty().escape(),
  body("isbn", "ISBN must not be empty").trim().notEmpty().escape(),
  body("genre.*").escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const [authors, genres] = await Promise.all([
          Author.findAll(),
          Genre.findAll(),
        ]);
        for (let i = 0; i < genres.length; i++) {
          const genre = genres[i];
          if (req.body.genre.indexOf(genre.id.toString()) > -1) {
            genres[i].checked = true;
          }
        }
        res.render("book_form", {
          title: "Create Book",
          book: req.body,
          authors,
          genres,
          errors: errors.array(),
        });
      } else {
        const book = await Book.create({
          title: req.body.title,
          summary: req.body.summary,
          isbn: req.body.isbn,
        });
        const author = await Author.findByPk(req.body.author);
        if (author === null) {
          next(createError(404, "Author not found"));
        } else {
          await book.setAuthor(author);
        }
        if (req.body.genre.length > 0) {
          const genres = await Genre.findAll({
            where: {
              id: req.body.genre,
            },
          });
          await book.addGenres(genres);
        }
        res.redirect(book.url);
      }
    } catch (error) {
      next(error);
    }
  },
];
// Display book delete form on GET.
exports.book_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Book delete GET");
};
// Handle book delete on POST.
exports.book_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = async function (req, res, next) {
  try {
    const [book, authors, genres] = await Promise.all([
      Book.findByPk(req.params.id, {
        include: [Author, Genre],
      }),
      Author.findAll(),
      Genre.findAll(),
    ]);
    if (book === null) {
      next(createError(404, "Book not found"));
    } else {
      const selectedGenres = book.genres.map(genre => genre.id);
      for (let i = 0; i < genres.length; i++) {
        const genre = genres[i];
        if (selectedGenres.indexOf(genre.id) > -1) {
          genre.checked = true;
        }
      }
      res.render("book_form", {
        title: "Update Book",
        book,
        authors,
        genres,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Handle book update on POST.
exports.book_update_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },
  body("title", "Title must not be empty.").trim().notEmpty().escape(),
  body("author", "Author must not be empty.").trim().notEmpty().escape(),
  body("summary", "Summary must not be empty.").trim().notEmpty().escape(),
  body("isbn", "ISBN must not be empty").trim().notEmpty().escape(),
  body("genre.*").escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const [authors, genres] = await Promise.all([
          Author.findAll(),
          Genre.findAll(),
        ]);
        for (let i = 0; i < genres.length; i++) {
          const genre = genres[i];
          if (req.body.genre.indexOf(genre.id.toString()) > -1) {
            genres[i].checked = true;
          }
        }
        res.render("book_form", {
          title: "Update Book",
          book: req.body,
          authors,
          genres,
          errors: errors.array(),
        });
      } else {
        const book = await Book.findByPk(req.params.id);
        book.title =  req.body.title;
        book.summary = req.body.summary;
        book.isbn = req.body.isbn;
        await book.save();
        if (book.authorId !== req.body.author) {
          const author = await Author.findByPk(req.body.author);
          if (author === null) {
            next(createError(404, "Author not found"));
          } else {
            await book.setAuthor(author);
          }
        }
        if (req.body.genre.length > 0) {
          const genres = await Genre.findAll({
            where: {
              id: req.body.genre,
            },
          });
          await book.setGenres(genres);
        }
        res.redirect(book.url);
      }
    } catch (error) {
      next(error);
    }
  },
];
