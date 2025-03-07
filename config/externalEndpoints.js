const { CONNECTIFILE_BASEURL } = require("./configSource");

const SOURCES = [
  {
    name: "users",
    url: `${CONNECTIFILE_BASEURL}/api/user/all`,
    isProtected: true,
  },
  {
    name: "accessments",
    url: `${CONNECTIFILE_BASEURL}/api/admin/get-all-assessments`,
    isProtected: true,
  },
  {
    name: "assignments",
    url: `${CONNECTIFILE_BASEURL}/api/assignments`,
    isProtected: true,
  },
  {
    name: "locations",
    url: `${CONNECTIFILE_BASEURL}/api/locations`,
    isProtected: true,
  },
  {
    name: "projects",
    url: `${CONNECTIFILE_BASEURL}/api/projects`,
    isProtected: true,
  },
  {
    name: "orgs",
    url: `${CONNECTIFILE_BASEURL}/api/orgs/all`,
    isProtected: true,
  },
  {
    name: "surveys",
    url: `${CONNECTIFILE_BASEURL}/api/shopper/surveys`,
    isProtected: true,
  },
  {
    name: "survey-types",
    url: `${CONNECTIFILE_BASEURL}/api/survey-types`,
    isProtected: true,
  },
  // {
  //   name: "assessments_score_category",
  //   url: `${CONNECTIFILE_BASEURL}/api/`,
  //   isProtected: true,
  // },
  // {
  //   name: "survey_scores",
  //   url: `${CONNECTIFILE_BASEURL}/api/`,
  //   isProtected: true,
  // },
];

module.exports = { SOURCES };
