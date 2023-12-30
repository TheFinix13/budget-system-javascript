const BackEnd = process.env.REACT_APP_BackEndHostLocal;

export const sectors = [
  "Agriculture",
  "Education",
  "Health",
  "Transportation",
  "ICT",
];
export const report = {
  expenditure: `${BackEnd}/api/report/expenditure-report`,
  budget: `${BackEnd}/api/report/budget-report`,
  //---------------------------------------------------------------------------------------------------
};
export const ministry = {
  addMinistry: `${BackEnd}/api/ministry/add_ministry`,
  showMinistries: `${BackEnd}/api/ministry/show_ministries`,
  showAllMinistries: `${BackEnd}/api/ministry/show_all_ministries`,
  updateMinistry: `${BackEnd}/api/ministry/update_ministry`,
  showDepartmentCount: `${BackEnd}/api/ministry/show_department_count`,
  ministryDepartmentCount: `${BackEnd}/api/ministry/ministry-department-count`,
  //---------------------------------------------------------------------------------------------------

  //data : ministry in JSON format
  // {
  // 	 -----
  // }
};

export const department = {
  showDepartments: `${BackEnd}/api/department/show_departments`,
  showAllDepartments: `${BackEnd}/api/department/show_all_departments`,
  addDepartment: `${BackEnd}/api/department/add_department`,
  updateDepartment: `${BackEnd}/api/department/update`,
  showAllDepartmentsMinistry: `${BackEnd}/api/department/show_all_departments`,
  showBudgets: `${BackEnd}/api/department/show_all_budgets`,
  //---------------------------------------------------------------------------------------------------

  //data : department in JSON format
  // {
  // 	 -----
  // }
};

export const unit = {
  showUnits: `${BackEnd}/api/unit/show_units`,
  addUnit: `${BackEnd}/api/unit/add_unit`,
  updateUnit: `${BackEnd}/api/unit/update_unit`,
  showAllUnits: `${BackEnd}/api/unit/show_all_units`,
  //---------------------------------------------------------------------------------------------------
};
export const budget = {
  showBudgets: `${BackEnd}/api/budget/show_budgets`,
  addBudget: `${BackEnd}/api/budget/add_budget`,
  updateBudget: `${BackEnd}/api/budget/update_budget`,
  showAllBudegts: `${BackEnd}/api/budget/show_all_budgets`,
  showBudgetById: `${BackEnd}/api/budget/show_budget_by_id`,
  showUnitBudgets: `${BackEnd}/api/budget/unit-budgets`,
  //---------------------------------------------------------------------------------------------------
};
export const budget_request = {
  showBudgetRequest: `${BackEnd}/api/budget_request/`,
  addBudgetRequest: `${BackEnd}/api/budget_request/add_budgetrequest`,
  updateBudgetRequest: `${BackEnd}/api/budget_request/update`,
  showBudgetRequests: `${BackEnd}/api/budget_request/show_all`,

  //---------------------------------------------------------------------------------------------------
};

export const expenditure = {
  showExpenditures: `${BackEnd}/api/expenditure/show_expenditures`,
  addExpenditure: `${BackEnd}/api/expenditure/add_expenditure`,
  updateExpenditure: `${BackEnd}/api/expenditure/update_expenditure`,
  showAllExpenditures: `${BackEnd}/api/expenditure/show_all_expenditures`,
  showExpenditureForDepartment: `${BackEnd}/api/expenditure/department`,
  showExpenditureForUnit: `${BackEnd}/api/expenditure/unit`,
  showBudgetVsExpenditure: `${BackEnd}/api/expenditure/budget-vs-expenditure`,
  showBudgetVsExpenditureUnit: `${BackEnd}/api/expenditure/unit/budget-vs-expenditure`,
  showDepartmentExpenses: `${BackEnd}/api/expenditure/department-expenses`,
  showMinistryExpenses: `${BackEnd}/api/expenditure/ministry-expenses`,
  showUnitExpenses: `${BackEnd}/api/expenditure/expenditure-by-unit`,
  showByTime: `${BackEnd}/api/expenditure/by-time`,
  //---------------------------------------------------------------------------------------------------
};

export const term = {
  addTerm: `${BackEnd}/api/term/add_term`,
  showTerm: `${BackEnd}/api/term/show_term`,
  showActiveTerm: `${BackEnd}/api/term/show_active_term`,
  updateTerm: `${BackEnd}/api/term/update_term`,
};

export const user = {
  //data :
  // {
  // 	"store":"Hanis Store"
  // }
  editProfile: `${BackEnd}/api/user/edit_profile`,
  updateUser: `${BackEnd}/api/user/update_user`,
};
export const authenticate = {
  //takes in token as http cookie
  //data : [verifyToken]
  verifyAcct: `${BackEnd}/api/user/verifyAccount/`,

  //takes in password + token as http cookie
  //data : [verifyToken]
  passwordReset: `${BackEnd}/api/user/passwordReset/`,

  //takes http cookie token and checks if a user is logged in
  //data : requires token to be set - user login
  loggedIn: `${BackEnd}/api/user/loggedIn`,

  //sends a reset link to specified user email
  //data : email
  forgotPassword: `${BackEnd}/api/user/forgotPassword`,

  //destroys cookie
  logout: `${BackEnd}/api/user/logout`,

  //destroys cookie
  addUser: `${BackEnd}/api/user/add_user`,

  //give logged in user data
  getUserData: `${BackEnd}/api/user/user`,

  //---------
  userAuth: `${BackEnd}/api/user/login`,
};
