export function checkID(req, res, next) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send("ID không hợp lệ");
  }
  next();
}

export function checkReqBody(req, res, next) {
  const { name, age } = req.body;
  if (!name || !age) {
    return res.status(400).send("Thiếu thông tin name hoặc age");
  }
  if (!isNaN(name)) {
    return res.status(400).send("Tên không hợp lệ");
  }
  if (typeof age !== "number") {
    return res.status(400).send("Age không hợp lệ");
  }
  next();
}
