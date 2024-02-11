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
      newImage.src = srcData;
    };
    fileReader.readAsDataURL(imageFile);
  }
}

async function reduce_image_file_size(base64Str, newwidth, newheight) {
  let resized_base64 = await new Promise((resolve) => {
    let img = document.createElement("img");
    img.src = base64Str;
    img.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, newwidth, newheight);
      resolve(canvas.toDataURL("image/jpeg", 0)); // this will return base64 image results after resize
    };
  });
  return resized_base64;
}

function lcs(string1, string2) {
  let m = string1.length + 1;
  let n = string2.length + 1;

  let c = [];
  for (let i = 0; i < m; i++) {
    c[i] = [];
    for (let j = 0; j < n; j++) {
      c[i][j] = { val: 0, dir: "H" };
    }
  }

  let stringArr1 = [" ", ...string1];
  let stringArr2 = [" ", ...string2];
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (stringArr1[i] !== stringArr2[j]) {
        c[i][j].val = Math.max(c[i - 1][j].val, c[i][j - 1].val);
        if (c[i - 1][j].val >= c[i][j - 1].val) {
          c[i][j].dir = "U";
        } else {
          c[i][j].dir = "S";
        }
      } else {
        c[i][j].val = c[i - 1][j - 1].val + 1;
        c[i][j].dir = "D";
      }
    }
  }
  // console.log(c);
  return { lcs: c, lcsval: getLcsValue(c, m - 1, n - 1) };
}

function getLcsValue(c, m, n) {
  if (m == 0 || n == 0) {
    return 0;
  }
  if (c[m][n].dir == "D") {
    return c[m][n].val;
  } else {
    if (c[m][n].dir == "U") {
      return getLcsValue(c, m - 1, n);
    } else {
      return getLcsValue(c, m, n - 1);
    }
  }
}

function search() {
  image1 = document.getElementById("image1").src;
  image2 = document.getElementById("image2").src;
  reduce_image_file_size(image1, 20, 20).then((reduce_file) => {
    image1 = reduce_file
    reduce_image_file_size(image2, 20, 20).then((reduce_file) => {
      image2 = reduce_file
      image1 = image1.split(",")[1];
      image2 = image2.split(",")[1];
      // console.log(image1+"\n"+image2);
      lcsvalue = lcs(image1, image2);
    
      let maxlength = Math.max(image1.length, image2.length);
      document.getElementById(
        "ans"
      ).innerText = `The Above Two Images Are matching ${(
        (lcsvalue.lcsval / maxlength) *
        100
      ).toFixed(2)} %`;
    })
  })
}
