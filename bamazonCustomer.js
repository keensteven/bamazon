var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});

connection.query("SELECT * FROM products", function (err, response) {
  console.table(response)

  // put inquirer prompt inside this connection because the query is asynchronous and we don't want to ask what one 
  // to buy until they have seen the products

  inquirer.prompt([{
      name: "chosenProductID",
      type: "number",
      message: "What is the id of the product you want to buy?"
    },
    {
      name: "quantity",
      type: "number",
      message: "How many would you like to order?"
    }

  ]).then(function (answers) {
    // console.log(answers);

    var chosenProduct = response.filter(function (each) {
      return each.item_id === answers.chosenProductID
    })
    // console.table(chosenProduct);
    console.log(chosenProduct[0].stock_quantity);

    if (chosenProduct[0].stock_quantity >= answers.quantity) {
      console.log("Thanks for your order")
      //var newQuantity = -
      //var total =
      //update database with new quantity
    } else {
      console.log("Insufficient quantity, please try again")
    }

  })


})