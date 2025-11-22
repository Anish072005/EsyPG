export const addPg = async (req, res) => {
  try {
    const images = req.files.map((file) => file.path);

    const pg = new PG({
      ...req.body,
      images,
      broker: req.user._id,
      brokerEmail: req.user.email
    });

    await pg.save();
    res.status(201).json(pg);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};
