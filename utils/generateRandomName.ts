export function generateRandomName() {
    const adjectives = ["Eco", "Aqua", "Blue", "Green", "Smart", "Fresh", "Save"];
    const nouns = ["Hero", "Drop", "Wave", "Flow", "Saver", "Spirit", "Guardian"];
    const number = Math.floor(Math.random() * 999);

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adj}${noun}_${number}`;
}
