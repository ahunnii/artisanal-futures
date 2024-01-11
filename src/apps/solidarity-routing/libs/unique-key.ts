export const getUniqueKey = async (obj: unknown) => {
  // Convert the object to a string using JSON.stringify
  const objString = JSON.stringify(obj);

  // Hash the string using a hash function (here, we use the built-in SHA-256 algorithm)
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(objString)
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Return the hashed string as the unique key
  return hashHex;
};
