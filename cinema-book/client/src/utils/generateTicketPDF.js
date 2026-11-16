import jsPDF from 'jspdf';

/**
 * Generates an ultra-sleek, 1-page Cinema Pass PDF
 * @param {Object} booking - The booking document with populated show, movie, theatre
 */
export const generateTicketPDF = (booking) => {
  if (!booking) return;

  const movie = booking.show?.movie || {};
  const theatre = booking.show?.theatre || {};
  const show = booking.show || {};

  // Initialize jsPDF in portrait (A5: 148 x 210 mm - perfect ticket dimensions)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 148 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210 mm

  // 1. Background (Dark Cinema Theme: #0f0f14)
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Outer Ticket Border with rounded feel
  doc.setDrawColor(39, 39, 47);
  doc.setLineWidth(0.8);
  doc.roundedRect(6, 6, pageWidth - 12, pageHeight - 12, 4, 4, 'S');

  // 3. Top Banner (Cinema Red Accent: #e50914)
  doc.setFillColor(229, 9, 20);
  doc.roundedRect(6, 6, pageWidth - 12, 18, 4, 4, 'F');
  // fill square bottom corners of the header
  doc.rect(6, 16, pageWidth - 12, 8, 'F');

  // Brand Name & Pass Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CINEMABOOK PREMIERE PASS', pageWidth / 2, 14, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL DIGITAL ADMISSION E-TICKET', pageWidth / 2, 20, { align: 'center' });

  // 4. Booking ID & Status Bar
  let y = 30;
  doc.setFillColor(22, 22, 30);
  doc.roundedRect(12, y, pageWidth - 24, 12, 2, 2, 'F');
  doc.setDrawColor(45, 45, 55);
  doc.roundedRect(12, y, pageWidth - 24, 12, 2, 2, 'S');

  doc.setTextColor(200, 200, 210);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('BOOKING ID:', 16, y + 7.5);

  doc.setTextColor(229, 9, 20);
  doc.setFontSize(10);
  doc.text(booking.bookingId || 'CB-000000', 38, y + 7.5);

  // Status Badge (Confirmed)
  doc.setFillColor(16, 75, 40);
  doc.roundedRect(pageWidth - 45, y + 2.5, 29, 7, 2, 2, 'F');
  doc.setTextColor(52, 211, 153);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIRMED & PAID', pageWidth - 30.5, y + 7, { align: 'center' });

  // 5. Movie Title & Meta Information
  y = 48;
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  const movieTitle = (movie.title || 'Movie Title').toUpperCase();
  doc.text(movieTitle, 14, y);

  y += 6;
  doc.setTextColor(160, 160, 175);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const metaText = `${movie.language || 'English'} | ${movie.duration || '120'} mins | Rating: ${movie.rating || 8.5}/10 | ${Array.isArray(movie.genre) ? movie.genre.join(', ') : (movie.genre || 'Action')}`;
  doc.text(metaText, 14, y);

  // 6. Theatre & Show Details Card
  y += 6;
  doc.setFillColor(22, 22, 30);
  doc.roundedRect(12, y, pageWidth - 24, 46, 3, 3, 'F');
  doc.setDrawColor(40, 40, 50);
  doc.roundedRect(12, y, pageWidth - 24, 46, 3, 3, 'S');

  // Theatre & Location
  doc.setTextColor(229, 9, 20);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('THEATRE & LOCATION', 16, y + 7);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(theatre.name || 'Grand IMAX Cinema', 16, y + 12);

  doc.setTextColor(150, 150, 160);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${theatre.location || 'Cinema Centre'}, ${theatre.city || 'City'}`, 16, y + 16.5);

  // Separator inside card
  doc.setDrawColor(35, 35, 45);
  doc.line(16, y + 20, pageWidth - 16, y + 20);

  // Grid of Date, Time, Screen, Total Seats
  const col1 = 16;
  const col2 = 50;
  const col3 = 85;
  const col4 = 115;
  const rowY = y + 27;

  // Date
  doc.setTextColor(150, 150, 160);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('SHOW DATE', col1, rowY);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(show.showDate || 'YYYY-MM-DD', col1, rowY + 5);

  // Time
  doc.setTextColor(150, 150, 160);
  doc.setFontSize(7);
  doc.text('SHOWTIME', col2, rowY);
  doc.setTextColor(229, 9, 20);
  doc.setFontSize(9);
  doc.text(show.showTime || '07:30 PM', col2, rowY + 5);

  // Screen
  doc.setTextColor(150, 150, 160);
  doc.setFontSize(7);
  doc.text('AUDITORIUM', col3, rowY);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(`Screen ${show.screenNumber || 1}`, col3, rowY + 5);

  // Seats Count
  doc.setTextColor(150, 150, 160);
  doc.setFontSize(7);
  doc.text('TOTAL TICKETS', col4, rowY);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(`${booking.seats?.length || 1} Seat(s)`, col4, rowY + 5);

  // Reserved Seats Highlight
  doc.setFillColor(32, 16, 20);
  doc.roundedRect(16, y + 36, pageWidth - 32, 7.5, 1.5, 1.5, 'F');
  doc.setTextColor(252, 165, 165);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  const seatString = `RESERVED SEATS:  ${booking.seats?.join(', ') || 'N/A'}`;
  doc.text(seatString, 20, y + 41.5);

  // 7. Payment Summary Section
  y += 52;
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT BREAKDOWN', 14, y);

  y += 4;
  doc.setFillColor(20, 20, 26);
  doc.roundedRect(12, y, pageWidth - 24, 25, 2, 2, 'F');

  doc.setTextColor(160, 160, 170);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Ticket Base Price:', 16, y + 6);
  doc.text(`₹${booking.subtotal || booking.totalAmount - (booking.convenienceFee || 0)}`, pageWidth - 16, y + 6, { align: 'right' });

  doc.text('Convenience Fee & Taxes:', 16, y + 11.5);
  doc.text(`₹${booking.convenienceFee || 0}`, pageWidth - 16, y + 11.5, { align: 'right' });

  doc.text('Payment Method:', 16, y + 17);
  doc.text(booking.paymentMethod || 'Online / Card', pageWidth - 16, y + 17, { align: 'right' });

  doc.setDrawColor(40, 40, 50);
  doc.line(16, y + 19.5, pageWidth - 16, y + 19.5);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Total Amount Paid:', 16, y + 23.5);
  doc.setTextColor(52, 211, 153);
  doc.text(`₹${booking.totalAmount || 0}`, pageWidth - 16, y + 23.5, { align: 'right' });

  // 8. Perforation / Tear Strip Line (Ticket Look)
  y += 32;
  doc.setDrawColor(65, 65, 80);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(10, y, pageWidth - 10, y);
  doc.setLineDashPattern([], 0); // reset

  // Small cut-out notch circles on sides for realistic cinema ticket feel
  doc.setFillColor(10, 10, 12);
  doc.circle(6, y, 3, 'F');
  doc.circle(pageWidth - 6, y, 3, 'F');

  // 9. Digital Barcode / Entry Pass Stub Section
  y += 8;
  doc.setTextColor(170, 170, 185);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('ENTRY PASS VERIFICATION CODE', 14, y);

  // Simulated Barcode lines
  const barcodeY = y + 3;
  const barcodeXStart = 14;
  const barcodeWidth = pageWidth - 28;
  doc.setFillColor(240, 240, 245);

  // Draw randomized realistic barcode bars
  let currentX = barcodeXStart;
  const pattern = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1, 1, 2];
  let pIdx = 0;
  while (currentX < barcodeXStart + barcodeWidth - 5) {
    const barW = (pattern[pIdx % pattern.length] * 0.7);
    const gapW = 0.8;
    doc.rect(currentX, barcodeY, barW, 9, 'F');
    currentX += barW + gapW;
    pIdx++;
  }

  // Transaction ID & Timestamp
  y = barcodeY + 13;
  doc.setTextColor(130, 130, 145);
  doc.setFontSize(6.5);
  doc.setFont('courier', 'normal');
  doc.text(`TXN: ${booking.paymentId || 'MOCK-TXN-VERIFIED'}  |  ISSUED: ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: 'center' });

  // 10. Footer Instructions
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 115);
  doc.setFontSize(6);
  doc.text('• Please display this digital pass on your mobile device at Auditorium Gate.', pageWidth / 2, y, { align: 'center' });
  doc.text('• Valid photo ID may be requested upon entry. CinemaBook reserves all admission rights.', pageWidth / 2, y + 3.5, { align: 'center' });

  // Save the PDF file
  const filename = `CinemaBook_Ticket_${booking.bookingId || 'Pass'}.pdf`;
  doc.save(filename);
};
