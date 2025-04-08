exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('name level hearts');
  
    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        level: user.level,
        hearts: user.hearts,
      },
    });
  });