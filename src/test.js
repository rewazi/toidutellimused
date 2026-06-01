// ============================================
// AUTOMAATTESTID
// Käivita: node src/test.js
// Testib kõiki API endpointe
// ============================================

const http = require("http");

const BASE_URL = "http://localhost:3000";
let passed = 0;
let failed = 0;
let token = null;

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function test(name, condition, actual) {
  if (condition) {
    console.log(`  PASS: ${name}`);
    passed++;
  } else {
    console.log(`  FAIL: ${name} — saadi: ${JSON.stringify(actual)}`);
    failed++;
  }
}

async function runTests() {
  console.log("\nKäivitan automaatteste...\n");

  // Test 1: Tervise kontroll
  console.log("1. Tervise kontroll");
  try {
    const res = await request("GET", "/health");
    test("Server vastab", res.status === 200, res.status);
    test("Staatus on ok", res.body.status === "ok", res.body.status);
  } catch {
    test("Server vastab", false, "ühendus ebaõnnestus");
  }

  // Test 2: Menüü
  console.log("\n2. Menüü");
  try {
    const res = await request("GET", "/api/menu");
    test("Menüü laaditakse", res.status === 200, res.status);
    test("Menüüs on tooteid", res.body.menu && res.body.menu.length > 0, res.body);
  } catch {
    test("Menüü laaditakse", false, "viga");
  }

  // Test 3: Kasutaja registreerimine
  console.log("\n3. Kasutaja registreerimine");
  try {
    const res = await request("POST", "/api/users/signup", {
      name: "Test Kasutaja",
      username: `test_${Date.now()}`,
      password: "1234",
    });
    test("Registreerimine õnnestus", res.status === 201, res.status);
    test("Token on olemas", res.body.token !== undefined, res.body);
  } catch {
    test("Registreerimine õnnestus", false, "viga");
  }

  // Test 4: Sisselogimine
  console.log("\n4. Sisselogimine");
  try {
    const res = await request("POST", "/api/users/login", {
      username: "mari",
      password: "1234",
    });
    test("Sisselogimine õnnestus", res.status === 200, res.status);
    test("Token on olemas", res.body.token !== undefined, res.body);
    token = res.body.token;
  } catch {
    test("Sisselogimine õnnestus", false, "viga");
  }

  // Test 5: Vale parool
  console.log("\n5. Vale parool");
  try {
    const res = await request("POST", "/api/users/login", {
      username: "mari",
      password: "vale_parool",
    });
    test("Vale parool tagastab 401", res.status === 401, res.status);
  } catch {
    test("Vale parool tagastab 401", false, "viga");
  }

  // Test 6: Tellimuse loomine
  console.log("\n6. Tellimuse loomine");
  if (token) {
    try {
      const res = await request(
        "POST",
        "/api/orders",
        { items: [{ menuId: 1, quantity: 2 }, { menuId: 3, quantity: 1 }] },
        { Authorization: token }
      );
      test("Tellimus loodud", res.status === 201, res.status);
      test("Tellimus on vastu võetud", res.body.order && res.body.order.status === "vastu võetud", res.body);
      test("Kogusumma on õige", res.body.order && res.body.order.total > 0, res.body);
    } catch {
      test("Tellimus loodud", false, "viga");
    }
  } else {
    test("Tellimus loodud", false, "token puudub");
  }

  // Test 7: Tellimus ilma tokenita
  console.log("\n7. Tellimus ilma tokenita");
  try {
    const res = await request("POST", "/api/orders", {
      items: [{ menuId: 1, quantity: 1 }],
    });
    test("Ilma tokenita tagastab 401", res.status === 401, res.status);
  } catch {
    test("Ilma tokenita tagastab 401", false, "viga");
  }

  // Kokkuvõte
  console.log(`\nTulemused: ${passed} läbis, ${failed} ebaõnnestus`);

  if (failed === 0) {
    console.log("Kõik testid läbisid!");
    process.exit(0);
  } else {
    console.log("Mõned testid ebaõnnestusid!");
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Testide käivitamine ebaõnnestus:", err.message);
  process.exit(1);
});
