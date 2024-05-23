const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
<<<<<<< HEAD
const express = require("express");
const bodyParser = require("body-parser");

// Initialize Firebase
admin.initializeApp();
const db = admin.firestore();

// Determine environment
const isProduction = process.env.NODE_ENV === "development";
const stripeSecretKey = isProduction
  ? functions.config().stripe.live_secret_key
  : functions.config().stripe.test_secret_key;
const stripe = require("stripe")(stripeSecretKey);

const baseUrl = isProduction
  ? "https://geniexbeta.xyz"
  : "http://localhost:3000"; // Your local development URL

const success_url = isProduction
  ? "https://geniexbeta.xyz"
  : "http://localhost:3000/success"; // Ensure this is appropriate for testing
=======

admin.initializeApp();
const stripe = require("stripe")(functions.config().stripe.secret_key);
const db = admin.firestore();

console.log(
  `Stripe mode: ${
    functions.config().stripe.secret_key.startsWith("sk_live_")
      ? "live"
      : "test"
  }`
);

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://geniexbeta.xyz"
    : "http://localhost:3000"; // Your local development URL

const success_url = `https://geniexbeta.xyz`;
>>>>>>> ed894918d3ced52a7917e06a757c5eec1d2c2783

const getCartDataFromFirestore = async (userId) => {
  try {
    console.log(`User ID: ${userId}`);

    const userCartRef = db.collection("carts").doc(userId);
    const userCartDoc = await userCartRef.get();

    if (userCartDoc.exists) {
      const cartData = userCartDoc.data();
      console.log(`Cart data for user ${userId}:`, cartData);
      return cartData.items || [];
    } else {
      console.log(`No cart found for user: ${userId}`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching cart data from Firestore:", error);
    throw error;
  }
};

exports.createCheckoutSession = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
<<<<<<< HEAD
      const userId = req.body.uid;
      console.log("request user id", req.body.uid);

      const cartData = await getCartDataFromFirestore(userId);

=======
      //   console.log("key", functions.config().stripe.secret_key);
      //   console.log("request body", req.body);
      // Retrieve the user's UID from the request
      const userId = req.body.uid;
      console.log("request user id", req.body.uid);
      // Retrieve cart data from Firestore
      const cartData = await getCartDataFromFirestore(userId);

      // Log the cart data and verify it before attempting to create a session
      console.log("Cart data:", cartData);
>>>>>>> ed894918d3ced52a7917e06a757c5eec1d2c2783
      if (!cartData || cartData.length === 0) {
        throw new Error("Cart is empty");
      }

<<<<<<< HEAD
=======
      // Ensure all prices are integers
>>>>>>> ed894918d3ced52a7917e06a757c5eec1d2c2783
      const lineItems = cartData.map((item) => {
        if (!item.price || isNaN(item.price)) {
          throw new Error(`Invalid price for item ${item.id}`);
        }
        const unit_amount = Math.round(item.price * 100); // Convert to cents and ensure it's an integer
        if (isNaN(unit_amount)) {
          throw new Error(`Invalid unit_amount calculated for item ${item.id}`);
        }
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Infinity Hoodie",
              images: [item.imageUrl],
            },
            unit_amount,
          },
          quantity: item.quantity,
        };
      });
      console.log("Line items to be sent to Stripe:", lineItems);

<<<<<<< HEAD
=======
      // Create a Stripe Checkout session
>>>>>>> ed894918d3ced52a7917e06a757c5eec1d2c2783
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: success_url,
<<<<<<< HEAD
        cancel_url: `${baseUrl}/cart`,
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "GB", "AU"], // List of allowed countries
        },
        metadata: {
          userId,
        },
      });

      console.log(`Checkout session created with ID: ${session.id}`);
=======
        cancel_url: `http://localhost:3000/cart`,
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "GB", "AU"], // List of allowed countries
        },
      });

      console.log("sessionID", session.id);
      console.log(`Checkout session created with ID: ${session.id}`);

>>>>>>> ed894918d3ced52a7917e06a757c5eec1d2c2783
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: error.message });
    }
  });
});
<<<<<<< HEAD

// Webhook handler function
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      functions.config().stripe.endpoint_secret
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    console.error("this part ran");
    return res.sendStatus(400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata ? session.metadata.userId : null;

    if (!userId) {
      console.error("⚠️ User ID not found in session metadata.");
      return res.sendStatus(400);
    }

    // Fetch cart items from Firestore
    const cartSnapshot = await admin
      .firestore()
      .collection("carts")
      .doc(userId)
      .get();

    if (!cartSnapshot.exists) {
      console.error("⚠️ Cart not found for user:", userId);
      return res.sendStatus(404);
    }

    const cartItems = cartSnapshot.data().items;

    // Fetch and increment the puzzle piece counter
    const counterRef = admin
      .firestore()
      .collection("counters")
      .doc("puzzlePieceCounter");
    const counterDoc = await counterRef.get();

    if (!counterDoc.exists) {
      console.error("⚠️ Puzzle piece counter not found.");
      return res.sendStatus(500);
    }

    let currentCount = counterDoc.data().currentCount;

    // Increment the counter
    const newCount = currentCount + 1;
    await counterRef.update({ currentCount: newCount });

    // Create a new order in the `orders` collection
    const orderRef = admin.firestore().collection("orders").doc();

    await orderRef.set({
      userId,
      items: cartItems,
      puzzlePieceId: newCount, // Assign the new puzzle piece ID
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      amount: session.amount_total / 100, // Stripe amount is in cents
      currency: session.currency,
    });

    // Clear the cart
    await admin.firestore().collection("carts").doc(userId).delete();

    console.log(
      `✅ Successfully created order for user ${userId} with puzzle piece ID ${newCount} and cleared cart.`
    );
  }

  res.sendStatus(200);
});
=======
>>>>>>> ed894918d3ced52a7917e06a757c5eec1d2c2783
