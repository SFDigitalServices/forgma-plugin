const AdmZip = require("adm-zip");

const zip = new AdmZip();

zip.addLocalFile("manifest.json");
zip.addLocalFolder("build", "build");
zip.writeZip("Forgma.io.zip");
