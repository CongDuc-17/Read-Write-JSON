import express from "express";
import bodyParser from "body-parser";
import fs from "fs"; //them tv nay vao de doc ghi vao file users.json
const app = express();
app.use(bodyParser.json());

import { checkID, checkReqBody } from "../MIDDLEWARE/checkDataInput.js";

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

app.get("/users/:id", checkID, (req, res) => {
  let users = readFromUsersJSON();
  const id = parseInt(req.params.id);
  const user = users.find((user) => user.id == id);
  res.status(200).send(user);
});

//get sort
app.get("/users", (req, res) => {
  let users = readFromUsersJSON();
  const { sort } = req.query;
  if (sort === "asc") {
    users.sort((a, b) => a.age - b.age);
  } else if (sort === "desc") {
    users.sort((a, b) => b.age - a.age);
  } else {
    res.status(400).send("Yêu cầu sắp xếp không hợp lệ");
  }
  res.status(200).send(users);
});

app.post("/users", checkReqBody, (req, res) => {
  const users = readFromUsersJSON();
  const { name, age } = req.body;
  const maxId =
    users.length > 0 ? Math.max(...users.map((user) => user.id)) : 0;
  const newUser = {
    id: maxId + 1,
    name,
    age,
  };

  users.push(newUser);
  writeToUsersJSON(users);
  res.status(200).send(users);
});

app.put("/users/:id", checkID, checkReqBody, (req, res) => {
  let users = readFromUsersJSON();
  const id = parseInt(req.params.id);
  const { name, age } = req.body;
  const user = users.find((user) => user.id == id);
  user.name = name;
  user.age = age;
  writeToUsersJSON(users);
  res.status(200).send(user);
});

app.delete("/users/:id", checkID, (req, res) => {
  let users = readFromUsersJSON();
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((user) => user.id == id);

  users.splice(userIndex, 1);
  writeToUsersJSON(users);
  res.status(200).send("DELETE SUCCESS");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
