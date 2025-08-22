module.exports = {
    jwt :{
        secret : process.env.JWT_SECRE,
        expiresIn : '1h'
    }
}