import express from "express";
import mongoose from "mongoose";

// MongoDB connection
mongoose
  .connect("mongodb://user:password@127.0.0.1:27019/S-Mongo?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  rating: Number,
});

// Create a model from the schema
const movieCollection = mongoose.model("Movie", movieSchema);

const app = express();
app.use(express.json());

// Create a new movie
app.post("/movies", async (req, res) => {
  const { title, genre, rating } = req.body;
  try {
    const result = await movieCollection.create({ title, genre, rating });
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Read all movies
app.get("/movies", async (req, res) => {
  try {
    const result = await movieCollection.find();
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//get movies with id
app.get("/movies/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await movieCollection.findByIdAndUpdate(id);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//count films
app.get("/movies-count", async (req, res) => {
  try {
    const result = await movieCollection.countDocuments();
    res.status(200).send({ Total_Film: result });
  } catch (error) {
    res.status(400).send("Error: " + err.message);
  }
});
//search film by genre
app.get("/movies-search", async (req, res) => {
  const { searchGenre } = req.query;
  try {
    const result = await movieCollection.find({ genre: searchGenre });
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
//film highest rating
app.get("/movies-highest-rating", async (req, res) => {
  try {
    const result = await movieCollection.find().sort({ rating: -1 }).limit(1);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
// Update a movie
app.put("/movies/:id", async (req, res) => {
  const id = req.params.id;
  const { title, genre, rating } = req.body;
  try {
    const result = await movieCollection.findByIdAndUpdate(
      id,
      { title, genre, rating },
      { new: true }
    );
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// app.put("/movies/:id", async (req, res) => {
//   const { id } = req.params;
//   const { title, genre, rating } = req.body;

//   try {
//     const result = await movieCollection.updateOne(
//       //db.movie
//       { _id: new MongoClient.ObjectID(id) },
//       { $set: { title, genre, rating } }
//     );
//     if (result.matchedCount === 0) {
//       res.status(404).send("Movie not found");
//     } else {
//       res.status(200).send("Movie updated");
//     }
//   } catch (err) {
//     res.status(400).send("Error: " + err.message);
//   }
// });

// Update a movie
// app.put("/movies/:id", async (req, res) => {
//   const { id } = req.params;
//   const { title, genre, rating } = req.body;

//   try {
//     const movie = await Movie.findByIdAndUpdate(
//       id,
//       { title, genre, rating },
//       { new: true }
//     );
//     res.status(200).send(movie);
//   } catch (err) {
//     res.status(400).send("Error: " + err.message);
//   }
// });

// Delete a movie
app.delete("/movies/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await movieCollection.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (result.deletedCount === 0) {
      res.status(404).send("No movie found with that ID");
    } else {
      res.status(200).send("Delete success");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
