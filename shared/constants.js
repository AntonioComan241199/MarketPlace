const currentYear = new Date().getFullYear();
export const years = Array.from({length: 30}, (_, i) => currentYear - i);
export const fuelTypes = ['Benzina', 'Diesel', 'Hybrid', 'Electric'];

export default { currentYear, years, fuelTypes };