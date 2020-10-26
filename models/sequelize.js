const config = require("../config/mysql.json");
const debug = require("debug")("express-locallibrary-tutorial:sequelize");
const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    logging: (msg) => debug(msg),
    dialect: "mysql",
    host: config.host,
    port: config.port,
  }
);

const Genre = require("./genre")(sequelize);
const Author = require("./author")(sequelize);
const Book = require("./book")(sequelize);
const BookInstance = require("./bookinstance")(sequelize);

Author.hasMany(Book);
Book.belongsTo(Author);
Book.belongsToMany(Genre, { through: "bookGenres" });
Book.hasMany(BookInstance);
Genre.belongsToMany(Book, { through: "bookGenres" });
BookInstance.belongsTo(Book);

module.exports = { sequelize, Author, Book, BookInstance, Genre };
