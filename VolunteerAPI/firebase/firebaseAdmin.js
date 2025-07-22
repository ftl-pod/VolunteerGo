const admin = require("firebase-admin");
const fs = require("fs");

let serviceAccount;

if (process.env.NODE_ENV === "production") {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = JSON.parse(
    fs.readFileSync("firebase/serviceAccountKey.json", "utf8")
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;