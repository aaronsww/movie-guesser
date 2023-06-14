import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

app.use(cors());

mongoose
  .connect("mongodb://0.0.0.0:27017/guesser")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to Mongodb...", err));

const movieSchema = new mongoose.Schema({
  title: String,
  year: String,
  still: String,
});
 
const Movie = mongoose.model("Movie", movieSchema);

app.listen(5000, () => console.log("Listening on port 5000"));
