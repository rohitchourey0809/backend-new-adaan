const twilio = require("twilio");
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_SERVICE_SID,
} = require("../config");

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Helper function to format phone number to E.164
const formatPhoneNumber = (phone) => {
  if (phone.startsWith("+")) {
    return phone;
  }
  return `+${phone}`;
};

const sendOtp = async (phone) => {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const response = await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verifications.create({ to: formattedPhone, channel: "sms" });
    console.log("OTP send response:", response);
    return response;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

const verifyOtp = async (phone, code) => {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const response = await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: formattedPhone, code });
    console.log("OTP verification response:", response);
    return response;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

module.exports = { sendOtp, verifyOtp };
