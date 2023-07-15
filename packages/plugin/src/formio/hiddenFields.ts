const fieldNames = [
	"PROJECT_ID",
	"firstName",
	"lastName",
	"email",
	"DBAName",
	"StreetAddress",
];
const components = fieldNames.map((name) => ({
	key: name,
	label: name,
	hidden: true,
	disabled: true,
	tableView: true,
	type: "textfield",
	input: true
}));

export const hiddenFields = {
  legend: "Hidden Applicant Data",
  hidden: true,
  disabled: true,
  key: "fieldSet",
  type: "fieldset",
  input: false,
  tableView: false,
  components
};

export const hiddenFieldsPageName = "Part 2";
