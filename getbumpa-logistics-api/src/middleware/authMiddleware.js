module.exports = (req, res, next) => {
    const apiKey = req.headers['authorization'];
    if (apiKey && apiKey === `Bearer ${process.env.API_KEY}`) {
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized' });
  };