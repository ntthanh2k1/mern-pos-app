import argon2 from "argon2";

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const hashPassword = async (password) => {
  return await argon2.hash(password);
};

const verifyPassword = async (hashedPassword, inputPassword) => {
  return await argon2.verify(hashedPassword, inputPassword);
};

const generateCode = (prefix = "") => {
  const now = new Date();

  const pad2 = (n) => n.toString().padStart(2, "0");

  const yyyy = now.getFullYear();
  const MM = pad2(now.getMonth() + 1);
  const dd = pad2(now.getDate());
  const HH = pad2(now.getHours());
  const mm = pad2(now.getMinutes());
  const ss = pad2(now.getSeconds());

  return `${prefix}${yyyy}${MM}${dd}${HH}${mm}${ss}`;
};

export { isValidEmail, hashPassword, verifyPassword, generateCode };
