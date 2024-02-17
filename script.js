isfirst = true;
function encode() {
  var selectedfile = document.getElementById("myinput").files;
  if (selectedfile.length > 0) {
    var imageFile = selectedfile[0];
    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
      var srcData = fileLoadedEvent.target.result;
      newImage = isfirst
        ? document.getElementById("image1")
        : document.getElementById("image2");
      if (isfirst == false) {
        document.getElementById("button").style.display = "flex";
        document.getElementById("upload").style.display = "none";
      }
      isfirst = false;
      reduce_image_file_size(srcData).then((reduce_img) => {
        newImage.src = reduce_img;
      });
    };
    fileReader.readAsDataURL(imageFile);
  }
}

async function reduce_image_file_size(base64Str, newwidth = 0, newheight = 0) {
  let resized_base64 = await new Promise((resolve) => {
    let img = document.createElement("img");
    img.src = base64Str;
    img.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      let width = newwidth === 0 ? img.width : newwidth
      let height = newheight === 0 ? img.height : newheight
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/webp", 100)); 
    };
  });
  return resized_base64;
}

function lcs(X, Y) {
  let m = X.length,
    n = Y.length;

  let L = new Array(2);
  for (let i = 0; i < 2; i++) {
    L[i] = new Array(n + 1);
    for (let j = 0; j < n + 1; j++) {
      L[i][j] = 0;
    }
  }
  let bi = 0;

  for (let i = 0; i <= m; i++) {
    bi = i & 1;

    for (let j = 0; j <= n; j++) {
      if (i == 0 || j == 0) L[bi][j] = 0;
      else if (X[i - 1] == Y[j - 1]) {
        L[bi][j] = L[1 - bi][j - 1] + 1;
      } else L[bi][j] = Math.max(L[1 - bi][j], L[bi][j - 1]);
    }
  }
  return L[bi][n];
}

function search() {
  let text = document.getElementById("ans");
  text.innerText = "Comparing...\n";
  let image1 = document.getElementById("image1").src;
  let image2 = document.getElementById("image2").src;

  reduce_image_file_size(image1, 20, 20).then((reduce_file) => {
    image1 = reduce_file;
    reduce_image_file_size(image2, 20, 20).then((reduce_file) => {
      image2 = reduce_file;
      lcsvalue = lcs(image1, image2);
      let maxlength = Math.max(image1.length, image2.length);
      text.innerText = `The Above Two Images Are matching ${(
        (lcsvalue / maxlength) *
        100
      ).toFixed(2)} %`;
    });
  });
}
