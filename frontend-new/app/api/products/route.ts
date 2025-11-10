import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';


const MONGO_URI = process.env.MONGO_URI || '';

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);


export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (!body.name || !body.price || !body.image) {
      return NextResponse.json(
        { success: false, message: 'Please provide all fields' },
        { status: 400 }
      );
    }

    const newProduct = await Product.create(body);
    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}