export function formatSalaryWithCurrency(salary: string | null, location: string): string {
  if (!salary) return "Salary not specified";

  // Check if salary already contains a currency symbol
  if (salary.match(/[\$£€₹¥]/)) {
    return salary;
  }

  const loc = location.toLowerCase();
  
  // Try to match location to currency
  if (loc.includes("india") || loc.includes("chennai") || loc.includes("bengaluru") || loc.includes("mumbai") || loc.includes("hyderabad") || loc.includes("pune") || loc.includes("delhi")) {
    return `₹${salary}`;
  }
  
  if (loc.includes("uk") || loc.includes("london") || loc.includes("united kingdom")) {
    return `£${salary}`;
  }
  
  if (loc.includes("europe") || loc.includes("germany") || loc.includes("france") || loc.includes("berlin") || loc.includes("paris") || loc.includes("netherlands") || loc.includes("ireland")) {
    return `€${salary}`;
  }
  
  if (loc.includes("japan") || loc.includes("tokyo")) {
    return `¥${salary}`;
  }

  // Default to USD for USA, Canada, Australia, Singapore, Dubai, Remote, etc.
  return `$${salary}`;
}
