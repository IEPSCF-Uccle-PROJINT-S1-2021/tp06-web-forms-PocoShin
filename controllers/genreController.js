const { Book, Genre } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre list");
};

// Display detail page for a specific Genre.
exports.genre_detail = async function (req, res, next) {
  try {
    const genreId = req.params.id;
    const genre = await Genre.findByPk(genreId, {
      include: Book,
    });
    if (genre !== null) {
      res.render("genre_detail", { title: "Genre Detail", genre });
    } else {
      next(createError(404, "Genre not found"));
    }
  } catch (error) {
    next(error);
  }
};

// Display Genre create form on GET.
exports.genre_create_get = function (req, res, next) {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name", "Genre name required").trim().notEmpty().escape(),
  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        genre: req.body,
        errors: errors.array(),
      });
    } else {
      try {
        const [genre, created] = await Genre.findOrCreate({
          where: { name: req.body.name },
        });
        res.redirect(genre.url);
      } catch (error) {
        next(error);
      }
    }
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};
// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};
// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre update GET");
};
// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
