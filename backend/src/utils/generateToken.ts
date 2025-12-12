import jwt from "jsonwebtoken";

const generateToken = (id: string, role: string = "user") => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "30d" }
  );
};

export default generateToken;