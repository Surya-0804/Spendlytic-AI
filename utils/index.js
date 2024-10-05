/**
 * Formats a number into a human-readable string with suffixes (e.g., 1K, 1.5M) and INR symbol.
 * @param {number} num - The number to format.
 * @returns {string} - The formatted number as a string.
 */

const formatNumber = (num) => {
  const formattedNumber = num.toLocaleString("en-IN", {
    maximumFractionDigits: 1,
  });

  if (num >= 1e9) {
    return `₹${(num / 1e9).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (num >= 1e6) {
    return `₹${(num / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (num >= 1e3) {
    return `₹${(num / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `₹${formattedNumber}`;
};

export default formatNumber;
