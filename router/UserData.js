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

export { readUserData, writeUserData };