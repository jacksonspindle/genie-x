const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const stripe = require("stripe")(functions.config().stripe.secret_key);
const db = admin.firestore();

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://geniexbeta.xyz"
    : "http://localhost:3000"; // Your local development URL

const success_url = `https://geniexbeta.xyz`;

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
      //   console.log("key", functions.config().stripe.secret_key);
      //   console.log("request body", req.body);
      // Retrieve the user's UID from the request
      const userId = req.body.uid;
      console.log("request user id", req.body.uid);
      // Retrieve cart data from Firestore
      const cartData = await getCartDataFromFirestore(userId);

      // Log the cart data and verify it before attempting to create a session
      console.log("Cart data:", cartData);
      if (!cartData || cartData.length === 0) {
        throw new Error("Cart is empty");
      }

      // Ensure all prices are integers
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

      // Create a Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: success_url,
        cancel_url: `http://localhost:3000/cart`,
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "GB", "AU"], // List of allowed countries
        },
      });

      console.log(`Checkout session created with ID: ${session.id}`);
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: error.message });
    }
  });
});
