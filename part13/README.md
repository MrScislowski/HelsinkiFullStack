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
