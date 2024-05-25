const currentYear = new Date().getFullYear();
const years = Array.from({length: 30}, (_, i) => currentYear - i);
const fuelTypes = ['Benzina', 'Diesel', 'Hybrid', 'Electric'];

export { currentYear, years, fuelTypes };