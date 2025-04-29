import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cloudinary from "./lib/cloudinary.js";
import Message from "./models/message.model.js";
import sendEmail from "./lib/sendEmail.js";


//example image uri = https://res.cloudinary.com/dxana5fbp/image/upload/v1744260512/rzypztzspkydf5corubn.jpg

console.log("worker process started");

//checking send email
await sendEmail(
    "automate371@gmail.com",
    "Old Images Deleted",
    ` 
    Successfully deleted the following images from Cloudinary:<br>`
);


//connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("MongoDB connected inside worker \n");
    startCleanup();
  })
  .catch((err) => {
    console.log("MongoDB connection error inside worker :", err,"\n");
    process.exit(1);
  });

//Core logic : Delete images older than 3 days
async function startCleanup() {
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    //Find old messages (chat images)
    const messages = await Message.find({
      createdAt: { $lte: threeDaysAgo },
      image: { $exists: true },
    });

    let deletedUrls = [];

    //Delete message images profile images
    for (const message of messages) {
      if (message.image) {
        const publicId = extractPublicId(message.image);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          deletedUrls.push(message.image);

          message.image = undefined;
          await message.save();
        }
      }
    }

    //send email notification
    if (deletedUrls.length > 0) {
      await sendEmail(
        "automate371@gmail.com",
        "Old Images Deleted",
        ` 
                    Successfully deleted the following images from Cloudinary:<br>
                    ${deletedUrls.map((url) => `<div>${url}</div>`).join("")}`
      );
    }

    //Notify parent
    process.send("cleanup done!");

    //Exit clean
    process.exit(0);
  } catch (error) {
    console.log("Error during cleanup : ",error);
    process.exit(1);
  }
}

//function to extract cloudinary public_id
function extractPublicId(url) {
  try {
    const parts = url.split("/");
    const fileWithExtension = parts[parts.length - 1];
    const publicId = fileWithExtension.split(".")[0];
    return publicId;
  } catch (error) {
    return null;
  }
}
