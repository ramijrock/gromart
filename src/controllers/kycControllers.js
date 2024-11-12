const upload = require("../middleware/uploadMiddleWare");
const VendorKYC = require("../models/vendorKyc");

exports.saveStoreOnwerInfo = async (req, res) => {
  const {
    userId,
    ownerName,
    phoneNumber,
    ownerEmail,
    ownerPan,
    ownerAadhar,
    city,
    state,
  } = req.body;

  if (
    !ownerName ||
    !phoneNumber ||
    !ownerEmail ||
    !ownerPan ||
    !ownerAadhar ||
    !city ||
    !state
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let existVendorKYC = await VendorKYC.findOne({ userId });

    if (!existVendorKYC) {
      existVendorKYC = new VendorKYC({
        userId,
        storeOwnerInfo: {
          ownerName,
          phoneNumber,
          ownerEmail,
          ownerPan,
          ownerAadhar,
          city,
          state,
        },
        kycStepCompleted: 1,
      });
    } else {
      existVendorKYC.storeOwnerInfo = {
        ownerName,
        phoneNumber,
        ownerEmail,
        ownerPan,
        ownerAadhar,
        city,
        state,
      };
      existVendorKYC.kycStepCompleted = Math.max(
        existVendorKYC.kycStepCompleted,
        1
      );
    }

    await existVendorKYC.save();

    return res.status(200).json({
      success: true,
      message: "Store owner information saved successfully",
      data: existVendorKYC,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.saveStoreInfo = async (req, res) => {
  const {
    userId,
    storeName,
    storeAddress,
    storeEmail,
    storePhone,
    latitude,
    longitude,
    storeDescription,
    storeImage,
  } = req.body;

  if (
    !storeName ||
    !storeAddress ||
    !storeEmail ||
    !storePhone ||
    !latitude ||
    !longitude
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let vendorKYC = await VendorKYC.findOne({ userId });

    if (!vendorKYC) {
      vendorKYC = new VendorKYC({
        userId,
        storeInfo: {
          storeName,
          storeAddress,
          storeEmail,
          storePhone,
          location: {
            latitude,
            longitude,
          },
          storeDescription,
          storeImage,
        },
        kycStepCompleted: 2, // Set kycStepCompleted to 2 for store info step
      });
    } else {
      vendorKYC.storeInfo = {
        storeName,
        storeAddress,
        storeEmail,
        storePhone,
        location: {
          latitude,
          longitude,
        },
        storeDescription,
        storeImage,
      };
      vendorKYC.kycStepCompleted = Math.max(vendorKYC.kycStepCompleted, 2);
    }

    await vendorKYC.save();

    return res.status(200).json({
      success: true,
      message: "Store information saved successfully",
      data: vendorKYC,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.saveBankInfo = async (req, res) => {
  const { userId, bankName, accountNumber, branchName, ifscNumber } = req.body;

  if (!bankName || !accountNumber || !branchName || !ifscNumber) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    let vendorKYC = await VendorKYC.findOne({ userId });

    if (!vendorKYC) {
      vendorKYC = new VendorKYC({
        userId,
        bankInfo: {
          bankName,
          accountNumber,
          branchName,
          ifscNumber,
        },
        kycStepCompleted: 3,
      });
    } else {
      vendorKYC.bankInfo = {
        bankName,
        accountNumber,
        branchName,
        ifscNumber,
      };
      vendorKYC.kycStepCompleted = Math.max(vendorKYC.kycStepCompleted, 3);
    }

    await vendorKYC.save();

    return res.status(200).json({
      success: true,
      message: "Bank information saved successfully",
      data: vendorKYC,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const uploadFields = upload.fields([
  { name: "panImage", maxCount: 1 },
  { name: "aadharImage", maxCount: 1 },
]);

exports.saveUploadDocs = async (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const { userId } = req.body;
    const panImage = req.files["panImage"] ? req.files["panImage"][0].path : null;
    const aadharImage = req.files["aadharImage"] ? req.files["aadharImage"][0].path : null;

    if (!panImage || !aadharImage) {
      return res.status(400).json({ success: false, message: "Both PAN and Aadhar images are required" });
    }

    try {
      let vendorKYC = await VendorKYC.findOne({ userId });

      if (!vendorKYC) {
        vendorKYC = new VendorKYC({
          userId,
          storeOwnerInfo: {
            panImage,
            aadharImage,
          },
          kycStepCompleted: 4,
        });
      } else {
        vendorKYC.storeOwnerInfo.panImage = panImage;
        vendorKYC.storeOwnerInfo.aadharImage = aadharImage;
        vendorKYC.kycStepCompleted = Math.max(vendorKYC.kycStepCompleted, 4);
      }

      await vendorKYC.save();

      return res.status(200).json({
        success: true,
        message: "Document images saved successfully",
        data: vendorKYC,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
}
