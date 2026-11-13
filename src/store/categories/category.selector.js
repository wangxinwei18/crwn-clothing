export const selectCategoriesMap = (state) => {
  const categories = state.categories?.categories ?? [];

  return categories.reduce((acc, category) => {
    const { title, items } = category;
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});
};
