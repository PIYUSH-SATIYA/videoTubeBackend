/*
  id string pk
  video ObjectId videos
  comment ObjectId comments
  tweet ObjectId tweets
  likedBy ObjectId users
  createdAt Date
  updatedAt Date
*/

import mongoose, {Schema, Types} from "mongoose";

const videoSchema = new Schema(
    {
        //either of `video`, 'comment' or 'tweet' will be assigned others are null
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        comments: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {timestamps: true}
);

export const Like = mongoose.model("Like", videoSchema);
