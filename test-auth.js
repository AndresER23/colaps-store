const NextAuth = require("next-auth").default || require("next-auth");
console.log("NextAuth exports:", Object.keys(require("next-auth")));

try {
  const result = NextAuth({ providers: [] });
  console.log("Result of NextAuth({}):", Object.keys(result));
  console.log("Handlers:", result.handlers);
} catch (err) {
  console.log("Error calling NextAuth:", err);
}
