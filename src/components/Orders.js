import React, { useEffect, useState } from "react";
import { db, auth } from "../config/firebase"; // Import Firebase auth and db
import { collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore functions
import { motion } from "framer-motion"; // Import Framer Motion
import { Ring } from "@uiball/loaders";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Error fetching orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <Ring size={30} lineWeight={5} speed={2} color="white" />
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="orders">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => {
            const createdAtDate = order.createdAt?.seconds
              ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
              : "Unknown date";
            const estimatedDeliveryDate = order.estimatedDelivery?.seconds
              ? new Date(
                  order.estimatedDelivery.seconds * 1000
                ).toLocaleDateString()
              : "Unknown date";

            return (
              <motion.li
                key={order.id}
                className="order-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="order-details">
                  <img
                    width={100}
                    src={order.items[0].imageUrl}
                    alt="Order Item"
                    className="order-image"
                  />
                  <div className="order-info">
                    <p>
                      <strong>Puzzle Piece Number:</strong>{" "}
                      {order.puzzlePieceId}
                    </p>
                    <p>
                      <strong>Size:</strong> {order.items[0].size}
                    </p>
                    <p>
                      <strong>Date:</strong> {createdAtDate}
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                    <p>
                      <strong>Total:</strong> ${order.total}
                    </p>
                    <p>
                      <strong>Shipping Address:</strong> {order.shippingAddress}
                    </p>
                    <p>
                      <strong>Estimated Delivery:</strong>{" "}
                      {estimatedDeliveryDate}
                    </p>
                    <p>
                      <strong>Tracking Number:</strong>{" "}
                      <a
                        href={`https://trackingservice.com/${order.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {order.trackingNumber}
                      </a>
                    </p>
                    <p>
                      <strong>Order Notes:</strong> {order.notes}
                    </p>
                  </div>
                </div>
                <div className="order-actions">
                  <button onClick={() => handleCancelOrder(order.id)}>
                    Cancel Order
                  </button>
                  <button onClick={() => handleContactSupport(order.id)}>
                    Contact Support
                  </button>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const handleCancelOrder = (orderId) => {
  // Implement cancel order functionality here
  console.log("Cancel order", orderId);
};

const handleContactSupport = (orderId) => {
  // Implement contact support functionality here
  console.log("Contact support for order", orderId);
};

export default Orders;
