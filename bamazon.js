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
        message: "Choose product with id? [Quit with Q]",
    },
    {
        type: "input",
        name: "quantity",
        message: "What is the quantity?"
    }]).then(function (answer) {
        console.log(answer)
        // console.log(res);

        var correct = false;


        connection.query("SELECT * FROM products WHERE itemid = ?", [answer.select], function (err, res) {
            console.log(res[0].stock_quantity);
            if (res[0].stock_quantity > answer.quantity) {
                console.log("Item Purchased!");

                var newQuantity= res[0].stock_quantity - answer.quantity;
                
                // res[0].stock_quantity;
                connection.query("UPDATE products SET stock_quantity=?  WHERE itemid = ?", [newQuantity,answer.select])
            }
            
      
            else if(res[0].stock_quantity < answer.quantity) {
                console.log("Insufficient quantity!");
            }

        })

        for (var i = 0; i < res.length; i++) {

            // console.log(i);
            if (res[i].product_name.toLowerCase() == answer.select.toLowerCase()) {
                correct = true;
                var product = answer.select;
                var id = i;
            }
        }
    })
}


                // .then(function (answer2) {
                //     console.log(answer2 + "............");
                //     if ((res[id].stock_quantity - answer.quantity) > 0) {
                //         connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - answer.quantity) + "' WHERE product_name='" + product + "'", function (err, res2) {
                //             console.log("Product purchased");
                //             makeTable();
                //         })
                //     } else {
                //         console.log("Not a valid selection");
                //         promptCustomer(res);
                // }});
