export const createUrlFriendlyTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export const parseCategory = (
  category: string
): { mainCategory: string; subcategory: string } => {
  const [mainCategory, subcategory] = category
    .split(" | ")
    .map((part) => part.trim());
  return {
    mainCategory: mainCategory.toLowerCase(),
    subcategory: subcategory.toLowerCase(),
  };
};
