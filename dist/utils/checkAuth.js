import jwt from "jsonwebtoken";
const checkAuth = (req, res, next) => {
    var _a;
    const token = (((_a = req.headers.authentication) === null || _a === void 0 ? void 0 : _a.toString()) || "").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decoded = jwt.verify(token, "secret123");
            req.userId = decoded._id;
            next();
        }
        catch (error) {
            console.log(error, "Нет доступа");
            res.status(403).json({
                message: "Нет доступа",
            });
        }
    }
    else {
        res.status(402).json({
            message: "Нет доступа!",
        });
    }
};
export { checkAuth };
