const { Sequelize } = require('sequelize')

const databaseUrl = process.env.TESTING
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL

const sequelizeOptions = process.env.TESTING
    ? {}
    : {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }

const sequelize = new Sequelize(databaseUrl, sequelizeOptions)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.error(err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }