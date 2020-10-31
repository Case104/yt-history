import { discovery } from "googleapis/build/src/apis/discovery";
import mongoose from "mongoose";
const { Schema } = mongoose;

const watchSchema = new Schema({
  watchDateTime: Date,
  video: { type: "ObjectId", ref: "Video" },
});

const categorySchema = new Schema({
  categoryName: String,
  categoryId: Number,
});

const channelSchema = new Schema({
  channelName: String,
  // videos: videos
});

const videoSchema = new Schema({
  videoTitle: String,
  videoUrl: String,
  videoId: String,
  category: { type: "ObjectId", ref: "Category" },
  channel: { type: "ObjectId", ref: "Channel" },
  tags: [String],
  duration: String,
  // data.items[0].contentDetails.duration
});
