function stripCdata(str = "") {
  return str.replace("<![CDATA[", "").replace("]]>", "").trim();
}

module.exports = { stripCdata };
