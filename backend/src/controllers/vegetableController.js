import Vegetable from '../models/Vegetable.js';

export const listVegetables = async (req, res) => {
  const items = await Vegetable.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(items);
};

export const getVegetable = async (req, res) => {
  const item = await Vegetable.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Vegetable not found' });
  res.json(item);
};

export const createVegetable = async (req, res) => {
  try {
    let { name, price } = req.body;

    // Convert price to number and add 50%
    price = Number(price);
    const updatedPrice = price + price * 0.5; // 50% increase

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Create vegetable with updated price
    const veg = await Vegetable.create({ name, price: updatedPrice, imageUrl });

    res.status(201).json(veg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


// export const updateVegetable = async (req, res) => {
//   const { name, price, isActive } = req.body;
//   const veg = await Vegetable.findById(req.params.id);
//   if (!veg) return res.status(404).json({ message: 'Vegetable not found' });
//   if (name !== undefined) veg.name = name;
//   if (price !== undefined) veg.price = price;
//   if (isActive !== undefined) veg.isActive = isActive;
//   if (req.file) veg.imageUrl = `/uploads/${req.file.filename}`;
//   await veg.save();
//   res.json(veg);
// };
export const updateVegetable = async (req, res) => {
  try {
    const { name, price, isActive } = req.body;
    const veg = await Vegetable.findById(req.params.id);

    if (!veg) return res.status(404).json({ message: 'Vegetable not found' });

    if (name !== undefined) veg.name = name;

    if (price !== undefined) {
      const numericPrice = Number(price);
      veg.price = numericPrice + numericPrice * 0.5; // add 50%
    }

    if (isActive !== undefined) veg.isActive = isActive;

    if (req.file) veg.imageUrl = `/uploads/${req.file.filename}`;

    await veg.save();
    res.json(veg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


export const removeVegetable = async (req, res) => {
  const veg = await Vegetable.findById(req.params.id);
  if (!veg) return res.status(404).json({ message: 'Vegetable not found' });
  await veg.deleteOne();
  res.json({ message: 'Deleted' });
};
