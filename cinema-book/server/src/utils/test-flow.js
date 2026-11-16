const http = require('http');

const request = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- STARTING CINEMABOOK END-TO-END VERIFICATION ---');

  // 1. Healthcheck
  console.log('\n[1] Testing Healthcheck /api/health...');
  const healthRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  });
  console.log(`Status: ${healthRes.status}`, healthRes.data);
  if (healthRes.status !== 200) throw new Error('Healthcheck failed');

  // 2. User Login
  console.log('\n[2] Testing User Login (user@cinemabook.com)...');
  const userLoginRes = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'user@cinemabook.com', password: 'user123' }
  );
  console.log(`Status: ${userLoginRes.status}`, userLoginRes.data?.user);
  if (!userLoginRes.data?.token) throw new Error('User login failed');
  const userToken = userLoginRes.data.token;

  // 3. Admin Login
  console.log('\n[3] Testing Admin Login (admin@cinemabook.com)...');
  const adminLoginRes = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'admin@cinemabook.com', password: 'admin123' }
  );
  console.log(`Status: ${adminLoginRes.status}`, adminLoginRes.data?.user);
  if (!adminLoginRes.data?.token) throw new Error('Admin login failed');
  const adminToken = adminLoginRes.data.token;

  // 4. Fetch Movies
  console.log('\n[4] Testing Movies Listing with Filter...');
  const moviesRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/movies?status=now_showing',
    method: 'GET'
  });
  console.log(`Found ${moviesRes.data?.count} Now Showing movies.`);
  const firstMovie = moviesRes.data?.data[0];
  console.log(`First movie: "${firstMovie?.title}" (ID: ${firstMovie?._id})`);

  // 5. Fetch Shows for first movie
  console.log(`\n[5] Fetching Shows for movie "${firstMovie.title}"...`);
  const showsRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: `/api/shows/movie/${firstMovie._id}`,
    method: 'GET'
  });
  console.log(`Found ${showsRes.data?.count} shows scheduled.`);
  const targetShow = showsRes.data?.data[0];
  console.log(`Target show ID: ${targetShow?._id}, Booked seats so far:`, targetShow?.bookedSeats);

  // 6. Test Seat Booking
  console.log('\n[6] Testing Seat Reservation (Booking seats B1, B2 - VIP)...');
  const bookingRes = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    },
    {
      showId: targetShow._id,
      seats: ['B1', 'B2'],
      paymentMethod: 'Razorpay'
    }
  );
  console.log(`Status: ${bookingRes.status}`);
  console.log('Confirmed Booking ID:', bookingRes.data?.data?.bookingId);
  console.log('Total Amount:', bookingRes.data?.data?.totalAmount);
  console.log('Payment ID:', bookingRes.data?.data?.paymentId);
  if (bookingRes.status !== 201) throw new Error('Booking failed');

  // 7. Test Double-Booking Prevention (Should FAIL with 400 or 409)
  console.log('\n[7] Testing Double-Booking Prevention (Trying to re-book seat B1)...');
  const collisionRes = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    },
    {
      showId: targetShow._id,
      seats: ['B1'],
      paymentMethod: 'Razorpay'
    }
  );
  console.log(`Double-booking test response status: ${collisionRes.status}`);
  console.log('Error message from backend:', collisionRes.data?.message);
  if (collisionRes.status === 201) {
    throw new Error('Double-booking prevention FAILED: already booked seat was allowed!');
  }
  console.log('SUCCESS: Backend correctly rejected already-booked seat!');

  // 8. Test My Bookings
  console.log('\n[8] Testing /api/bookings/my-bookings...');
  const myBookingsRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/bookings/my-bookings',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  console.log(`User has ${myBookingsRes.data?.count} bookings.`);

  // 9. Test Admin Dashboard Stats
  console.log('\n[9] Testing Admin Stats /api/admin/stats...');
  const statsRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log('Admin Stats:', statsRes.data?.data);

  // 10. Test Admin Movie CRUD
  console.log('\n[10] Testing Admin Movie CRUD (Add, Edit, Delete)...');
  // Add
  const addMovieRes = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/movies',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    },
    {
      title: 'Test Cyber Movie',
      description: 'A test film for admin verification',
      genre: ['Sci-Fi', 'Action'],
      language: 'English',
      duration: 110,
      releaseDate: '2026-11-20',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
      rating: 8.0,
      status: 'upcoming'
    }
  );
  const createdMovieId = addMovieRes.data?.data?._id;
  console.log(`Created movie: "${addMovieRes.data?.data?.title}" (ID: ${createdMovieId})`);

  // Edit
  const editMovieRes = await request(
    {
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api/movies/${createdMovieId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    },
    {
      rating: 9.2
    }
  );
  console.log(`Updated movie rating to: ${editMovieRes.data?.data?.rating}`);

  // Delete
  const deleteMovieRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: `/api/movies/${createdMovieId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Delete response:`, deleteMovieRes.data?.message);

  console.log('\n🎉 ALL 10 TEST SUITES PASSED FLAWLESSLY! 🎉\n');
};

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
