require('dotenv').config()

tokenSecret = process.env.JWT_SECRET


module.exports = {
    tokenSecret
}
