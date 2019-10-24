const mysql = require('mysql');
const inquirer = require('inquirer');

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
    makeTable();
})

var makeTable = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].itemid + " - " + res[i].product_name + " - " +
                res[i].department_name + " - " + res[i].price + " - " + res[i].stock_quantity + "\n");
        }
        promptCustomer(res);
    })
}

var promptCustomer = function (res) {
    inquirer.prompt([{
        type: "input",
        name: "select",
        message: "What would you like to buy? [Quit with Q]"
    }]).then(function (answer) {
        var correct = false;
        console.log("chose item: " + answer.select);

        for (var i = 0; i < res.length; i++) {
            if (res[i].product_name.toLowerCase() == answer.select.toLowerCase()) {
                correct = true;
                var product = answer.select;
                var id = i;
                console.log("Found Item");
                inquirer.prompt({
                    type: "input",
                    name: "quantity",
                    message: "What is the quantity?",
                    validate: function (value) {
                        console.log("value: "+value);
                        if (isNAN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                }).then(function (answer) {
                    console.log(answer+"............");
                    if ((res[id].stock_quantity-answer.quantity) > 0) {
                        connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - answer.quantity) + "' WHERE product_name='" + product + "'", function (err, res) {
                            console.log("Product purchased");
                            makeTable();
                        })
                    } else {
                        console.log("Not a valid selection");
                        promptCustomer(res);
                    }


                })
            }
        }
    })
}




