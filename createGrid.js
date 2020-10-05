const find = require('lodash/find');

const createGrid = (rowCount, colCount, nodes) => {
  const grid = [];

  for (let i = 0; i < rowCount; i++) {
    grid[i] = [];
    for (let j = 0; j < colCount; j++) {
      const node = find(nodes, { x: `${i}`, y: `${j}` });

      if (node) {
        grid[i][j] = node.type;
      } else {
        grid[i][j] = 'empty';
      }
    }
  }

  return grid;
};

module.exports = createGrid;
