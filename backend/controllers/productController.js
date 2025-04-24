import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;

    console.log("fetched products", products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error getProducts", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const newProduct = await sql`
      INSERT INTO products (name, price, image)
      VALUES (${name}, ${price}, ${image})
      RETURNING *
    `;

    console.log("New Product Added", newProduct);
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.log("Error createProducts", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
      SELECT * FROM products
      WHERE id = ${id}
    `;

    if (product.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error getProduct", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  try {
    const product = await sql`
      UPDATE products
      SET name=${name}, price=${price}, image=${image}
      WHERE id=${id}
      RETURNING *
    `;

    if (product.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error updateProduct", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
      DELETE FROM products
      WHERE id=${id}
      RETURNING *
    `;

    if (product.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error deleteProduct", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
