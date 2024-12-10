console.log("hola, ¿en qué año naciste?");

process.stdin.on("data", (data) => {
  const currentYear = new Date().getFullYear();
  const birthYear = parseInt(data);

  if (!birthYear) {
    console.log("pon un año de verdad :(");
    return;
  }

  if (currentYear - birthYear >= 18) {
    console.log("eres mayor de edad, a beber!");
  } else {
    console.log("eres menor de edad, a beber también (agua)!");
  }
  process.exit(0);
});
