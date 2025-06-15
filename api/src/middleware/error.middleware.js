const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: `Error in ${err.methodName} module: ${err.message}`,
  });
};

export default errorHandler;
