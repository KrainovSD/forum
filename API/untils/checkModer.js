export default async (req, res, next) => {
  try {
    const role = req.role;
    if (!role || (role !== "admin" && role !== "moder"))
      return res.status(403).json("Не достаточно прав!");
    return next();
  } catch (e) {
    req.err = e;
    res.status(500).json();
  }
};
