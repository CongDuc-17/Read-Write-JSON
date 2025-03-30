const express = require("express"); // khi nay bien express la 1 method
const app = express();
const fs = require("fs"); //them tv nay vao de doc ghi vao file users.json
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//
const port = 3000;
const FILE_PATH = "users.json";

//ham doc tu json
const readFromUsersJSON = () => {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};
//ham ghi vao json
const writeToUsersJSON = (users) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2), "utf8");
};

if (!fs.existsSync(FILE_PATH)) {
  writeToUsersJSON([
    { id: 1, name: "Duc", age: 21 },
    { id: 2, name: "Nam", age: 20 },
    { id: 3, name: "Duc", age: 32 },
    { id: 4, name: "Nam", age: 45 },
  ]);
}
// const users = [
//   { id: 1, name: "Duc", age: 21 },
//   { id: 2, name: "Nam", age: 20 },
//   { id: 3, name: "Duc", age: 32 },
//   { id: 4, name: "Nam", age: 45 },
// ];

// app.get("/", (req, res) => {
//   res.send("Hello Tran Le Cong Duc!"); // tra lai cho client
// });

// app.get("/users", (req, res) => {
//   res.send(users); // tra lai cho client
// });

// app.get("/users/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const user = users.find((user) => user.id == id);
//   res.send(user);
// });

//get sort
app.get("/users", (req, res) => {
  let users = readFromUsersJSON();
  const { sort } = req.query;
  if (sort === "asc") {
    users.sort((a, b) => a.age - b.age);
  } else if (sort === "desc") {
    users.sort((a, b) => b.age - a.age);
  }
  res.send(users);
});

app.post("/users", (req, res) => {
  const users = readFromUsersJSON();
  const { name, age } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    age,
  };

  users.push(newUser);
  writeToUsersJSON(users);
  res.send(users);
});

app.put("/users/:id", (req, res) => {
  let users = readFromUsersJSON();
  const id = parseInt(req.params.id);
  const { name, age } = req.body;
  const user = users.find((user) => user.id == id);
  if (name) {
    user.name = name;
  }
  if (age) {
    user.age = age;
  }

  writeToUsersJSON(users);
  res.send(user);
});

app.delete("/users/:id", (req, res) => {
  let users = readFromUsersJSON();
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((user) => user.id == id);

  users.splice(userIndex, 1);
  writeToUsersJSON(users);
  res.send(users);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
