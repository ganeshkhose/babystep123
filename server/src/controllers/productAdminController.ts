import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService.js';
import { CreateProductInput, UpdateProductInput } from '../types/admin.js';

export const createProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      imageUrl,
      shortDescription,
      description,
      stock,
      ageGroup,
      tags,
      benefits,
      ingredientsOrSpecs,
      isFeatured,
    } = req.body;

    // Validation
    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Product name is required.' });
      return;
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
      res.status(400).json({ success: false, message: 'A valid price (₹) is required.' });
      return;
    }

    if (!category || !category.trim()) {
      res.status(400).json({ success: false, message: 'Product category is required.' });
      return;
    }

    if (!imageUrl || !imageUrl.trim()) {
      res.status(400).json({ success: false, message: 'Product image URL is required.' });
      return;
    }

    const input: CreateProductInput = {
      name: name.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category: category.trim(),
      imageUrl: imageUrl.trim(),
      shortDescription: shortDescription?.trim(),
      description: description?.trim(),
      stock: stock !== undefined ? Number(stock) : 15,
      ageGroup: ageGroup?.trim(),
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : undefined),
      benefits: Array.isArray(benefits) ? benefits : (benefits ? [benefits] : undefined),
      ingredientsOrSpecs: Array.isArray(ingredientsOrSpecs) ? ingredientsOrSpecs : undefined,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
    };

    const newProduct = await productService.createProduct(input);

    res.status(201).json({
      success: true,
      message: 'Product created successfully and published to live catalog.',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: 'Product ID is required.' });
      return;
    }

    const input: UpdateProductInput = {
      ...req.body,
    };

    if (input.price !== undefined) {
      input.price = Number(input.price);
    }
    if (input.originalPrice !== undefined) {
      input.originalPrice = Number(input.originalPrice);
    }
    if (input.stock !== undefined) {
      input.stock = Number(input.stock);
    }

    const updated = await productService.updateProduct(id, input);

    if (!updated) {
      res.status(404).json({
        success: false,
        message: `Product with ID '${id}' was not found.`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: 'Product ID is required.' });
      return;
    }

    const deleted = await productService.deleteProduct(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: `Product with ID '${id}' was not found.`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Product deleted successfully from catalog.',
      id,
    });
  } catch (error) {
    next(error);
  }
};
