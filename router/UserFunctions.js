import fs from 'fs';

const userDataFilePath = 'userdata.json';

function readUserData() {
  try {
    const data = fs.readFileSync(userDataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeUserData(data) {
  fs.writeFileSync(userDataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

if (!fs.existsSync(userDataFilePath)) {
  writeUserData([]);
}

// Create a new user
function createUser(name, email, token) {
  const userData = readUserData();
  const newUser = {
    name,
    email,
    tokens: [{ token }],
  };
  userData.push(newUser);
  writeUserData(userData);
  return newUser;
}

// Find a user by email
function findUserByEmail(email) {
  const userData = readUserData();
  return userData.find((user) => user.email === email);
}

// Add a token to a user
function addTokenToUser(email, token) {
  const userData = readUserData();
  const user = userData.find((user) => user.email === email);
  if (user) {
    user.tokens.push({ token });
    writeUserData(userData);
  }
}

export { createUser, findUserByEmail, addTokenToUser };