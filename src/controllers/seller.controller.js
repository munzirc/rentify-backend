import Likes from "../models/like.model.js";
import Property from "../models/property.model.js";

const addProperty = async (req, res) => {
  try {
    const { imageUrl, propertyName, address, city, propertyType, rent } =
      req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Please upload the image first!" });
    }

    const newProperty = new Property({
      imageUrl,
      propertyName,
      address,
      city,
      propertyType,
      rent: parseInt(rent),
      userId: req.userId,
    });

    const likes = new Likes({postId: newProperty._id, likes:[]});

    await newProperty.save();
    await likes.save();


    return res.json(newProperty);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Somthing went wrong!!" });
  }
};

const getProprties = async (req, res) => {
  try {
    const page = req.query.page || 1;

    const pageSize = 6;
    const skip = (page - 1) * pageSize;

    const properties = await Property.find({userId: req.userId}).skip(skip).limit(pageSize).lean();

    const count = await Property.countDocuments({userId: req.userId});

    res.status(200).json({ properties, count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong"});
  }
};

const updateProperty = async (req, res) => {
  try {
    const { imageUrl, propertyName, address, city, propertyType, rent, _id, userId } =
      req.body;

    if(req.userId !== userId) {
        return res.status(401).json({error: "Unauthorized"});
    }

    if (!imageUrl) {
      return res.status(400).json({ error: "Please upload the image first!" });
    }


    const property = await Property.findOne({ _id });

    property.imageUrl = imageUrl;
    property.propertyName = propertyName;
    property.address = address;
    property.city = city;
    property.propertyType = propertyType;
    property.rent = parseInt(rent),

    await property.save();

    res.status(200).json(property);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to update" });
  }
};

const deleteProperty = async (req, res) => {
  try {

    const id = req.params.postId;
    const result = await Property.deleteOne({ _id: id,  userId: req.userId});

    if (result.deletedCount === 1) {
      return res.status(200).json({ message: "Deleted successfully" });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default {
  addProperty,
  getProprties,
  updateProperty,
  deleteProperty,
};
