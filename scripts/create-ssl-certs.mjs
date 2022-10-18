import devcert from "devcert";
import fs from "fs";

if (!fs.existsSync("./certs")) {
  fs.mkdirSync("./certs");
}

const domains = ["saladscan.local"];

devcert
  .certificateFor(domains, { getCaPath: true })
  .then(({ key, cert, caPath }) => {
    fs.writeFileSync("./certs/devcert.key", key);
    fs.writeFileSync("./certs/devcert.cert", cert);
    fs.writeFileSync("./certs/.capath", caPath);
  })
  .catch(console.error);
