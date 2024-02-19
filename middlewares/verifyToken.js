const jwt= require('jsonwebtoken');

// Verify Token
function verifyToken(req, res, next) {
    const token = req.headers.token;
    if(token){
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
            red.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({message:"Invalid token"})
        }
    }else{
        res.status(401).json({message:"Invalid token"})
    }
};

// Verify Token & Authorize the user
function verifyTokenAndAuthorization(req, res, next){
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
         next()
        }else{
            return res.status(403).json({message:"You are not allowed to do that!"})
        }
    })
}

// Verify Token & Admin
function verifyTokenAndAdmin(req, res, next){
    verifyToken(req, res, () => {
        if( req.user.isAdmin){
         next()
        }else{
            return res.status(403).json({message:"You are not allowed to do that! only Admin can do that"})
        }
    })
}

module.exports ={
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
}