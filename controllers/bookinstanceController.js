const { Book, BookInstance } = require("../models/sequelize");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");

// Display list of all BookInstances.
exports.bookinstance_list = async function (req, res, next) {
  try {
    const bookinstance_list = await BookInstance.findAll({
      include: Book,
    });
    res.render("bookinstance_list", {
      title: "Book Instance List",
      bookinstance_list,
    });
  } catch (error) {
    next(error);
  }
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = async function (req, res, next) {
  try {
    const bookinstanceId = req.params.id;
    const bookinstance = await BookInstance.findByPk(bookinstanceId, {
      include: Book,
    });
    if (bookinstance !== null) {
      res.render("bookinstance_detail", { title: "Book:", bookinstance });
    } else {
      next(createError(404, "Book instance not found"));
    }
  } catch (error) {
    next(error);
  }
};
// Display BookInstance create form on GET.
exports.bookinstance_create_get = async function (req, res, next) {
  try {
    const books = await Book.findAll();
    res.render("bookinstance_form", { title: "Create BookInstance", books });
  } catch (error) {
    next(error);
  }
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  body("book", "Book must be specified").trim().notEmpty().escape(),
  body("imprint", "Imprint must be specified").trim().notEmpty().escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const books = await Book.findAll();
        res.render("bookinstance_form", {
          title: "Create BookInstance",
          bookinstance: req.body,
          books,
          errors: errors.array()
        });
      } else {
        const bookinstance = await BookInstance.create({
          bookId: req.body.book,
          imprint: req.body.imprint,
          status: req.body.status
        });
        if (req.body.due_back) {
          bookinstance.due_back = req.body.due_back;
          await bookinstance.save();
        }
        res.redirect(bookinstance.url);
      }
    } catch (error) {
      next(error);
    }
  }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
};
// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
};
// Display BookInstance update form on GET.
exports.bookinstance_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
};
// Handle bookinstance update on POST.
exports.bookinstance_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
};
