# Using relational databases

## Document databases

- Mongo is a document database
- it is schemaless (has little awareness of what kind of data is stored in its collections)

## Setting up postgres using docker

```
docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres
```

Find the name of the docker container (in my case `47fc64ad792b`) using `docker ps -a`, then connect to the database with:

```
docker exec -it 47fc64ad792b psql -U postgres postgres
```

## Connecting to the database using `psql` command line tool

Commands:

- `\d`: tells you contents of database
- ```sql
  CREATE TABLE notes (
      id SERIAL PRIMARY KEY,
      content text NOT NULL,
      important boolean,
      date time
  );
  ```
  - `SERIAL` is an abbreviation for an integer column which gets a unique increasing value
- `\d notes`: shows you the schema of the `notes` table
- ```sql
  insert into notes (content, important) values ('Relational databases rule the world', true);
  insert into notes (content, important) values ('MongoDB is webscale', false);
  ```

## Connecting using `node`

- `pnpm init`
- `pnpm install -D nodemon`
- `pnpm install express dotenv pg sequelize` (sequelize is an ORM)
- `index.js`:

  ```js
  require("dotenv").config();
  const { Sequelize } = require("sequelize");

  const sequelize = new Sequelize(process.env.DATABASE_URL);

  const main = async () => {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
      sequelize.close();
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  };

  main();
  ```

- put the connection string: `DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres` in the `.env` file

### Using direct `sql` statements (i.e. not the ORM features)

After `await sequelize.authenticate()`, you can do:

```js
const notes = await sequelize.query("SELECT * FROM notes", {
  type: QueryTypes.SELECT,
});
```

## Using ORM; Models

```js
class Note extends Model {}

Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "note",
  }
);

// later in an express route, we can use:

const notes = await Note.findAll();

// creating a note...

const newNote = await Note.create(req.body);

//  creating in a more piecewise way...

const newNote = Note.build(req.body);
newNote.important = true;
await newNote.save();
```

### Creating empty db if not already exist...

```js
Note.sync();
```

### Find by id

```js
Note.findByPk(/*id here*/);
```

### Modify a note

```js
const note = await Note.findByPk(/*id*/);
note.important = true;
await note.save();
```

### Humean readable form of a note

```js
console.log(note.toJSON());
```

## Application structure with sequelize

https://fullstackopen.com/en/part13/join_tables_and_queries#application-structuring

- `util/config.js` loads & exports environment variables
- `util/db.js` initializes the database:

  ```js
  const Sequelize = require("sequelize");
  const { DATABASE_URL } = require("./config");

  const sequelize = new Sequelize(DATABASE_URL);

  const connectToDatabase = async () => {
    try {
      await sequelize.authenticate();
      console.log("connected to the database");
    } catch (err) {
      console.log("failed to connect to the database");
      return process.exit(1);
    }

    return null;
  };

  module.exports = { connectToDatabase, sequelize };
  ```

- `models/note.js` has to import the database
  ```js
  const { sequelize } = require("../util/db");
  ```

For all the routes that involve finding a note by id (aka primary key), we can define a middleware:

```js
const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id);
  next();
};
```

## User Management

To associate tables (e.g. users and notes), you can use a "foreign key".

`models/index.js` has:

```js
const Note = require("./note");
const User = require("./user");

User.hasMany(Note);
Note.belongsTo(User);
Note.sync({ alter: true });
User.sync({ alter: true });
```

"alter" means that tables in the database will match changes to the model definitions.

Making a join query now looks like this:

```js
const users = await User.findAll({
  include: {
    model: Note,
  },
});
```

If you want just some fields of the join, (for a different query btw)

```js
const notes = await Note.findAll({
  attributes: { exclude: ['user_id'] },
  include: {
    model: User,
    attributes: ['name'];
  }
})
```

### Behind the scenes with foreign keys / joins / etc

The code:

```js
User.hasMany(Note);
Note.belongsTo(User);
```

Is equivalent to doing the following in the `Note` model:

```js
Note.init({
  // ...
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" },
  },
  // ...
});
```

## Sequelize operators

```js
const { Op } = require("sequelize");
```

You can then use them like:

```js
Note.findAll({
  where: {
    [Op.and]: [{ a: 5 }, { b: 6 }],
    [Op.or]: [{ a: 5 }, { b: 6 }],
    // ...
  },
});
```

There is also `Op.` eq, ne, is, not, col, gt, gte, lt, lte, between, notBetween, all, in, notIn, like, notLike, startsWith, endsWith, substring, iLike, notILike, regexp, notRegexp, iRegexp, notIRegexp, any, match

### Unnecessary `where` clauses

Setting a variable to be an empty object, and then setting fields on it will reduce unnecessary clauses

```js
router.get("/", async (req, res) => {
  const where = {};

  if (req.query.important) {
    where.important = req.query.important === "true";
  }

  if (req.query.search) {
    where.content = {
      [Op.substring]: req.query.search,
    };
  }

  const notes = await Note.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
  });

  res.json(notes);
});
```

## Migrations

### Sequelize

Instead of having `Note.sync({alter: true})`, we should use migrations. A migration is a single javascript file that that describes modification(s) to the database. Migration files have functions `up` and `down`, to apply and undo the migration, respectively.

Here's an example migration (note that we have to use snake_case instead of camel case for the column/table names):

```js
const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("notes", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      important: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
      },
    });
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    await queryInterface.addColumn("notes", "user_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("notes");
    await queryInterface.dropTable("users");
  },
};
```

We should save this as `./migrations/20241029_00_initialize_notes_and_users.js`.

There's a sequelize command line tool for running the migrations, but we'll use umzug:

### umzug

```sh
pnpm install umzug
```

Then use it like:

```js
// ...
const { Umzug, SequelizeStorage } = require("umzug");

const sequelize = new Sequelize(DATABASE_URL);

const migrationConf = {
  migrations: {
    glob: "migrations/*.js",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);

  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

// ...
sequelize.authenticate();
await runMigrations();
```

This will automatically run migrations every time the database is loaded. To allow us to roll back migrations, create `utils/rollback.js`:

```js
const { rollbackMigration } = require("./db");

rollbackMigration();
```

And then in `package.json`:

```json
"db:rollback": "node ./utils/rollback.js"
```

## Many-to-many relationship

These are often handled with an "associative table" (also known as join table, junction table or cross-reference table), say, AB with two one-to-many relationships A → AB and B → AB. So it consists of two foreign keys

We can make the model aware of that (if the associative table is called `Membership`)

```js
User.belongsToMany(Team, { through: Membership });
Team.belongsToMany(User, { through: Membership });
```

These can be renamed if the names would be clobbered; e.g.

```js
User.belongsToMany(Note, { through: UserNotes, as: "marked_notes" }); // Users already has created notes; these marked notes are different
Note.belongsToMany(User, { through: UserNotes, as: "users_marked" }); // Notes already have a user who created them; that'd be clobbered
```
