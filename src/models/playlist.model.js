/**
  id string pk
  owner ObjectId users
  videos ObjectId[] videos
  name string
  description string
  createdAt Date
  updatedAt Date
 */

import mongoose, {Schema} from "mongoose";

const playlistSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        vidoes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video", // This means the obj id we define above will be reffered to the Video model. the model of this doc is User
            },
        ],
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
