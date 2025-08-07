import { Request, Response } from "express";
import Vendor, { IVendor } from "../models/vendor.model";
import User from "../models/user.model";
import Product from "../models/product.model";

// Create new vendor
export const createVendor = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      businessName,
      businessType,
      businessDescription,
      contactPerson,
      email,
      phone,
      street,
      city,
      state,
      postalCode,
      latitude,
      longitude,
    } = req.body;

    // Check if user exists and is not already a vendor
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if vendor already exists for this user
    const existingVendor = await Vendor.findOne({ userId });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile already exists for this user",
      });
    }

    // Create vendor
    const vendor = new Vendor({
      userId,
      businessName,
      businessType,
      businessDescription,
      contactPerson,
      email,
      phone,
      address: {
        street,
        city,
        state,
        postalCode,
        latitude,
        longitude,
      },
      // Set default values
      isActive: true,
      isApproved: false,
      approvalStatus: "pending",
      kycStep: "business_details",
    });

    await vendor.save();

    // Update user role to vendor and onboardingStep
    await User.findByIdAndUpdate(userId, { role: "vendor", onboardingStep: "register" });

    res.status(201).json({
      success: true,
      message: "Vendor profile created successfully",
      data: vendor,
    });
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get vendor by ID
export const getVendorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id)
      .populate("userId", "name email mobile")
      .populate("categories", "name");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    console.error("Error getting vendor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get vendor by user ID
export const getVendorByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const vendor = await Vendor.findOne({ userId })
      .populate("userId", "name email mobile")
      .populate("categories", "name");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    console.error("Error getting vendor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all vendors with filters
export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      state,
      businessType,
      isApproved,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter: any = {};

    // Apply filters
    if (city) filter["address.city"] = new RegExp(city as string, "i");
    if (state) filter["address.state"] = new RegExp(state as string, "i");
    if (businessType) filter.businessType = businessType;
    if (isApproved !== undefined) filter.isApproved = isApproved === "true";
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    const vendors = await Vendor.find(filter)
      .populate("userId", "name email mobile")
      .populate("categories", "name")
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Vendor.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: vendors,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error getting vendors:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update vendor
export const updateVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData.isApproved;
    delete updateData.approvalStatus;
    delete updateData.totalOrders;
    delete updateData.completedOrders;
    delete updateData.totalRevenue;

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { ...updateData, lastActiveAt: new Date() },
      { new: true, runValidators: true }
    ).populate("userId", "name email mobile");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: vendor,
    });
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Approve/Reject vendor
export const updateVendorApproval = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approvalStatus, rejectionReason } = req.body;

    if (!["approved", "rejected", "suspended"].includes(approvalStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid approval status",
      });
    }

    const updateData: any = {
      approvalStatus,
      isApproved: approvalStatus === "approved",
    };

    if (approvalStatus === "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("userId", "name email mobile");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Vendor ${approvalStatus} successfully`,
      data: vendor,
    });
  } catch (error) {
    console.error("Error updating vendor approval:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get vendor statistics
export const getVendorStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Get product statistics
    const productStats = await Product.aggregate([
      { $match: { vendorId: vendor._id, isDeleted: false } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: [{ $eq: ["$isAvailable", true] }, 1, 0] } },
          totalStock: { $sum: "$stockQty" },
          averageRating: { $avg: "$ratings.average" },
        },
      },
    ]);

    // Get recent products
    const recentProducts = await Product.find({
      vendorId: vendor._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name price stockQty isAvailable");

    const stats = {
      vendor,
      productStats: productStats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        totalStock: 0,
        averageRating: 0,
      },
      recentProducts,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error getting vendor stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete vendor (soft delete)
export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Soft delete - set isActive to false
    vendor.isActive = false;
    vendor.approvalStatus = "suspended";
    await vendor.save();

    // Update user role back to customer
    await User.findByIdAndUpdate(vendor.userId, { role: "customer" });

    res.status(200).json({
      success: true,
      message: "Vendor deactivated successfully",
    });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Search vendors by location
export const searchVendorsByLocation = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius = 10, page = 1, limit = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const searchRadius = Number(radius);

    // Find vendors within radius (simplified calculation)
    const vendors = await Vendor.find({
      isActive: true,
      isApproved: true,
      "address.latitude": {
        $gte: lat - searchRadius / 111, // Rough conversion to degrees
        $lte: lat + searchRadius / 111,
      },
      "address.longitude": {
        $gte: lng - searchRadius / 111,
        $lte: lng + searchRadius / 111,
      },
    })
      .populate("userId", "name email mobile")
      .populate("categories", "name")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Vendor.countDocuments({
      isActive: true,
      isApproved: true,
      "address.latitude": {
        $gte: lat - searchRadius / 111,
        $lte: lat + searchRadius / 111,
      },
      "address.longitude": {
        $gte: lng - searchRadius / 111,
        $lte: lng + searchRadius / 111,
      },
    });

    res.status(200).json({
      success: true,
      data: vendors,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error searching vendors:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}; 