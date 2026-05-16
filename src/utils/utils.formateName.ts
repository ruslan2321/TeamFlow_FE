export const getLastNameAndInitials = (fullName: string | undefined | null): string => {
  if (!fullName) return '';
  

  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  
  const [lastName, firstName, middleName] = parts;

  if (!firstName) return lastName || '';
  if (!middleName) return `${lastName} ${firstName[0]}.`;
  
  return `${lastName} ${firstName[0]}.${middleName[0]}.`;
};