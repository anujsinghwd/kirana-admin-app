export const appendIfExists = (fd: FormData, key: string, value: any) => {
  if (value !== undefined && value !== null && value !== "") {
    fd.append(key, String(value));
  }
};

/**
 * Formats a numeric value into Indian Rupee currency format.
 *
 * @param price - The amount to format (number or string convertible to number)
 * @returns Formatted currency string, e.g. ₹1,23,456.00
 */
export const DisplayPriceInRupees = (price: number | string): string => {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    console.warn("DisplayPriceInRupees: Invalid price value →", price);
    return "₹0.00";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

export const cleanOrderFilters = (filters: Record<string, string>) => Object.fromEntries(
  Object.entries(filters).filter(([_, v]) => v !== "" && v !== undefined)
);
