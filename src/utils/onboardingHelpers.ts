
export const getCurrentFieldName = (step: number): string | null => {
  switch (step) {
    case 1: return 'name';
    case 2: return 'gender';
    case 3: return 'weight';
    case 4: return 'height';
    case 5: return 'age';
    case 6: return 'goalWeight';
    case 7: return 'phoneNumber';
    default: return null;
  }
};

export const getCurrentFieldValue = (step: number, formData: any): string => {
  switch (step) {
    case 1: return formData.name;
    case 2: return formData.gender;
    case 3: return formData.weight;
    case 4: return formData.height;
    case 5: return formData.age;
    case 6: return formData.goalWeight;
    case 7: return formData.phoneNumber;
    default: return '';
  }
};
