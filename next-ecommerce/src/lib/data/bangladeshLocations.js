/**
 * Bangladesh cities/districts and thanas for checkout address
 * City = District, Thana = Upazila/Police Station
 */

export const cities = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh",
  "Gazipur", "Narayanganj", "Tangail", "Comilla", "Noakhali", "Chandpur", "Brahmanbaria",
  "Cox's Bazar", "Feni", "Lakshmipur", "Jessore", "Kushtia", "Bogra", "Dinajpur", "Jamalpur",
];

export const thanasByCity = {
  Dhaka: ["Dhanmondi", "Gulshan", "Banani", "Mirpur", "Motijheel", "Uttara", "Mohakhali", "Lalmatia", "Badda", "Shyamoli", "Farmgate", "Old Dhaka", "Rampura", "Malibagh", "Khilgaon", "Paltan"],
  Chittagong: ["Agrabad", "Patenga", "Halishahar", "Kotwali", "Double Mooring", "Panchlaish", "Bakalia", "Chandgaon", "Khulshi"],
  Sylhet: ["Zindabazar", "Uposhohor", "Amberkhana", "Mirabazar", "Kadamtali", "Subidbazar"],
  Rajshahi: ["Boalia", "Rajpara", "Motihar", "Borendra", "Alamnagar"],
  Khulna: ["Sonadanga", "Khalishpur", "Daulatpur", "Khulna Sadar"],
  Barisal: ["Kotwali", "Band Road", "Rupatali"],
  Rangpur: ["Rangpur Sadar", "Mithapukur", "Pirgacha"],
  Mymensingh: ["Mymensingh Sadar", "Muktagacha", "Trishal"],
  Gazipur: ["Gazipur Sadar", "Tongi", "Kaliakair", "Sreepur"],
  Narayanganj: ["Narayanganj Sadar", "Fatullah", "Bandar", "Araihazar"],
  Tangail: ["Tangail Sadar", "Gopalpur", "Kalihati", "Mirzapur"],
  Comilla: ["Comilla Sadar", "Laksam", "Chandina", "Brahmanpara"],
  "Cox's Bazar": ["Cox's Bazar Sadar", "Teknaf", "Ukhia", "Ramu"],
  Jessore: ["Jessore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha"],
  Kushtia: ["Kushtia Sadar", "Kumarkhali", "Khoksa"],
  Bogra: ["Bogra Sadar", "Gabtali", "Shajahanpur"],
  Dinajpur: ["Dinajpur Sadar", "Fulbari", "Birampur"],
  Jamalpur: ["Jamalpur Sadar", "Melandaha", "Sarishabari"],
  Noakhali: ["Noakhali Sadar", "Begumganj", "Companiganj"],
  Chandpur: ["Chandpur Sadar", "Haimchar", "Kachua"],
  Brahmanbaria: ["Brahmanbaria Sadar", "Ashuganj", "Sarail"],
  Feni: ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan"],
  Lakshmipur: ["Lakshmipur Sadar", "Raipur", "Ramganj"],
};

export function getThanasForCity(city) {
  if (!city) return [];
  const key = cities.find((c) => c.toLowerCase() === city.toLowerCase());
  return thanasByCity[key] || [];
}

export function filterCities(query) {
  if (!query || query.length < 2) return cities.slice(0, 10);
  const q = query.toLowerCase();
  return cities.filter((c) => c.toLowerCase().includes(q)).slice(0, 10);
}

export function filterThanas(city, query) {
  const thanas = getThanasForCity(city);
  if (!query || query.length < 2) return thanas.slice(0, 10);
  const q = query.toLowerCase();
  return thanas.filter((t) => t.toLowerCase().includes(q)).slice(0, 10);
}
