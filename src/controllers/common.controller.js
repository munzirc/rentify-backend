import nodemailer from "nodemailer";

import Property from "../models/property.model.js";
import User from "../models/user.model.js";
import Likes from "../models/like.model.js";

const getProperties = async (req, res) => {
  try {
    const city = req.query.city;
    const searchQuery = req.query.searchQuery || "";
    const propertyType = req.query.propertyType || "";
    const rent = req.query.rent || "";

    let query = {};

    query["city"] = new RegExp(city, "i");

    if (propertyType) {
      query["propertyType"] = new RegExp(propertyType, "i");
    }

    if (rent) {
      query['rent'] = { $lte: parseInt(rent) };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { propertyName: searchRegex },
        { address: searchRegex },
        { propertyType: searchRegex },
      ];
    }

    const properties = await Property.find(query);

    const count = await Property.countDocuments(query);

    res.status(200).json({ properties, count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const sendEmail = async (req, res) => {
  const { sellerId, buyerId } = req.body;

  if (!sellerId || !buyerId) {
    return res.status(400).json({ error: "Bad request!" });
  }

  var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const seller = await User.findOne({ _id: sellerId });
    const buyer = await User.findOne({ _id: buyerId });

    if (!seller || !buyer) {
      return res.status(404).json({ error: "Seller or buyer not found!" });
    }

    const { password: sellerPassword, ...sellerDetails } = seller._doc;
    const { password: buyerPassword, ...buyerDetails } = buyer._doc;

    const sellerEmailOptions = {
      from: process.env.EMAIL_USER,
      to: seller.email,
      subject: "New Buyer Interested in Your Property",
      text: `Hello ${
        seller.fname + " " + seller.lname
      },\n\nYou have a new interested buyer. Here are their details:\n\nName: ${
        buyerDetails.fname + " " + buyerDetails.lname
      }\nEmail: ${buyerDetails.email}\nPhone: ${
        buyerDetails.phone
      }\n\nBest regards,\nRentify`,
    };

    const buyerEmailOptions = {
      from: process.env.EMAIL_USER,
      to: buyer.email,
      subject: "Property Information from Seller",
      text: `Hello ${
        buyer.fname + " " + buyer.lname
      },\n\nHere are the details of the seller for the property you're interested in:\n\nName: ${
        sellerDetails.fname + " " + sellerDetails.lname
      }\nEmail: ${sellerDetails.email}\nPhone: ${
        sellerDetails.phone
      }\n\nBest regards,\nRentify`,
    };

    // Send emails
    await transporter.sendMail(sellerEmailOptions);
    await transporter.sendMail(buyerEmailOptions);

    res.status(200).json(sellerDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!!" });
  }
};

const getLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Likes.findOne({ postId });

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

const addLike = async (req, res) => {
  try {
    const { postId } = req.params;

    const userId = req.userId;

    if (!postId) {
      return res.status(400).json({ error: "Bad request" });
    }

    const post = await Likes.findOne({ postId });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: "User already liked the post" });
    }

    post.likes.push(userId);

    await post.save();

    res.status(200).json({ message: "Like added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const removeLike = async (req, res) => {
  try {
    const { postId } = req.params;

    const userId = req.userId;

    if (!postId || !userId) {
      return res.status(400).json({ error: "Bad request" });
    }

    const post = await Likes.findOne({ postId });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ error: "User has not liked the post" });
    }

    post.likes = post.likes.filter((id) => id === userId);

    await post.save();

    res.status(200).json({ message: "Like removed successfully", post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default {
  getProperties,
  sendEmail,
  getLikes,
  addLike,
  removeLike,
};
