export const exist = (element) => {
  return typeof element === "undefined" || element === null
    ? false
    : element.length !== 0;
};
export const siblings = (element) => {
  Array.prototype.filter.call(element.parentNode.children, function (child) {
    return child !== element;
  });
};
