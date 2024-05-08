import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database:"World",
  password: "s17111992",
  port: "5432"
});

db.connect();
let visited = [];
let index = 0;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries")
    for (let i=0; i<result.rows.length; i++){
      visited.push(result.rows[i].country_code);}
    console.log(visited)
  res.render("index.ejs", {countries : visited, total : visited.length})
})

app.post("/add", async (req,res)=> {
  const answer = req.body["country"].toLowerCase();
  try{
    const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
    [answer]);
    const countryCode =result.rows[0].country_code;
    try{
        await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [`${countryCode}`]);
        visited.push(countryCode);
        res.render("index.ejs", {countries : visited, total : visited.length});  
    } catch (error){
        res.render("index.ejs", {countries : visited, total : visited.length, error : "Country has already been added, try again."});
    };
  } catch(error) {
      console.log(error);
      res.render("index.ejs", {countries : visited, total : visited.length, error : "Country name doesn't exist"})
  }
  console.log(visited);
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
