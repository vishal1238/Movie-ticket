require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

// Format date helper: YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinemabook');
    console.log('Connected to MongoDB for seeding...');

    // Clean existing collections
    await User.deleteMany();
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();
    console.log('Cleared existing collections.');

    // 1. Seed Users
    const users = await User.create([
      {
        name: 'Cinema Admin',
        email: 'admin@cinemabook.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'Alex Johnson',
        email: 'user@cinemabook.com',
        password: 'user123',
        role: 'user'
      }
    ]);
    console.log(`Seeded ${users.length} users (Admin & Demo User)`);

    // 2. Seed Theatres
    const theatres = await Theatre.create([
      {
        name: 'Grand IMAX Horizon',
        location: '7th Avenue, Downtown Centre',
        city: 'New York',
        totalScreens: 5
      },
      {
        name: 'Starlight Multiplex',
        location: '45 Sunset Boulevard, West District',
        city: 'New York',
        totalScreens: 4
      },
      {
        name: 'CineDome 4DX & Laser',
        location: 'Cyber Hub Mall, Level 3',
        city: 'New York',
        totalScreens: 6
      }
    ]);
    console.log(`Seeded ${theatres.length} theatres`);

    // 3. Seed Movies
    const movies = await Movie.create([
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.',
        genre: ['Sci-Fi', 'Adventure', 'Action'],
        language: 'English',
        duration: 166,
        releaseDate: new Date('2024-03-01'),
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
        rating: 8.8,
        status: 'now_showing',
        cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
        director: 'Denis Villeneuve'
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral and geopolitical fallout.',
        genre: ['Biography', 'Drama', 'History'],
        language: 'English',
        duration: 180,
        releaseDate: new Date('2023-07-21'),
        posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
        rating: 8.9,
        status: 'now_showing',
        cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
        director: 'Christopher Nolan'
      },
      {
        title: 'Spider-Man: Across the Spider-Verse',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash, Miles must redefine what it means to be a hero.',
        genre: ['Animation', 'Action', 'Adventure'],
        language: 'English',
        duration: 140,
        releaseDate: new Date('2023-06-02'),
        posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=600&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
        rating: 8.7,
        status: 'now_showing',
        cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
        director: 'Joaquim Dos Santos'
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        genre: ['Action', 'Crime', 'Drama'],
        language: 'English',
        duration: 152,
        releaseDate: new Date('2008-07-18'),
        posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
        rating: 9.0,
        status: 'now_showing',
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
        director: 'Christopher Nolan'
      },
      {
        title: 'Interstellar',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        genre: ['Sci-Fi', 'Drama', 'Adventure'],
        language: 'English',
        duration: 169,
        releaseDate: new Date('2014-11-07'),
        posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
        rating: 8.6,
        status: 'now_showing',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
        director: 'Christopher Nolan'
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the mission.',
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        language: 'English',
        duration: 148,
        releaseDate: new Date('2010-07-16'),
        posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop',
        rating: 8.8,
        status: 'now_showing',
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
        director: 'Christopher Nolan'
      },
      {
        title: 'Deadpool & Wolverine',
        description: 'A listless Wade Wilson toils in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his homeworld faces an existential threat, Wade must suit up again alongside an even more reluctant Wolverine.',
        genre: ['Action', 'Comedy', 'Sci-Fi'],
        language: 'English',
        duration: 127,
        releaseDate: new Date('2024-07-26'),
        posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
        rating: 8.2,
        status: 'upcoming',
        cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin'],
        director: 'Shawn Levy'
      },
      {
        title: 'Gladiator II',
        description: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after the powerful emperors of Rome conquer his home.',
        genre: ['Action', 'Adventure', 'Drama'],
        language: 'English',
        duration: 148,
        releaseDate: new Date('2024-11-22'),
        posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
        rating: 7.9,
        status: 'upcoming',
        cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington'],
        director: 'Ridley Scott'
      }
    ]);
    console.log(`Seeded ${movies.length} movies`);

    // 4. Generate Shows for Now Showing movies over today and next 4 days
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(formatDate(d));
    }

    const showTimes = ['10:30 AM', '02:00 PM', '05:30 PM', '09:00 PM'];
    const nowShowingMovies = movies.filter(m => m.status === 'now_showing');

    const showsToInsert = [];

    nowShowingMovies.forEach((movie, mIdx) => {
      dates.forEach((showDate, dIdx) => {
        // Assign each movie to 1 or 2 theatres
        theatres.forEach((theatre, tIdx) => {
          if ((mIdx + tIdx) % 2 === 0 || dIdx === 0) {
            // Pick 2 showtimes per theatre for variety
            const selectedTimes = tIdx % 2 === 0 
              ? [showTimes[0], showTimes[2]] 
              : [showTimes[1], showTimes[3]];

            selectedTimes.forEach(time => {
              // Pre-populate a couple booked seats to make it realistic
              const sampleBooked = [];
              if (dIdx === 0) {
                // Today has some pre-booked seats
                sampleBooked.push('C4', 'C5', 'A3', 'E7');
              }
              showsToInsert.push({
                movie: movie._id,
                theatre: theatre._id,
                screenNumber: (tIdx % 3) + 1,
                showDate,
                showTime: time,
                price: {
                  regular: 200 + (tIdx * 20),
                  premium: 350 + (tIdx * 30)
                },
                totalSeats: 70, // 7 rows (A-G) x 10 seats
                bookedSeats: sampleBooked
              });
            });
          }
        });
      });
    });

    const shows = await Show.create(showsToInsert);
    console.log(`Seeded ${shows.length} shows across dates: ${dates.join(', ')}`);

    // 5. Create a sample initial completed booking for the demo user
    const firstShow = shows[0];
    const initialBooking = await Booking.create({
      bookingId: 'CB-849201',
      user: users[1]._id, // Demo user
      show: firstShow._id,
      seats: ['C4', 'C5'],
      seatDetails: [
        { seatNumber: 'C4', type: 'regular', price: firstShow.price.regular },
        { seatNumber: 'C5', type: 'regular', price: firstShow.price.regular }
      ],
      subtotal: firstShow.price.regular * 2,
      convenienceFee: 50,
      totalAmount: (firstShow.price.regular * 2) + 50,
      paymentStatus: 'completed',
      paymentMethod: 'Razorpay',
      paymentId: 'pay_DEMO_INIT90214'
    });
    console.log(`Seeded initial booking ${initialBooking.bookingId} for demo user`);

    console.log('\n--- SEED COMPLETE ---');
    console.log('Admin Login: admin@cinemabook.com / admin123');
    console.log('User Login:  user@cinemabook.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();
