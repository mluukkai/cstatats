const fs = require("fs");

const hy_rows = fs.readFileSync("./hy.csv", "utf-8").split("\n");
const uh_rows = fs.readFileSync("./uh.csv", "utf-8").split("\n");

console.log("[");

for (let row of hy_rows) {
  const parts = row.split(",");
  const stud = parts[2];
  if (stud && stud.length === 9 && stud[0] === "0") {
    console.log(` '${stud}',`);
  }
}

for (let row of uh_rows) {
  const parts = row.split(",");
  const stud = parts[2];
  if (stud && stud.length === 9 && stud[0] === "0") {
    console.log(` '${stud}',`);
  }
}

console.log("]");
