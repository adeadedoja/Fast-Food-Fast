import db from '../models/db.connect';

class OrderControllers {
  //    controller to retrieve all orders
  getAllorders(request, response) {
    const text = `SELECT order_id, food_items, orders.user_id, full_name, amount, order_status, decline_reason, orders.created_at, orders.updated_at
    FROM orders INNER JOIN users ON orders.user_id = users.user_id`;
    db.query(text, (err, result) => {
      if (result.rows.length === 0) {
        return response.status(404).json({
          success: 'false',
          message: 'no order item available',
        });
      }
      return response.status(200).json({
        success: 'true',
        message: 'The orders were retrieved successfully',
        orders: result.rows,
      });
    });
  }

  //  controller to get a specific order
  getOrder(request, response) {
    const id = parseInt(request.params.id, 10);
    const text = `SELECT order_id, food_items, orders.user_id, full_name, amount, order_status, decline_reason, orders.created_at, orders.updated_at
    FROM orders INNER JOIN users ON orders.user_id = users.user_id WHERE order_id =$1`;
    const value = [id];
    db.query(text, value, (err, result) => {
      if (result.rows.length === 0) {
        return response.status(404).json({
          success: 'false',
          message: `Order with the ID: ${id} does not exist`,
        });
      }
      const order = {
        order_id: result.rows[0].order_id,
        food_items: JSON.parse(result.rows[0].food_items),
        user_id: result.rows[0].user_id,
        full_name: result.rows[0].full_name,
        amount_paid: result.rows[0].amount,
        order_status: result.rows[0].order_status,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at,
      };
      return response.status(200).json({
        success: 'true',
        message: 'The order was retrieved successfully',
        orderFound: order,
      });
    });
  }

  //  controller to get the  specific order of a specific user
  getUserorder(request, response) {
    const id = parseInt(request.params.userId, 10);
    if (request.decoded.user.userId !== id) {
      return response.status(404).json({
        success: 'false',
        message: `No Order for user with ID: ${id} `,
      });
    }
    const text = 'SELECT * FROM orders WHERE user_id =$1';
    const value = [id];
    return db.query(text, value, (err, result) => {
      if (result.rows.length === 0) {
        return response.status(404).json({
          success: 'false',
          message: 'You do not have any orders',
          myOrders: result.rows,
        });
      } else {
        return response.status(200).json({
          success: 'true',
          message: 'Your orders were retrieved successfully',
          myOrders: result.rows,
        });
      }
    });
  }

  //  Controller to get orders based on their status
  getOrdersbyStatus(request, response) {
    const accepted = request.params.orderStatus;
    if (
      accepted !== 'New'
      && accepted !== 'Processing'
      && accepted !== 'Cancelled'
      && accepted !== 'Complete'
    ) {
      return response.status(400).json({
        success: 'false',
        message:
          'Please the orderStatus parameter can only be New, Processing, Cancelled or Complete (case-sensitive)',
      });
    }
    const text = 'SELECT * FROM orders WHERE order_status =$1';
    const value = [accepted];
    return db.query(text, value, (err, result) => {
      if (result.rows.length === 0) {
        return response.status(404).json({
          success: 'false',
          message: `There are no ${accepted} orders available yet`,
        });
      } else {
        return response.status(200).json({
          success: 'true',
          message: 'The orders were retrieved successfully',
          Orders: result.rows,
        });
      }
    });
  }

  //  controller to place a new order
  createOrder(request, response) {
    const { foodItems } = request.body;
    const userId = request.decoded.user.userId;
    const orderedFoodItems = foodItems;
    const orderedItems = [];
    let totalAmount = 0;
    let count = 0;
    for (let i = 0; i < orderedFoodItems.length; i += 1) {
      const queryText = 'SELECT * FROM foods WHERE food_id = $1';
      const value = [orderedFoodItems[i].food_id];
      db.query(queryText, value, (err, result) => {
        const foundFood = {
          food_id: result.rows[0].food_id,
          food_name: result.rows[0].food_name,
          price: result.rows[0].price,
          quantity: orderedFoodItems[i].quantity,
        };
        totalAmount += foundFood.price * foundFood.quantity;
        orderedItems.push(foundFood);
        count += 1;

        if (count === orderedFoodItems.length) {
          const orders = JSON.stringify(orderedItems);
          const orderStatus = 'New';
          const createdAt = new Date();
          const updatedAt = new Date();
          const text = 'INSERT INTO orders(food_items, user_id, amount, order_status, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
          const newOrder = [orders, userId, totalAmount, orderStatus, createdAt, updatedAt];
          return db.query(text, newOrder, (error, result) => {
            if (error) {
              response.status(400).json({
                success: 'false',
                message: 'Cant place order',
                errorMessage: error,
              });
            } else {
              response.status(201).json({
                success: 'true',
                message: 'Your order has been placed successfully',
                result: result.rows[0],
              });
            }
          });
        }
      });
    }
  }

  //  controller to update an order -- works fine
  updateOrder(request, response) {
    const { orderStatus, declineReason } = request.body;
    const id = parseInt(request.params.id, 10);
    const findOneQuery = 'SELECT * FROM orders WHERE order_id=$1';
    const orderId = [id];
    const updateOneQuery = `UPDATE orders
      SET order_status=$1, decline_reason=$2, updated_at=$3
      WHERE order_id=$4 returning *`;
    db.query(findOneQuery, orderId, (err, result) => {
      if (result.rows.length === 0) {
        return response.status(404).json({
          success: 'false',
          message: 'food item not found',
        });
      }
      const updatedAt = new Date();
      const values = [
        orderStatus || result.rows[0].order_status,
        declineReason || result.rows[0].decline_reason,
        updatedAt,
        result.rows[0].order_id,
      ];
      return db.query(updateOneQuery, values, (error, result) => {
        if (error) {
          return response.status(400).json({
            success: 'false',
            message: 'Cant update order',
            errorMessage: error,
          });
        }
        return response.status(201).json({
          success: 'true',
          message: 'The order item was updated successfully',
          order: result.rows[0],
        });
      });
    });
  }

  async deleteOrder(request, response) {
    const { decoded } = request;
    const id = parseInt(request.params.id, 10);
    const findOneQuery = 'SELECT * FROM orders WHERE order_id=$1';
    const orderId = [id];
    try {
      const foundOrder = await db.query(findOneQuery, orderId);
      if (foundOrder.rowCount === 0) {
        return response.status(404).json({
          success: 'false',
          message: 'Sorry that order does not exist',
        });
      }
      const deleteOneQuery = 'DELETE FROM orders WHERE order_id=$1 AND user_id=$2';
      const neededIds = [id, decoded.user.userId];
      await db.query(deleteOneQuery, neededIds);
      return response.status(200).json({
        success: 'true',
        message: 'Your order has been deleted successfully',
      });
    } catch (error) {
      return response.status(500).json({
        success: 'false',
        message: 'something went wrong, please try again',
      });
    }
  }
}

const orderController = new OrderControllers();
export default orderController;
