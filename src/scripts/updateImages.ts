import { config } from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product';

// Load environment variables from .env.local
config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not found. Please check your .env.local file.');
  process.exit(1);
}

async function updateImages() {
  await mongoose.connect(MONGODB_URI);

  const imageUpdates = {
    'Brown Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnJvd24lMjBSaWNlfGVufDB8fDB8fHww',
    'Lentils': 'https://images.unsplash.com/photo-1552585960-0e1069ce7405?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVudGlsc3xlbnwwfHwwfHx8MA%3D%3D',
    'Quinoa': 'https://plus.unsplash.com/premium_photo-1705207702015-0c1f567a14df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UXVpbm9hfGVufDB8fDB8fHww',
    'Chickpeas': 'https://images.unsplash.com/photo-1644432757699-bb5a01e8fb0e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2hpY2twZWFzfGVufDB8fDB8fHww',
    'Oats': 'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b2F0c3xlbnwwfHwwfHx8MA%3D%3D'
  };

  for (const [name, image] of Object.entries(imageUpdates)) {
    await Product.updateOne({ name }, { image });
    console.log(`Updated image for ${name}`);
  }

  console.log('Image updates completed');
  process.exit(0);
}

updateImages().catch(console.error);
