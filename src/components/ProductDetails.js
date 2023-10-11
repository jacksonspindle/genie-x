import React from "react";

// import "./styles.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import productImageTest from "../assets/productImageTest.jpg";
import xIcon from "../assets/xIcon.png";

const ProductDetailsNavigation = () => {
  const tabs = [
    {
      icon: "",
      label: "Product Details",
      content: (
        <div>
          <p>
            The Mascot Hoodie in Vintage Grey is crafted from luxury heavyweight
            cotton, with an oversized fit. It features our tonal puff detailed
            Bellerophon graphic to the front and back. The hoodie has ribbed
            hems and cuffs and is finished with a Represent metal bar to the
            pocket and cobrax popper to the hood.
          </p>
        </div>
      ),
    },
    {
      icon: "",
      label: "Shipping & Returns",
      content: (
        <div>
          <h1>UK SHIPPING</h1>
          <nav>
            <ul>
              <li>Royal Mail Tracked 24 (1-2 business days) - FREE.</li>
              <li>
                DPD Next Day (24 Hour) - £5.00 or FREE if order is £200 or
                above.
              </li>
            </ul>
          </nav>
          <h1>FREE UK RETURNS</h1>
          <p>
            If something is not quite right you’ve got 14 days to send back your
            items for FREE for a full refund. All we ask is that items are in an
            unused, unaltered condition and returned with their tags and
            packaging.
          </p>
        </div>
      ),
    },
    {
      icon: "",
      label: "Product FAQ",
      content: (
        <div>
          <h1>How does this Hoodie fit?</h1>
          <p>
            This product follows the signature oversized fit at Represent. This
            style falls wide and square. Fits large to size but for a regular
            fit, please take a size down.
          </p>
          <h1>What are Represent Hoodies made from?</h1>
          <p>
            Most of our hoodies are made from 100% heavy-weight jersey cotton.
            Compositions and GSM can be found within the product description.
          </p>
          <h1>How do you wash Represent Hoodies?</h1>
          <p>
            We recommend you wash your hoodies inside out at 30 degrees Celsius.
          </p>
          <h1>Can you tumble-dry Represent Hoodies?</h1>
          <p>We do not recommend that you tumble dry our hoodies.</p>
        </div>
      ),
    },
  ];

  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="window" key={selectedTab.label}>
      <nav>
        <ul>
          {tabs.map((item) => (
            <li
              key={item.label}
              className={item === selectedTab ? "selected" : ""}
              onClick={() => setSelectedTab(item)}
            >
              {`${item.icon} ${item.label}`}
              {item.label === selectedTab.label ? (
                <motion.div className="underline" layoutId="underline" />
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab ? selectedTab.label : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {selectedTab ? selectedTab.content : "😋"}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const ProductDetails = ({ setProductDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 2 }}
      className="product-details-container"
    >
      <img
        onClick={() => setProductDetails(false)}
        src={xIcon}
        alt="xIcon"
        className="xIcon"
      />
      <div className="product-details-side">
        <ProductDetailsNavigation />
      </div>
      <div className="product-images-side">
        <img
          src={productImageTest}
          className="product-image"
          alt="productImage"
        />
      </div>
    </motion.div>
  );
};

export default ProductDetails;
