const express = require("express");
const mysql = require("mysql2");
const app = express();
// const cros = require("cros");

// app.use(cros());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "myDBuser",
  password: "mydbuser",
  database: "mydb",
});

connection.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.get("/create-table", (req, res) => {
  let products = `CREATE TABLE if not exists products (
    product_id int auto_increment,
    product_url varchar(255) not null,
    product_name varchar(255) not null,
    PRIMARY KEY(product_id)
  )`;

  let description = `CREATE TABLE if not exists products_description (
    description_id int auto_increment,
    product_id int not null,
    product_brief_description TEXT not null,
    product_description TEXT not null,
    product_img varchar(255) not null,
    product_link varchar(255) not null,
    PRIMARY KEY(description_id),
    FOREIGN KEY(product_id) REFERENCES products(product_id)
  )`;

  let price = `CREATE TABLE if not exists product_price (
    price_id int auto_increment,
    product_id INT not null,
    starting_price VARCHAR(255) not null,
    price_range  VARCHAR(255) not null,
    PRIMARY KEY(price_id),
    FOREIGN KEY(product_id) REFERENCES products(product_id)
  )`;

  let user = `CREATE TABLE if not exists user (
    user_id int auto_increment,
    user_name VARCHAR(255) not null,
    user_password VARCHAR(255) not null,
    PRIMARY KEY(user_id)
  )`;

  let order = `CREATE TABLE if not exists orders (
    order_id int auto_increment,
    user_id int not null,
    product_id INT not null,
    PRIMARY KEY(order_id),
    FOREIGN KEY(product_id) REFERENCES products(product_id),
    FOREIGN KEY(user_id) REFERENCES user(user_id)
  )`;

  connection.query(products, (err, result, fields) => {
    if (err) {
      console.log(`Error creating products table: ${err}`);
    }
  });

  connection.query(description, (err, result, fields) => {
    if (err) {
      console.log(`Error creating products_description table: ${err}`);
    }
  });

  connection.query(price, (err, result, fields) => {
    if (err) {
      console.log(`Error creating product_price table: ${err}`);
    }
  });

  connection.query(user, (err, result, fields) => {
    if (err) {
      console.log(`Error creating user table: ${err}`);
    }
  });

  connection.query(order, (err, result, fields) => {
    if (err) {
      console.log(`Error creating orders table: ${err}`);
    }
  });

  res.end("Tables created");
  console.log("Tables created");
});

app.post("/insert-customer-info", (req, res) => {
  console.table(req.body);

  const {
    product_url,
    product_name,
    product_img,
    product_link,
    starting_price,
    price_range,
    product_description,
    product_brief_description,
  } = req.body;

  // Check for missing required fields
  if (
    !product_url ||
    !product_name ||
    !product_brief_description ||
    !product_description ||
    !product_img ||
    !product_link ||
    !starting_price ||
    !price_range
  ) {
    return res.status(400).send("All fields are required");
  }

  const insertProductQuery =
    "INSERT INTO products (product_url, product_name) VALUES (?, ?)";
  const insertDescriptionQuery =
    "INSERT INTO products_description (product_id, product_brief_description, product_description, product_img, product_link) VALUES (?, ?, ?, ?, ?)";
  const insertPriceQuery =
    "INSERT INTO product_price (product_id, starting_price, price_range) VALUES (?, ?, ?)";

  connection.query(
    insertProductQuery,
    [product_url, product_name],
    (err, result) => {
      if (err) {
        console.error("Error inserting product:", err);
        return res.status(500).send("Error inserting product");
      }

      const productId = result.insertId;

      connection.query(
        insertDescriptionQuery,
        [
          productId,
          product_brief_description,
          product_description,
          product_img,
          product_link,
        ],
        (err, result) => {
          if (err) {
            console.error("Error inserting product description:", err);
            return res.status(500).send("Error inserting product description");
          }

          connection.query(
            insertPriceQuery,
            [productId, starting_price, price_range],
            (err, result) => {
              if (err) {
                console.error("Error inserting product price:", err);
                return res.status(500).send("Error inserting product price");
              }

              res.send("Data inserted successfully");
              console.log("Data inserted successfully");
            }
          );
        }
      );
      res.send("Data inserted successfully");
      console.log("Data inserted successfully");
    }
  );
});

app.listen(2024, () => {
  console.log("Server is running on port http://localhost:2024");
});
