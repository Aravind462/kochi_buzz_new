import { Sequelize } from "sequelize";

// Create a new Sequelize instance with your database connection details
export const sequelizeConfig = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// // Function to test the connection
// export const connectDB = async () => {
//   try {
//     await sequelizeConfig.authenticate();
//     console.log("✅ Database connected successfully.");
//   } catch (error) {
//     console.error("❌ Unable to connect to the database:", error);
//   }
// };

// connectDB();