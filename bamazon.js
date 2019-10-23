const mysql = require('mysql');
const inquirer = require('inquirer');

let connection = mysql.createConnection({
  host:"localhost",
  port:3306,
  user:"root",
  password:"root",
  database:"bamazon"
})

connection.connect(function(err){
  if(err) throw err;
  console.log("Connected");
  makeTable();
})

var makeTable = function(){
  connection.query("SELECT * FROM products", function(err,res){
    for(var i=0; i<res.length; i++){
      console.log(res[i].itemid+" - "+res[i].product_name+" - "+
      res[i].department_name+" - "+res[i].price+" - "+res[i].stock_quantity+"\n");
    }
  })
}



