// Export bookings to CSV utility

const escapeCSV = (val) => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const exportBookingsToCSV = (bookings, filename = 'goldcare_bookings') => {
  const headers = [
    'Booking ID',
    'Customer Name',
    'Mobile',
    'Email',
    'Jewellery Type',
    'Repair Service',
    'Shop Name',
    'Appointment Date',
    'Appointment Time',
    'Budget (₹)',
    'Status',
    'Admin Remarks',
    'Booking Date',
  ];

  const rows = bookings.map((b) => [
    b.bookingId,
    b.customerName,
    b.mobile,
    b.email,
    b.jewelleryType,
    b.repairService,
    b.shopName,
    b.appointmentDate,
    b.appointmentTime,
    b.budget,
    b.status,
    b.adminRemarks || '',
    new Date(b.createdAt).toLocaleDateString('en-IN'),
  ]);

  const csvContent =
    [headers, ...rows].map((row) => row.map(escapeCSV).join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
