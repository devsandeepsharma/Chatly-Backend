const sendOTP = async (req, res) => {
    res.send("<h1>OTP SEND</h1>");
}

const verifyOTP = async (req, res) => {
    res.send("<h1>OTP VERIFIED</h1>");
}

const setProfile = async (req, res) => {
    res.send("<h1>USER PROFILE SET</h1>");
}

const guestLogin = async (req, res) => {
    res.send("<h1>GUEST LOGIN</h1>");
}

module.exports = {
    sendOTP,
    verifyOTP,
    setProfile,
    guestLogin
};