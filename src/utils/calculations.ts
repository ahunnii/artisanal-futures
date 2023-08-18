const formatPrice = (num: number) => {
	return `$${num.toFixed(2)}`;
};

const calculateMonthly = (initialTotal: number, additionalCosts: number) => {
	return {
		hourly: ((initialTotal + additionalCosts) / 2000) * 12 || 0,
		total: initialTotal + additionalCosts || 0,
	};
};

const calculateMaterial = (initialTotal: number, additionalCosts: number, rate: number) => {
	let total = initialTotal + additionalCosts;
	let hourly = (initialTotal + additionalCosts) / rate || 0;

	return {
		hourly: isFinite(hourly) ? hourly : 0,
		total: isFinite(total) ? total : 0,
	};
};

const calculateLabor = (laborTotal: number) => {
	if (isFinite(laborTotal)) return laborTotal;
	return 0;
};

const calculateHourlyRatio = (cost: number, hours: number) => {
	let calc = (cost / hours) * 100;

	if (isFinite(calc)) return calc;
	return 0;
};

const CalculateUtil = {
	formatPrice,
	calculateMonthly,
	calculateMaterial,
	calculateLabor,
	calculateHourlyRatio,
};

export default CalculateUtil;
