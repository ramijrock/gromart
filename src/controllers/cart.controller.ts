import { Request, Response } from "express";
import { Types } from "mongoose";
import Cart, { ICart, ICartItem } from "../models/cart.model";
import Product from "../models/product.model";
import User from "../models/user.model";

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = (req as any).user._id;

    // Validate product exists and is available
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    if (product.stockQty < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find existing cart or create new one
    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      // Create new cart
      const cartItem: ICartItem = {
        productId: product._id as Types.ObjectId,
        quantity,
        price: product.price,
        discount: product.discount || 0,
        finalPrice: product.finalPrice || product.price,
      };

      cart = new Cart({
        userId,
        vendorId: product.vendorId,
        items: [cartItem],
      });
    } else {
      // Check if product is from same vendor (one vendor per cart)
      if (cart.vendorId && cart.vendorId.toString() !== product.vendorId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Cannot add products from different vendors to the same cart",
        });
      }

      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update quantity if product already exists
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        
        if (product.stockQty < newQuantity) {
          return res.status(400).json({
            success: false,
            message: "Insufficient stock available for requested quantity",
          });
        }

        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Add new item to cart
        const cartItem: ICartItem = {
          productId: product._id as Types.ObjectId,
          quantity,
          price: product.price,
          discount: product.discount || 0,
          finalPrice: product.finalPrice || product.price,
        };
        cart.items.push(cartItem);
      }

      // Set vendorId if not already set
      if (!cart.vendorId) {
        cart.vendorId = product.vendorId;
      }
    }

    await cart.save();

    // Populate product details for response
    await cart.populate("items.productId", "name price finalPrice images stockQty isAvailable");

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = (req as any).user._id;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Check stock availability
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stockQty < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available",
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate product details for response
    await cart.populate("items.productId", "name price finalPrice images stockQty isAvailable");

    res.status(200).json({
      success: true,
      message: "Cart item quantity updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = (req as any).user._id;

    // Find user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    // If cart is empty, set vendorId to null
    if (cart.items.length === 0) {
      cart.vendorId = undefined;
    }

    await cart.save();

    // Populate product details for response
    await cart.populate("items.productId", "name price finalPrice images stockQty isAvailable");

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Clear cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    // Find and clear user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.vendorId = undefined;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get user's cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    // Find user's cart with populated product details
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price finalPrice images stockQty isAvailable description",
    });

    if (!cart) {
      // Return empty cart structure
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: {
          userId,
          items: [],
          cartTotal: 0,
          itemCount: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get cart summary (for quick overview)
export const getCartSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          itemCount: 0,
          cartTotal: 0,
          hasItems: false,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        itemCount: cart.itemCount,
        cartTotal: cart.cartTotal,
        hasItems: cart.items.length > 0,
        vendorId: cart.vendorId,
      },
    });
  } catch (error) {
    console.error("Error getting cart summary:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Cart analytics (for admin/vendor insights)
export const getCartAnalytics = async (req: Request, res: Response) => {
  try {
    const { period = "7d" } = req.query; // 7d, 30d, 90d
    const user = (req as any).user;

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Build filter based on user role
    const filter: any = {
      createdAt: { $gte: startDate },
    };

    if (user.role === "vendor") {
      // Vendors can only see analytics for their products
      const vendorProducts = await Product.find({ vendorId: user._id }).select("_id");
      const productIds = vendorProducts.map((p) => p._id);
      
      filter["items.productId"] = { $in: productIds };
    }

    // Get cart analytics
    const analytics = await Cart.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalCarts: { $sum: 1 },
          totalItems: { $sum: "$itemCount" },
          totalValue: { $sum: "$cartTotal" },
          averageCartValue: { $avg: "$cartTotal" },
          averageItemsPerCart: { $avg: "$itemCount" },
        },
      },
    ]);

    // Get most popular products in carts
    const popularProducts = await Cart.aggregate([
      { $match: filter },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalQuantity: { $sum: "$items.quantity" },
          totalValue: { $sum: { $multiply: ["$items.finalPrice", "$items.quantity"] } },
          cartCount: { $sum: 1 },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productId: "$_id",
          productName: "$product.name",
          totalQuantity: 1,
          totalValue: 1,
          cartCount: 1,
        },
      },
    ]);

    const result = {
      period,
      summary: analytics[0] || {
        totalCarts: 0,
        totalItems: 0,
        totalValue: 0,
        averageCartValue: 0,
        averageItemsPerCart: 0,
      },
      popularProducts,
    };

    res.status(200).json({
      success: true,
      message: "Cart analytics retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error getting cart analytics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get abandoned carts (carts not updated in last 24 hours)
export const getAbandonedCarts = async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query;
    const user = (req as any).user;

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const filter: any = {
      updatedAt: { $lt: yesterday },
      itemCount: { $gt: 0 },
    };

    if (user.role === "vendor") {
      // Vendors can only see abandoned carts with their products
      const vendorProducts = await Product.find({ vendorId: user._id }).select("_id");
      const productIds = vendorProducts.map((p) => p._id);
      
      filter["items.productId"] = { $in: productIds };
    }

    const abandonedCarts = await Cart.find(filter)
      .populate("userId", "name email")
      .populate("items.productId", "name price finalPrice")
      .sort({ updatedAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "Abandoned carts retrieved successfully",
      data: abandonedCarts,
    });
  } catch (error) {
    console.error("Error getting abandoned carts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}; 