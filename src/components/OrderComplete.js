import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase"; // Ensure correct import of Firebase configuration
import { Ring } from "@uiball/loaders";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const OrderComplete = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if user is not authenticated
      return;
    }

    const fetchOrder = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setOrder(querySnapshot.docs[0].data());
        } else {
          console.error("No order found for this user.");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="order-loading">
        <Ring size={40} lineWeight={5} speed={2} color="black" />
      </div>
    );
  }

  if (!order) {
    return <div>No orders found.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: "-30px", x: "0" }}
      animate={{ opacity: 1, y: "0", x: 0 }}
      className="order-success-container"
    >
      <h1>Order Success</h1>
      <p>Thank you for your purchase!</p>
      <div className="order-details">
        <h2>Order Number: {order.puzzlePieceId}</h2>
        <h3>Order Details:</h3>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              <strong>{item.name}</strong> - Quantity: {item.quantity} - Size:{" "}
              {item.size} - Price: ${item.price}
            </li>
          ))}
        </ul>
        <p>Total Amount: ${order.amount}</p>
        <p>Currency: {order.currency.toUpperCase()}</p>
      </div>
      <Link to="/design" className="continue-shopping-btn">
        Continue Shopping
      </Link>
    </motion.div>
  );
};

export default OrderComplete;
