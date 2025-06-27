module.exports = async function (message, recipes, items) {
    let recipeList = '📘 สูตรคราฟทั้งหมด:\n';
    for (const [key, recipe] of Object.entries(recipes)) {
        const requiresStr = recipe.requires.map(r => `${items[r].emoji} ${items[r].name}`).join(' + ');
        const resultStr = `${items[recipe.result].emoji} ${items[recipe.result].name}`;
        recipeList += `• \`${key}\`: ${requiresStr} ➜ ${resultStr}\n`;
    }
    return message.reply(recipeList);
};
