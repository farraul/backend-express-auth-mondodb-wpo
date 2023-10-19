import asyncHandler from "express-async-handler";
import Seo from "../models/urlSeoModel.js";


const getUrlSeo = asyncHandler(async (req, res) => {
  try {
    const urls = await Seo.find({ user: req.params.id });
    res.json(urls);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const createUrlSeo = asyncHandler(async (req, res) => {
  try {
    const { urlSeo, id } = req.body;
    const url = await Seo.findOne({ url: urlSeo });
    if (!url) {
      const newUrl = new Seo({
        user: id,
        url: urlSeo,
      });
      await newUrl.save();
      res.json(newUrl);
    } else {
      throw new Error("Url ya guardada");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


export { createUrlSeo, getUrlSeo };
