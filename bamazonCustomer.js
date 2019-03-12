//
const inquirer = require('inquirer');

//
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "test",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to BAMAZON! At PORT #", connection.threadId);
    hello()
});


function hello() {
    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: 'list',
                name: 'buy',
                message: 'What do you want to do?',
                choices: [
                    'Make a purchase',
                    "Oh Snap. I don't need to be here!"
                ]
            }
        ])
        .then(answers => {
            // Use user feedback
            if (answers.buy != "Make a purchase") {
                console.log('====================================');
                console.log("Thank you for visting BAMAZON. We will be here when you need us.");
                console.log('====================================');
                connection.end();
            }
            else {
                productList()
            }
        });
}
const productList = () => {
    console.log('====================================');
    console.log("List of products");
    console.log('====================================');
    let query = "SELECT id, product_name, price, stock_quantity FROM products"
    connection.query(query, function (err, res) {
        if (err) console.log(err)

        var i = 0;
        do {
            console.log("Item Number: " + res[i].id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || In Stock: " + res[i].stock_quantity);
            i++;
        }
        while (i < res.length) {
            console.log('====================================');
            purchase(res)
        }

    })

};

function purchase(res) {
    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: 'input',
                name: 'id',
                message: 'Enter the Item Number you wish to purchase',
                validate: function (value) {
                    var valid = parseFloat(value);
                    if (valid > res.length || valid <= 0) {
                        return false
                    }
                    return true
                }
            }
        ])
        .then(answers => {
            // Use user feedback
            let id = parseInt(answers.id)
            if (res[(id - 1)].stock_quantity > 0) {

                let query = "SELECT product_name, price, stock_quantity FROM products WHERE ?"
                connection.query(query, { id: id }, function (err, pRes) {


                    console.log(`
==========================================
Cool, you want ${pRes[0].product_name}!
Well, we do have those in stock. There are ${pRes[0].stock_quantity} at ${pRes[0].price} each.
==========================================
                    `);

                    howMany(pRes[0])
                })

            }

            else {
                console.log('====================================');
                console.log("Yikes, we are all out of " + res[0].product_name + "!")
                console.log('====================================');
                purchase(res)
            }
        });
}


function howMany(item) {
    console.log(item.product_name)
    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: 'input',
                name: 'qty',
                message: 'How many would you like to buy?',
                validate: function (value) {
                    var valid = parseFloat(value);
                    if (valid > item.stock_quantity || valid <= 0) {
                        return false || "your requested QTY can not be processed: "
                            + valid + ' Stock Qty indicates: ' + item.stock_quantity
                    }
                    return true
                }
            },
            {
                type: 'confirm',
                name: 'buy',
                message: function (answer) {
                    return "Total will be $" + (answer.qty * item.price).toFixed(2) + ". Let's Puchase it!"
                },
                default: false
            }


        ])
        .then(answers => {
            if (answers.buy) {
                var count = item.stock_quantity - answers.qty
                let query = " UPDATE products SET stock_quantity = ? WHERE product_name = ?"
                connection.query(query, [count, item.product_name], function (err, newRes) {
                    console.log('====================================');
                    console.log("Sweet! You bought " + answers.qty + ' ' + item.product_name + " for $" + (answers.qty * item.price).toFixed(2) + ". THanks for shopping!");
                    console.log('====================================');
                    exit();
                })
            }
            else {
                console.log('====================================');
                console.log("Okay that's cool");
                console.log('====================================');
                exit();
            };
        });
    ;
}

function exit() {
    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: 'confirm',
                name: 'exit',
                message: "Would ou like to continue shopping?",
                default: false
            }
        ])
        .then(answers => {
            if (!answers.exit) {
                console.log('====================================');
                console.log("Thank you for visting BAMAZON. We will be here when you need us.");
                console.log('====================================');
                connection.end();
            }
            else {
                productList();
            };
        });
};