import mongoose, { Schema } from 'mongoose';

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['TODO', 'INPROGRESS', 'DONE'],
      required: true,
      default: 'TODO'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export const Task = new mongoose.model('Task', TaskSchema);
