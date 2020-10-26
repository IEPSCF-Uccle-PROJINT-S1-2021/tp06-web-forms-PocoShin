const {DateTime} = require("luxon");
const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
  const Author = sequelize.define("author", {
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    family_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    date_of_birth: DataTypes.DATEONLY,
    date_of_death: DataTypes.DATEONLY,
    name: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.first_name && this.family_name) {
          return `${this.family_name}, ${this.first_name}`;
        } else {
          return "";
        }
      },
    },
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `/catalog/author/${this.id}`;
      },
    },
    lifespan: {
      type: DataTypes.VIRTUAL,
      get() {
        let lifetime_string = "";
        if (this.date_of_birth) {
          lifetime_string = DateTime.fromISO(this.date_of_birth).toFormat("MMMM Do, YYYY");
        }
        lifetime_string += " - ";
        if (this.date_of_death) {
          lifetime_string += DateTime.fromISO(this.date_of_death).toFormat("MMMM Do, YYYY");
        }
        return lifetime_string;
      },
    },
    date_of_birth_yyyy_mm_dd: {
      type: DataTypes.VIRTUAL,
      get() {
        return DateTime.fromISO(this.date_of_birth).toFormat("YYYY-MM-DD");
      },
    },
    date_of_death_yyyy_mm_dd: {
      type: DataTypes.VIRTUAL,
      get() {
        return DateTime.fromISO(this.date_of_death).toFormat("YYYY-MM-DD");
      },
    }
  });
  return Author;
};
