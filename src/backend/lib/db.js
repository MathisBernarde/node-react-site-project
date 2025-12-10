const { Sequelize } = require("sequelize");
const connection = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
});

module.exports = {
  connection,
  getConnection: async () => {
    try {
      await connection.authenticate();
      console.log("Database connected successfully");
      return connection;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  },
};