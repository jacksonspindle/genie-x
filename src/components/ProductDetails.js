import React from "react";

// import "./styles.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import productImageTest from "../assets/productImageTest.jpg";
import xIcon from "../assets/xIcon.png";
import sampleHoodie from "../assets/sampleHoodie.webp";

const ProductDetailsNavigation = () => {
  const tabs = [
    {
      icon: "",
      label: "Product Details",
      content: (
        <div>
          <p>
            The Friends and Family Infinity Hoodie is crafted from luxury
            heavyweight 100% Primafiber Cotton, with a slightly oversized fit.
            Featuring a tonal puff print of the Act of Creation emblem on the
            front and a customized-to-order direct to garment print on the back.
          </p>
          <ul className="product-details-bullets">
            <li style={{ textAlign: "right" }}>• 12 oz. 400 GSM +/-</li>
            <li>• Heavy Duty Puff Print</li>
            <li>• Double Self-Lined Hood</li>
            <li>• Pockets Secured With Bar Tacks</li>
            <li>• Clean Finished Ribbed Cuffs and Waistband</li>
          </ul>
        </div>
      ),
    },
    {
      icon: "",
      label: "Shipping & Returns",
      content: (
        <div>
          <h1 style={{ textAlign: "left" }}>US Shipping</h1>
          <nav>
            Each order will be shipped with USPS Ground within 3 weeks of order
            placement.
          </nav>
          <br></br>
          <br></br>
          <br></br>
          <h1 style={{ textAlign: "left" }}>Return Policy</h1>
          <p>
            Due to the nature of our product being 1:1, we do not offer returns.
            All sales are final, however if you do not recieve the hoodie within
            3 weeks then we guarantee your money back.
          </p>
        </div>
      ),
    },
    {
      icon: "",
      label: "Product FAQ",
      content: (
        <div>
          <h1 style={{ textAlign: "left" }}>How does this Hoodie fit?</h1>
          <p>
            The Infinity Hoodie follows the signature oversized fit at Act of
            Creation. The Hoodie fits slightly wide and square.
          </p>
          <br></br>
          <br></br>
          <h1 style={{ textAlign: "left" }}>
            What are Represent Hoodies made from?
          </h1>
          <p>
            The Friends and Family Infinity Hoodie is crafted from luxury
            heavyweight 100% Primafiber Cotton, with a slightly oversized fit.
          </p>
          <br></br>
          <br></br>
          <h1 style={{ textAlign: "left" }}>
            How do you wash Represent Hoodies?
          </h1>
          <p>
            We recommend you wash your hoodies inside out inside out on cold
            setting.
          </p>
          <br></br>
          <br></br>
          <h1 style={{ textAlign: "left" }}>
            Can you tumble-dry Represent Hoodies?
          </h1>
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
        <img src={sampleHoodie} className="product-image" alt="productImage" />
      </div>
    </motion.div>
  );
};

export default ProductDetails;
