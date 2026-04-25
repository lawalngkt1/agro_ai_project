
export interface ValidationRule {
  min: number;
  max: number;
  label: string;
}

export const CROP_VALIDATION_RULES: Record<string, ValidationRule> = {
  nitrogen: { min: 0, max: 150, label: 'Nitrogen' },
  phosphorus: { min: 0, max: 150, label: 'Phosphorus' },
  potassium: { min: 0, max: 250, label: 'Potassium' },
  temperature: { min: -10, max: 60, label: 'Temperature' },
  humidity: { min: 0, max: 100, label: 'Humidity' },
  ph: { min: 0, max: 14, label: 'pH Level' },
  rainfall: { min: 0, max: 1000, label: 'Rainfall' },
};

export const SOIL_VALIDATION_RULES: Record<string, ValidationRule> = {
  nitrogen: { min: 0, max: 200, label: 'Nitrogen' },
  phosphorus: { min: 0, max: 200, label: 'Phosphorus' },
  potassium: { min: 0, max: 300, label: 'Potassium' },
  ph: { min: 0, max: 14, label: 'pH Level' },
  moisture: { min: 0, max: 100, label: 'Moisture' },
};

export function validateField(value: string, rule?: ValidationRule): string | null {
  if (!value) return null; // Don't show error while typing if empty, or handled by required
  
  const num = parseFloat(value);
  if (isNaN(num)) return 'Please enter a valid number';
  
  if (rule) {
    if (num < rule.min) return `${rule.label} cannot be less than ${rule.min}`;
    if (num > rule.max) return `${rule.label} cannot be more than ${rule.max}`;
  }
  
  return null;
}
