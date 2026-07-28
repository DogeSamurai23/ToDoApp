import mongoose from 'mongoose';

const DEFAULT_MONGODB_URI =
  'mongodb+srv://adityamishra12310_db_user:gIIWbOJgBuDlmHEd@cluster0.pwyix8p.mongodb.net/todo-app?retryWrites=true&w=majority&appName=Cluster0';

/**
 * Connects to MongoDB using environment variable or direct Atlas fallback.
 */
const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
    console.log(`Connecting to MongoDB Atlas...`);
    await mongoose.connect(uri);
    console.log(`✅ MongoDB Cloud Atlas connected successfully: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    // Do not crash server so health check works
  }
};

export default connectDB;
