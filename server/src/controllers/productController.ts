import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService.js';
import { ProductQueryParams } from '../types/index.js';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search, ageGroup, minPrice, maxPrice, minRating, sort } = req.query;

    const params: ProductQueryParams = {
      category: category as string,
      search: search as string,
      ageGroup: ageGroup as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      sort: sort as ProductQueryParams['sort'],
    };

    const products = await productService.getProducts(params);
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await productService.getProductById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`,
      });
      return;
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, price, category } = req.body;
    if (!name || price === undefined || !category) {
      res.status(400).json({
        success: false,
        message: 'Name, price, and category are required',
      });
      return;
    }

    const product = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await productService.updateProduct(id, req.body);

    if (!updated) {
      res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await productService.deleteProduct(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
