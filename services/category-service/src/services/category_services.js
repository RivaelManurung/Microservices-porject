class CategoryService {
    constructor(categoryModel){
        this.categoryModel = categoryModel;
    }

    async createCategory(categoryData) {
        return this.categoryModel.create(categoryData);
    }

    async getCategoryById(category_id) {
        return this.categoryModel.findOne({ where: { id: category_id } });
    }

    async getCategoryAll(){
        return this.categoryModel.findAll();
    }
}