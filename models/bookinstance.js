const {DateTime} = require("luxon");
const {DataTypes, Sequelize} = require("sequelize");

module.exports = (sequelize) => {
  const BookInstance = sequelize.define("bookInstance", {
    imprint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Maintenance",
      validate: {
        isIn: [["Available", "Maintenance", "Loaned", "Reserved"]],
      },
    },
    due_back: {
      type: DataTypes.DATEONLY,
      defaultValue: Sequelize.NOW,
    },
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `/catalog/bookinstance/${this.id}`;
      },
    },
    due_back_formatted: {
      type: DataTypes.VIRTUAL,
      get() {
        return DateTime.fromISO(this.due_back).toLocaleString(DateTime.DATE_MED);
      },
    },
    due_back_yyyy_mm_dd: {
      type: DataTypes.VIRTUAL,
      get() {
        return DateTime.fromISO(this.due_back).toFormat("YYYY-MM-DD");
      },
    },
  });
  return BookInstance;
};
