const items = {
    apple: { emoji: '🍎', name: 'Apple', edible: { hunger: 15, water: 0 } },
    knife: { emoji: '🔪', name: 'Knife' },
    potion: { emoji: '🧪', name: 'Potion' },
    bread: { emoji: '🥖', name: 'Bread', edible: { hunger: 25, water: -5 } },
};

const recipes = {
    knife: {
        requires: ['apple', 'apple'],
        result: 'knife',
    },
    potion: {
        requires: ['apple', 'knife'],
        result: 'potion',
    },
};

function resolveItemKey(input) {
    if (!input) return null;
    const lowerInput = input.trim().toLowerCase();
    return Object.keys(items).find(key => {
        const { emoji, name } = items[key];
        return (
            key === lowerInput ||
            name.toLowerCase() === lowerInput ||
            emoji === input.trim()
        );
    }) || null;
}

function hasEnoughItems(inventory, requires) {
    const temp = [...inventory];
    for (const req of requires) {
        const index = temp.indexOf(req);
        if (index === -1) return false;
        temp.splice(index, 1);
    }
    return true;
}

module.exports = { items, recipes, resolveItemKey, hasEnoughItems };
