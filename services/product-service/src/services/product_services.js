class ProductService {
  constructor(productModel, categoryApi) {
    this.product = productModel;
    this.categoryApi = categoryApi;
  }

  async createProducts(productData) {
    try {
      await this.categoryApi.get(`/categories/${productData.categoryId}`);
    } catch (error) {
      throw new Error(`Category id : ${productData.categoryId} not found`);
    }
    return this.product.create(productData);
  }

  async getAllProducts() {
    const products = await this.Product.findAll();
    // Memuat data kategori dari service lain untuk setiap produk
    const productsWithCategories = await Promise.all(
      products.map(async (product) => {
        try {
          const categoryRes = await this.categoryApi.get(
            `/categories/${product.categoryId}`
          );
          return { ...product.toJSON(), category: categoryRes.data };
        } catch (error) {
          return { ...product.toJSON(), category: null };
        }
      })
    );
    return productsWithCategories;
  }
}

module.exports = ProductService;
