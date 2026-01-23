import connectToDatabase from '../lib/mongoose';
import Product from '../models/Product';

async function seed() {
  await connectToDatabase();

  const products = [
    {
      name: 'Organic Wheat',
      category: 'Whole Grains',
      price: 5.99,
      description: 'High-quality organic wheat grains.',
      image: '/placeholder.jpg',
      rating: 4.5,
      reviews: []
    },
    {
      name: 'Brown Rice',
      category: 'Whole Grains',
      price: 4.99,
      description: 'Nutritious brown rice.',
      image: '/placeholder.jpg',
      rating: 4.0,
      reviews: []
    },
    {
      name: 'Lentils',
      category: 'Pulses',
      price: 3.99,
      description: 'Protein-rich lentils.',
      image: '/placeholder.jpg',
      rating: 4.2,
      reviews: []
    },
    {
      name: 'Quinoa',
      category: 'Whole Grains',
      price: 7.99,
      description: 'Superfood quinoa.',
      image: '/placeholder.jpg',
      rating: 4.8,
      reviews: []
    },
    {
      name: 'Chickpeas',
      category: 'Pulses',
      price: 4.49,
      description: 'Versatile chickpeas.',
      image: '/placeholder.jpg',
      rating: 4.3,
      reviews: []
    }
  ];

  await Product.insertMany(products);
  console.log('Sample products added');
  process.exit(0);
}

seed().catch(console.error);