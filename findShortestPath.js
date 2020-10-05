const Cell = {
  EMPTY: 'empty',
  START: 'start',
  END: 'end',
  FILLED: 'filled',
  VALID: 'valid',
  INVALID: 'invalid',
  VISITED: 'visited',
  BLOCKED: 'blocked',
};

let newLocation;

// Start location will be in the following format:
// [distanceFromTop, distanceFromLeft]
const findShortestPath = (startCoordinates, grid) => {
  const distanceFromTop = startCoordinates[0];
  const distanceFromLeft = startCoordinates[1];

  // Each "location" will store its coordinates
  // and the shortest path required to arrive there
  const location = {
    distanceFromTop,
    distanceFromLeft,
    path: [],
    status: Cell.START,
  };

  // Initialize the queue with the start location already inside
  const queue = [location];

  // Loop through the grid searching for the goal
  while (queue.length > 0) {
    // Take the first location off the queue
    const currentLocation = queue.shift();

    // Explore up
    newLocation = exploreInDirection(currentLocation, 'up', grid);
    if (newLocation.status === Cell.END) {
      return newLocation.path;
    }
    if (newLocation.status === Cell.VALID) {
      queue.push(newLocation);
    }

    // Explore right
    newLocation = exploreInDirection(currentLocation, 'right', grid);
    if (newLocation.status === Cell.END) {
      return newLocation.path;
    }
    if (newLocation.status === Cell.VALID) {
      queue.push(newLocation);
    }

    // Explore bottom
    newLocation = exploreInDirection(currentLocation, 'bottom', grid);
    if (newLocation.status === Cell.END) {
      return newLocation.path;
    }
    if (newLocation.status === Cell.VALID) {
      queue.push(newLocation);
    }

    // Explore left
    newLocation = exploreInDirection(currentLocation, 'left', grid);
    if (newLocation.status === Cell.END) {
      return newLocation.path;
    }
    if (newLocation.status === Cell.VALID) {
      queue.push(newLocation);
    }
  }

  // No valid path found
  return false;
};

// This function will check a location's status
// (a location is "valid" if it is on the grid, is not an "obstacle",
// and has not yet been visited by our algorithm)
// Returns "Valid", "Invalid", "Blocked", or "Goal"
const locationStatus = (location, grid) => {
  const gridSize = grid.length;
  const dft = location.distanceFromTop;
  const dfl = location.distanceFromLeft;

  if (
    location.distanceFromLeft < 0 ||
    location.distanceFromLeft >= gridSize ||
    location.distanceFromTop < 0 ||
    location.distanceFromTop >= gridSize
  ) {
    // location is not on the grid--return false
    return Cell.INVALID;
  }
  if (grid[dft][dfl] === Cell.END) {
    return Cell.END;
  }
  if (grid[dft][dfl] !== Cell.EMPTY) {
    // location is either an obstacle or has been visited
    return Cell.BLOCKED;
  }
  return Cell.VALID;
};

// Explores the grid from the given location in the given
// direction
const exploreInDirection = (currentLocation, direction, grid) => {
  const newPath = currentLocation.path.slice();
  newPath.push(direction);

  let dft = currentLocation.distanceFromTop;
  let dfl = currentLocation.distanceFromLeft;

  if (direction === 'up') {
    dft -= 1;
  } else if (direction === 'right') {
    dfl += 1;
  } else if (direction === 'bottom') {
    dft += 1;
  } else if (direction === 'left') {
    dfl -= 1;
  }

  newLocation = {
    distanceFromTop: dft,
    distanceFromLeft: dfl,
    path: newPath,
    status: 'Unknown',
  };
  newLocation.status = locationStatus(newLocation, grid);

  // If this new location is valid, mark it as Cell.VISITED
  if (newLocation.status === Cell.VALID) {
    grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] =
      Cell.VISITED;
  }

  return newLocation;
};

module.exports = findShortestPath;
