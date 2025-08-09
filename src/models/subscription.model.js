/*
  id string pk
  subscriber ObjectId users
  channel ObjectId users
  createdAt Date
  updatedAt Date
*/

import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId, // subscriber is also a user
            ref: "User",
        },
        channel: {
            type: Schema.Types.ObjectId, // being subscribed is also a user
            ref: "User",
        },
    },
    {timestamps: true}
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
