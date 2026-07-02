const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')

const databaseUrl = process.env.TESTING
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL

const sequelizeOptions = {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}

const sequelize = new Sequelize(databaseUrl, sequelizeOptions)

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js'
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })

  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.error(err)
    return process.exit(1)
  }
}

module.exports = { connectToDatabase, sequelize }