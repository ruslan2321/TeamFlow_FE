export const  getCurrentUserId  = (): number | undefined => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return undefined;
    
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    
    return user?.id ? Number(user.id) : undefined;
  } catch (error) {
    return undefined;
  }
};