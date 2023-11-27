const isExceedLines = (text, line = 2) => {
  const totalNode = document.createElement('div');
  const oneNode = document.createElement('div');

  totalNode.innerHTML = text;
  oneNode.innerHTML = text.substring(0, 1);
  const containerNode = document.body.appendChild(totalNode);
  const getLineHeightNode = document.body.appendChild(oneNode);
  const totalHeight = totalNode.offsetHeight;
  const oneHeight = oneNode.offsetHeight * line;
  document.body.removeChild(containerNode);
  document.body.removeChild(getLineHeightNode);

  return totalHeight > oneHeight;
};

const isElementCollision = (ele, rowCount = 1, cssStyles, removeChild = true) => {
  if (!ele) {
    return false;
  }

  const clonedNode = ele.cloneNode(true);

  // 给clone的dom增加样式
  clonedNode.style.overflow = 'visible';
  clonedNode.style.display = 'inline-block';
  clonedNode.style.width = 'auto';
  clonedNode.style.whiteSpace = 'nowrap';
  clonedNode.style.visibility = 'hidden';

  // 将传入的css字体样式赋值
  if (cssStyles) {
    Object.keys(cssStyles).forEach((item) => {
      clonedNode.style[item] = cssStyles[item];
    });
  }

  // 给clone的dom增加id属性
  const containerID = 'collision_node_id';
  clonedNode.setAttribute('id', containerID);

  const tmpNode = document.getElementById(containerID);
  let newNode = clonedNode;
  if (tmpNode) {
    document.body.replaceChild(clonedNode, tmpNode);
  } else {
    newNode = document.body.appendChild(clonedNode);
  }
  debugger;
  // 新增的dom宽度与原dom的宽度*限制行数做对比
  const differ = newNode.offsetWidth - ele.offsetWidth * rowCount;
  if (removeChild) {
    document.body.removeChild(newNode);
  }
  return differ > 0;
};

export {
  isExceedLines,
  isElementCollision,
};
