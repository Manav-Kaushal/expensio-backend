const pick = (obj, keys) => {
  return Object.entries(obj)
    .filter(([key]) => keys.includes(key))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
};

module.exports = { pick };
