const getBase64ImgSize = (baseImg) => {
  const strLen = baseImg.length;
  // @ts-ignore
  // eslint-disable-next-line radix
  const fileLen = parseInt(strLen - (strLen / 8) * 2);

  // eslint-disable-next-line radix
  return parseInt((fileLen / 1024).toFixed(2));
};

const imgToCanvas = (image) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  // @ts-ignore
  canvas.getContext('2d').drawImage(image, 0, 0);

  return canvas;
};

// eslint-disable-next-line arrow-body-style
const compressImgBySize = (baseImg, maxSize = 200) => {
  return new Promise((resolve) => {
    let size = getBase64ImgSize(baseImg);

    if (size <= maxSize) {
      resolve(baseImg);
      return;
    }

    const img = new Image();
    if (baseImg.indexOf('data:image/') !== -1) {
      img.src = baseImg;
    } else {
      img.src = `data:image/jpeg;base64,${baseImg}`;
    }

    img.onload = () => {
      const canvas = imgToCanvas(img);
      let resUrl = '';

      let quality = 0.75; // 图片质量， 范围0～1

      while (size > maxSize && quality > 0) {
        resUrl = canvas.toDataURL('image/jpeg', quality).replace(/^data:image\/\w+;base64,/, '');

        size = getBase64ImgSize(resUrl);
        quality = (quality - 0.1).toFixed(1);
      }

      resolve(`data:image/jpeg;base64,${resUrl}`);
    };

    img.onerror = () => {
      resolve(baseImg);
    };
  });
};

export {
  compressImgBySize,
  getBase64ImgSize,
  imgToCanvas,
};
