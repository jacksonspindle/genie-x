// src/Orders.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../config/firebase"; // Import Firebase auth and db
import { collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore functions
// import "./Orders.css"; // Optional: Add CSS for styling

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
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="orders">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              <div className="order-details">
                <img
                  width={99}
                  src={order.items[0].imageUrl}
                  alt="Order Item"
                  className="order-image"
                />
                <div className="order-info">
                  <p>Puzzle Piece Number: {order.puzzlePieceId}</p>
                  <p>Size: {order.items[0].size}</p>
                  <p>
                    Date:{" "}
                    {new Date(
                      order.createdAt.seconds * 1000
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
