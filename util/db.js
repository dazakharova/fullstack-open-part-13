const {Sequelize} = require("sequelize");

const databaseUrl = process.env.TESTING
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL

const sequelize = new Sequelize(databaseUrl, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }