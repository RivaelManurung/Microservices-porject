class CategoryController {
    constructor(cateogryService) {
        this.cateogryService = cateogryService;
    }

    async createCategory (req,res) {
        try {
            const category = await this.cateogryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getAllCategrory(req,res) {
        try {
            const category = await this.cateogryService.getAllCategrory();
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}