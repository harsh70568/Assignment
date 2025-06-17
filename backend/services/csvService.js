const { Parser } = require('json2csv');

const generateCSV = async (students) => {
  const fields = [
    'name',
    'email',
    'phone',
    'codeforcesHandle',
    'currentRating',
    'maxRating',
    'lastUpdated'
  ];

  const opts = { fields };
  const parser = new Parser(opts);
  return parser.parse(students);
};

module.exports = {
  generateCSV
};