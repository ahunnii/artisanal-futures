export function formatWord(word: string): string {
  // Convert the word to lowercase and replace underscores with spaces
  const formattedWord = word.toLowerCase().replace(/_/g, " ");

  // Use regex to capitalize the first letter of each word
  return formattedWord.replace(/\b\w/g, (char) => char.toUpperCase());
}
