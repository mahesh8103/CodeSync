import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError}  from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary}  from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt  from "jsonwebtoken";
import { 
    otpEmailTemplate, 
    welcomeEmailTemplate, 
    resetPasswordEmailTemplate 
} from "../utils/emailTemplates.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";


const generateAccessTokenAndRefreshToken = async(userId)=>{
      try {
            const user = await User.findById(userId)
            const accessToken = await user.generateAccessToken()
            const refreshToken = await user.generateRefreshToken()

            user.refreshToken = refreshToken
            await user.save( {validateBeforeSave: false } )
            return {accessToken ,refreshToken}
            
      } catch (error) {
            throw new ApiError(500,"something went wrong while generating access and refresh token")
      }
}

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};


const registerUser = asyncHandler(async (req,res)=>{

   const {fullName,email,password} = req.body
//    console.log("fullName: ",fullName,"email: ",email)

   if([fullName,email,password].some((fields)=>fields?.trim()==="")){
      throw new ApiError(400,"all fields are required")
   }
     
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Please enter a valid email");
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters");
    }

   const existedUser = await User.findOne({ email: email.toLowerCase() })
if (existedUser) {
        if (!existedUser.isVerified) {
            await User.findByIdAndDelete(existedUser._id);
        } else {
            throw new ApiError(409, "User with this email already exists");
        }
    }

const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password
})
 const otp = user.generateOTP();
 await user.save({ validateBeforeSave: false });

   await sendEmail({
        email: user.email,
        subject: "CodeSync - Verify Your Email",
        message: otpEmailTemplate(otp, user.fullName)
    });

const createdUser = await User.findById(user._id).select( "-password -refreshToken -otp -otpExpiry" )
if (!createdUser) {
      throw new ApiError(500,"something went wrong while ragistering user")
}

return res.status(201).json(
      new ApiResponse(201,createdUser,"Registration successful! Please check your email for OTP verification.")
)

});

const verifyOTP = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "Email is already verified");
    }


    if (!user.otp || !user.otpExpire) {
        throw new ApiError(400, "No OTP found. Please request a new one");
    }

  
    const isValidOTP = user.verifyOTP(otp);

    if (!isValidOTP) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    user.isVerified = true;
    user.clearOTP();
    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user.email,
        subject: "Welcome to CodeSync! 🎉",
        message: welcomeEmailTemplate(user.fullName)
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Email verified successfully! You can now login"
        )
    );
});

const resendOTP = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "Email is already verified");
    }

    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user.email,
        subject: "CodeSync - New OTP",
        message: otpEmailTemplate(otp, user.fullName)
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "New OTP sent to your email")
    );
});


const loginUser = asyncHandler(async(req,res)=>{
        const {email,password} = req.body
        if (!email) {
            throw new ApiError(400,"email is required")
        }
        if (!password) {
            throw new ApiError(400,"please enter password")
        }
        const userExist = await User.findOne({
            email: email.toLowerCase()
        })
        if (!userExist) {
            throw new ApiError(400,"user not exist plz sigun up first")
        }
        if (!userExist.isVerified) {
        throw new ApiError(403, "Please verify your email first");
         }
         const isPasswordValid = await userExist.isPasswordCorrect(password)
         if (!isPasswordValid) {
            throw new ApiError(401,"Invalid user credential")
         }
         const {accessToken ,refreshToken} = await generateAccessTokenAndRefreshToken(userExist._id)
         
         const loggedInUser = await User.findById(userExist._id).select("-password -refreshToken -otp -otpExpiry -resetPasswordToken -resetPasswordExpire")
         
         return res.status(200)
         .cookie("accessToken",accessToken,cookieOptions)
         .cookie("refreshToken",refreshToken,cookieOptions)
         .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"usser logged in successfully"))

})

const logoutUser = asyncHandler(async(req,res)=>{

      await User.findByIdAndUpdate(
            req.user._id,
            {
                  $unset:{refreshToken:1}
                 
            }, {new:true}
            
      )
      
      return res.status(200)
      .clearCookie("accessToken",cookieOptions)
      .clearCookie("refreshToken",cookieOptions)
      .json(
            new ApiResponse(200,{},"user logout successfully")
      )
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
      const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
      if (!incomingRefreshToken) {
            throw new ApiError(401,"unauthorized request")
      }
    try {
        const decodedtoken =  jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  
        const user = await User.findById(decodedtoken._id)
        if (!user) {
              throw new ApiError(401,"invalid refresh token")
        }
        if(incomingRefreshToken!==user?.refreshToken){
              throw new ApiError(401,"refresh token is expired or used")
        }
        const{accessToken ,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
  
        return res.status(200)
        .cookie("accessToken",accessToken,cookieOptions)
        .cookie("refreshToken",refreshToken,cookieOptions)
        .json(
              new ApiResponse(201,{accessToken,refreshToken},"accessToken refreshed")
        )
    } catch (error) {
      throw new ApiError(403,error?.message || "invalid request")
    }
})

const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "No account found with this email");
    }
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); 

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
        email: user.email,
        subject: "CodeSync - Reset Your Password",
        message: resetPasswordEmailTemplate(resetUrl, user.fullName)
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset link sent to your email")
    );
});


const resetPassword = asyncHandler(async (req, res) => {

    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        throw new ApiError(400, "New password is required");
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters");
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

        const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset successful! You can now login")
    );
});


const changeCurrentPassword = asyncHandler(async(req,res)=>{
      const {oldPassword ,newPassword} = req.body
       if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old and new password are required");
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters");
    }
      const user =  await User.findById(req.user._id)
      const validPassword = await user.isPasswordCorrect(oldPassword)
      if (!validPassword) {
            throw new ApiError(400,"plz enter correct password")
      }
      user.password = newPassword
      await user.save({validateBeforeSave:false})
      return res
      .status(200)
      .json(
            new ApiResponse(201,{},"password change successfully")
      )
      


})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current user fetched successfully")
        );
});

const updateProfile  = asyncHandler(async(req,res)=>{
      const {fullName ,email} = req.body
      const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                 $set: {
                          fullName,
                          email
                  }
            },
            {new:true}
      ).select("-password -refreshToken -otp -otpExpire")

      return res
      .status(200)
      .json(new ApiResponse(201,user,"user details updated successfully"))
})


const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Please upload avatar file");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar?.url) {
        throw new ApiError(400, "Error while uploading avatar on cloudinary");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar changed successfully"));
});


export {registerUser,
      verifyOTP,
      resendOTP,
      loginUser,
      logoutUser,
      refreshAccessToken,
      forgotPassword,
      resetPassword,
      changeCurrentPassword,
      getCurrentUser,
      updateProfile,
      updateUserAvatar,
      }