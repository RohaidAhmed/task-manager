// lib/models/Task.ts
import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [20, 'name can not be more than 20 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Check if the model already exists to prevent overwrite
export default mongoose.models.Task || mongoose.model('Task', TaskSchema);