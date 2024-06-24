
function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = localStorage.getItem("authToken");
        if (!tokenCookieValue) {
            return next(); 
        }
        try{
            const userPayload = JWT.verify(token, secret);;
            req.user = userPayload;
            next(); 
        } catch (error) {               
            console.error("Token validation error:", error);
            res.status(401).json({ error: "Unauthorized" }); 
        }
    };
}



module.exports = {
    checkForAuthenticationCookie,
};
