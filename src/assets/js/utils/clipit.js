const clipit = (el, params) => {
    const { width, height } = el.getBoundingClientRect();
    const obj = {};
  
    const values = {
      top: `rect(0px, ${width}px, 0px, 0px)`,
      right: `rect(0px, ${width}px, ${height}px, ${width}px)`,
      bottom: `rect(${height}px, ${width}px, ${height}px, 0px)`,
      left: `rect(0px, 0px, ${height}px, 0px)`,
      middleX: `rect(0px, ${width / 2}px, ${height}px, ${width / 2}px)`,
      middleY: `rect(${height / 2}px, ${width}px, ${height / 2}px, 0px)`,
      visible: `rect(0px, ${width}px, ${height}px, 0px)`,
    };
  
    Object.keys(params).forEach(p => {
      obj[p] = values[params[p]];
    });
  
    return obj;
  };
  
  export default clipit;
  