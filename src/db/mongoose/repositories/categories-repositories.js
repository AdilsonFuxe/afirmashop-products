import CategoryModel from '../models/category-model.js';

export const createCategoryRepository = async ({_id, name}) => {
  const category = new CategoryModel({_id, name});
  await category.save();
  return category;
};

export const loadCategoryByIdRepository = async (id) => {
  return CategoryModel.findOne({_id: id, status: true}).lean();
}

export const deleteCategoryRepository = async (id) => {
  await CategoryModel.findByIdAndUpdate(id, {status: false});
};

export const updateCategoryRepository = async (id, { name }) => {
  return await CategoryModel.findByIdAndUpdate(id, { name }, { new: true });
};
