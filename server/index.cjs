// server/index.cjs
const jwt = require("jsonwebtoken");
const fs = require("fs");
const http = require("http");
const path = require("path");

const SECRET_KEY = process.env.JWT_SECRET || "shaurma-secret-key-2024";
const DB_PATH = path.join(__dirname, "db.json");

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
}

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    const json = JSON.parse(raw);
    return {
      users: Array.isArray(json.users) ? json.users : [],
    };
  } catch (err) {
    console.error("Ошибка чтения db.json:", err.message);
    return { users: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Ошибка записи db.json:", err.message);
  }
}

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "24h",
  });
}

function getJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        const json = JSON.parse(body);
        resolve(json);
      } catch (err) {
        reject(new Error("Невалидный JSON"));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, "http://localhost");
  const pathname = url.pathname;
  const method = req.method;

  console.log(`${method} ${pathname}`);

  try {
    if (pathname === "/api/register" && method === "POST") {
      const body = await getJsonBody(req);
      const email = body.email;
      const password = body.password;

      if (!email || !password) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: "Email и пароль обязательны" }));
        return;
      }

      const db = readDB();
      // Защита: проверяем, что у пользователя есть email
      const exists = db.users.some(
        (u) => u.email && u.email.toLowerCase() === email.toLowerCase(),
      );
      if (exists) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            message: "Пользователь с таким email уже существует",
          }),
        );
        return;
      }

      const newUser = {
        id: String(Date.now()),
        email,
        password,
        username: email.split("@")[0],
      };

      db.users.push(newUser);
      writeDB(db);

      const token = generateToken(newUser);
      res.writeHead(200);
      res.end(JSON.stringify({ username: newUser.username, token }));
      return;
    }

    if (pathname === "/api/login" && method === "POST") {
      const body = await getJsonBody(req);
      const email = body.email;
      const password = body.password;

      if (!email || !password) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: "Email и пароль обязательны" }));
        return;
      }

      const db = readDB();
      const user = db.users.find(
        (u) =>
          u.email &&
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );

      if (!user) {
        res.writeHead(401);
        res.end(JSON.stringify({ message: "Неверный email или пароль" }));
        return;
      }

      const token = generateToken(user);
      res.writeHead(200);
      res.end(JSON.stringify({ username: user.username, token }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ message: "Not Found" }));
  } catch (err) {
    console.error("Ошибка сервера:", err.message);
    res.writeHead(500);
    res.end(JSON.stringify({ message: "Внутренняя ошибка сервера" }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`[Сервер] запущен на http://localhost:${PORT}`);
});
