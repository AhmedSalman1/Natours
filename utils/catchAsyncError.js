module.exports = (Func) => (req, res, next) => {
    Func(req, res, next).catch(next);
};
