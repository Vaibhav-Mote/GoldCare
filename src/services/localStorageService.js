// ============================================================
// GoldCare LocalStorage Service
// NOTE: This is a frontend-only demo. Data is stored in
// browser LocalStorage and is NOT shared between browsers,
// devices, or computers. Not suitable for production use.
// ============================================================

const KEYS = {
  SHOPS: 'goldcare_shops',
  BOOKINGS: 'goldcare_bookings',
  ADMIN_SESSION: 'goldcare_admin_session',
  SETTINGS: 'goldcare_settings',
};

// ---- Generic Helpers ----

const safeGet = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

// ---- SHOPS ----

export const getShops = () => safeGet(KEYS.SHOPS, []);

export const saveShops = (shops) => safeSet(KEYS.SHOPS, shops);

export const addShop = (shop) => {
  const shops = getShops();
  shops.push(shop);
  saveShops(shops);
};

export const updateShop = (id, updates) => {
  const shops = getShops().map((s) => (s.id === id ? { ...s, ...updates } : s));
  saveShops(shops);
};

export const deleteShop = (id) => {
  const shops = getShops().filter((s) => s.id !== id);
  saveShops(shops);
};

export const getShopById = (id) => getShops().find((s) => s.id === id) || null;

// ---- BOOKINGS ----

export const getBookings = () => safeGet(KEYS.BOOKINGS, []);

export const saveBookings = (bookings) => safeSet(KEYS.BOOKINGS, bookings);

export const addBooking = (booking) => {
  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);
};

export const updateBooking = (id, updates) => {
  const bookings = getBookings().map((b) =>
    b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
  );
  saveBookings(bookings);
};

export const deleteBooking = (id) => {
  const bookings = getBookings().filter((b) => b.id !== id);
  saveBookings(bookings);
};

export const getBookingById = (id) =>
  getBookings().find((b) => b.bookingId === id || b.id === id) || null;

export const getBookingByIdAndMobile = (bookingId, mobile) => {
  const normalized = mobile.replace(/\D/g, '');
  return (
    getBookings().find(
      (b) =>
        b.bookingId === bookingId &&
        b.mobile.replace(/\D/g, '') === normalized
    ) || null
  );
};

// ---- ADMIN SESSION ----

export const getAdminSession = () => safeGet(KEYS.ADMIN_SESSION, null);

export const setAdminSession = (session) => safeSet(KEYS.ADMIN_SESSION, session);

export const clearAdminSession = () => localStorage.removeItem(KEYS.ADMIN_SESSION);

export const isAdminLoggedIn = () => {
  const session = getAdminSession();
  return session && session.loggedIn === true;
};

// ---- SETTINGS ----

export const getSettings = () =>
  safeGet(KEYS.SETTINGS, { demoDataLoaded: false });

export const saveSettings = (settings) => safeSet(KEYS.SETTINGS, settings);

// ---- RESET ----

export const resetAllData = () => {
  localStorage.removeItem(KEYS.SHOPS);
  localStorage.removeItem(KEYS.BOOKINGS);
  localStorage.removeItem(KEYS.SETTINGS);
};

export { KEYS };
