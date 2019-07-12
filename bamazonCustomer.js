var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  user: "root",
  password: "root",
  database: "bamazon_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});

connection.query("SELECT * FROM products", function (err, response) {
  console.table(response)
  // console.log(response[1].item_id)

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
    console.log("We currently have " + chosenProduct[0].stock_quantity + " in stock.");

    if (chosenProduct[0].stock_quantity >= answers.quantity) {
      var total = chosenProduct[0].price * answers.quantity;
      console.log("The total is $" + total);
      var newQuantity = chosenProduct[0].stock_quantity - answers.quantity;
      console.log("We now have " + newQuantity + " left in stock.");
      console.log("Thanks for your purchase!")

      // update database with new quantity
      connection.query("UPDATE products SET ? WHERE ?",
        [{
          stock_quantity: newQuantity
        }, {
          item_id: answers.chosenProductID
        }])

    } else {
      console.log("Sorry, we don't have enough in stock. Press Ctrl+C and type 'node bamazonCustomer' to try again.")
      connection.query;
    }
  })

})