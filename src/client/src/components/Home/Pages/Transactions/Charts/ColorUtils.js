export const baseColors = {
    INCOME: '#7eb3ff',
    EXPENSE: '#FF7272'
};

export const generateColor = type => {
    const color = {
        green: Math.floor(Math.random() * 200),
        red: Math.floor(Math.random() * 100),
        blue: Math.floor(Math.random() * 200)
    };
    if (type === 'Income') {
        color.blue = 255;
    } else if (type === 'Expense') {
        color.red = 255;
    }
    return color;
}

export const generateBackgroundColor = (type, opacity = 0.4) => {
    const color = generateColor(type);
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${opacity})`;
};

export const generateBorderColor = type => {
    const color = generateColor(type);
    return `rgb(${color.red}, ${color.green}, ${color.blue})`;
};
