exports.removeKeys = (obj, ...args) => {
  for (let i of Object.keys(obj)) {
    if (args.includes(i)) delete obj[i];
  }
  return obj;
};
