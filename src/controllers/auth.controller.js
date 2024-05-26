import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

const register = async (req, res) => {
  try {
    const { fname, lname, phone, email, password, userType } = req.body;

    console.log(fname, lname, phone, email, password);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "User already registerd" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fname,
      lname,
      phone,
      email,
      password: hashedPassword,
      userType,
    });

    await newUser.save();

    console.log(newUser._id);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: pass, ...rest } = newUser._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    return res.status(201).json({...rest, token});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if(!user) {
    return res.status(404).json({error:"User not found"})
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const { password: pass, ...rest } = user._doc;

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600000,
  });

  return res.status(200).json({...rest, token});
};

const logout = async (req, res) => {
    try {
      res.clearCookie("access_token");
      return res.status(200).json({message: "Logged out successfully"});

    } catch (error) {
      console.log(error.message);
      return res.status(500).clearCookie('access_token').json({error:"Internal server error"})
    }
}

export default {
  register,
  login,
  logout
};
