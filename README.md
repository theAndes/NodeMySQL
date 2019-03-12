# NodeMySQL
### Customer View

1. Created a MySQL Database called `bamazon`.

2. Created a Table inside of that database called `products`.

3. The products table have each of the following columns:

   * item_id (unique id for each product)

   * product_name (Name of product)

   * department_name

   * price (cost to customer)

   * stock_quantity (how much of the product is available in stores)

4. Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

5. The app should then prompt users with two messages.

   * The first should ask them the ID of the product they would like to buy.
   * The second message should ask how many units of the product they would like to buy.

6. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

   * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

7. Ff your store _does_ have enough of the product, you should fulfill the customer's order.
   * Update the SQL database to reflect the remaining quantity.
   * Once the update goes through, show the customer the total cost of their purchase.

- - -



[Node CLI My SQL VIDEO](https://github.com/theAndes/NodeMySQL/blob/master/nodeMYsql.webm?raw=true)
