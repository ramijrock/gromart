const VendorKYC = require("../models/vendorKyc");

exports.saveStoreOnwerInfo = async (req, res) => {
    const { userId, ownerName, phoneNumber, ownerEmail, ownerPan, ownerAadhar, city, state } = req.body;

    if (!ownerName || !phoneNumber || !ownerEmail || !ownerPan || !ownerAadhar || !city || !state) {
        return res.status(400).json({ message: 'All fields are required' });
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
                    state
                },
                kycStepCompleted: 1
            });
        } else {
            existVendorKYC.storeOwnerInfo = {
                ownerName,
                phoneNumber,
                ownerEmail,
                ownerPan,
                ownerAadhar,
                city,
                state
            };
            existVendorKYC.kycStepCompleted = Math.max(existVendorKYC.kycStepCompleted, 1);
        }

        await existVendorKYC.save();

        return res.status(200).json({
            success: true,
            message: 'Store owner information saved successfully',
            data: existVendorKYC
        });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.saveStoreInfo = async (req, res) => {
    const { userId, storeName, storeAddress, storeEmail, storePhone, latitude, longitude, storeDescription, storeImage } = req.body;

    if (!storeName || !storeAddress || !storeEmail || !storePhone || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required' });
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
                        longitude
                    },
                    storeDescription,
                    storeImage
                },
                kycStepCompleted: 2 // Set kycStepCompleted to 2 for store info step
            });
        } else {
            vendorKYC.storeInfo = {
                storeName,
                storeAddress,
                storeEmail,
                storePhone,
                location: {
                    latitude,
                    longitude
                },
                storeDescription,
                storeImage
            };
            vendorKYC.kycStepCompleted = Math.max(vendorKYC.kycStepCompleted, 2);
        }

        await vendorKYC.save();

        return res.status(200).json({
            success: true,
            message: 'Store information saved successfully',
            data: vendorKYC
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.saveBankInfo = async (req, res) => {
    const { userId, bankName, accountNumber, branchName, ifscNumber } = req.body;

    if (!bankName || !accountNumber || !branchName || !ifscNumber) {
        return res.status(400).json({ message: 'All fields are required' });
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
                    ifscNumber
                },
                kycStepCompleted: 3 
            });
        } else {
            vendorKYC.storeInfo = {
                bankName, 
                accountNumber, 
                branchName, 
                ifscNumber
            };
            vendorKYC.kycStepCompleted = Math.max(vendorKYC.kycStepCompleted, 3);
        }

        await vendorKYC.save();

        return res.status(200).json({
            success: true,
            message: 'Bank information saved successfully',
            data: vendorKYC
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};