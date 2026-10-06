/*
 * Lab 06 | CS-301L Full Stack Web Development
 * Name: YOUR NAME
 * Roll No: YOUR ROLL NO
 *
 * Task 1: Interactive Course Planner
 * Task 2: Live Student ID Card Generator
 * Task 3: Course Registration Form
 * Task 4: Student Management Dashboard
 */

// Escapes the characters that are unsafe inside HTML text and attribute values
function lab06Escape(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(str).replace(/[&<>"']/g, ch => map[ch]);
}

// Shows a Bootstrap alert inside the given container.
// The message is set with textContent, so it is never parsed as HTML.
function lab06ShowAlert(container, message, variant = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${variant} mb-0`;
  alert.setAttribute('role', 'alert');
  alert.textContent = message;
  container.appendChild(alert);
  return alert;
}

// Clears a container and shows one alert in it
function lab06ReplaceAlert(container, message, variant = 'info') {
  container.textContent = '';
  return lab06ShowAlert(container, message, variant);
}

// Task 1: Interactive Course Planner
function initTask1() {
  const input = document.getElementById('task1Input');
  const addBtn = document.getElementById('task1AddBtn');
  const list = document.getElementById('task1List');
  const output = document.getElementById('task1Output');
  const highlightBtn = document.getElementById('task1HighlightBtn');
  const clearBtn = document.getElementById('task1ClearBtn');
  const totalEl = document.getElementById('task1Total');
  const completedEl = document.getElementById('task1Completed');
  const remainingEl = document.getElementById('task1Remaining');

  // Recount the items and refresh the three counters
  function updateCounters() {
    const total = list.querySelectorAll('li').length;
    const completed = list.querySelectorAll('li.completed').length;
    totalEl.textContent = total;
    completedEl.textContent = completed;
    remainingEl.textContent = total - completed;
  }

  // Case-insensitive duplicate check against the names already in the list
  function courseExists(name) {
    const target = name.toLowerCase();
    return Array.from(list.querySelectorAll('.course-name'))
      .some(el => el.textContent.toLowerCase() === target);
  }

  function addCourse() {
    const name = input.value.trim();

    if (name === '') {
      lab06ReplaceAlert(output, 'Course name cannot be empty.', 'danger');
      input.focus();
      return;
    }
    if (courseExists(name)) {
      lab06ReplaceAlert(output, 'Course already exists.', 'danger');
      input.focus();
      return;
    }

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex align-items-center gap-2';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'course-name flex-grow-1';
    nameSpan.textContent = name;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn-sm btn-outline-danger delete-course';
    deleteBtn.textContent = 'Delete';

    li.append(nameSpan, deleteBtn);
    list.appendChild(li);

    input.value = '';
    input.focus();
    updateCounters();
    lab06ReplaceAlert(output, `Added "${name}".`, 'success');
  }

  // Event delegation: one listener on the list handles Delete and name clicks
  list.addEventListener('click', event => {
    const deleteBtn = event.target.closest('.delete-course');
    if (deleteBtn) {
      deleteBtn.closest('li').remove();
      updateCounters();
      return;
    }

    const nameSpan = event.target.closest('.course-name');
    if (nameSpan) {
      nameSpan.closest('li').classList.toggle('completed');
      updateCounters();
    }
  });

  addBtn.addEventListener('click', addCourse);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') addCourse();
  });

  highlightBtn.addEventListener('click', () => {
    const items = document.querySelectorAll('#task1List li');
    items.forEach(li => li.classList.remove('longest-course'));

    if (items.length === 0) {
      lab06ReplaceAlert(output, 'Add a course before highlighting.', 'warning');
      return;
    }

    // Find the longest name length first, then highlight every item that matches it
    let longest = 0;
    items.forEach(li => {
      const length = li.querySelector('.course-name').textContent.length;
      if (length > longest) longest = length;
    });

    let count = 0;
    items.forEach(li => {
      if (li.querySelector('.course-name').textContent.length === longest) {
        li.classList.add('longest-course');
        count++;
      }
    });

    const plural = count > 1 ? 's' : '';
    lab06ReplaceAlert(
      output,
      `Highlighted ${count} course${plural} with the longest name (${longest} characters).`,
      'info'
    );
  });

  clearBtn.addEventListener('click', () => {
    list.textContent = '';
    updateCounters();
    lab06ReplaceAlert(output, 'All courses cleared.', 'info');
  });

  updateCounters();
}

// Task 2: Live Student ID Card Generator
function initTask2() {
  const form = document.getElementById('task2Form');
  const nameInput = document.getElementById('task2Name');
  const nameCounter = document.getElementById('task2NameCounter');
  const rollInput = document.getElementById('task2Roll');
  const deptSelect = document.getElementById('task2Dept');
  const semesterInput = document.getElementById('task2Semester');
  const colorSelect = document.getElementById('task2Color');
  const cgpaCheckbox = document.getElementById('task2ShowCgpa');
  const resetBtn = document.getElementById('task2ResetBtn');
  const output = document.getElementById('task2Output');
  const summaryBox = document.getElementById('task2Summary');
  const card = document.getElementById('task2Card');
  const cardBody = document.getElementById('task2CardBody');
  const cardName = document.getElementById('task2CardName');
  const cardRoll = document.getElementById('task2CardRoll');
  const cardDept = document.getElementById('task2CardDept');
  const cardSemester = document.getElementById('task2CardSemester');
  const checkboxRow = cgpaCheckbox.closest('.form-check');

  // CGPA field and badge exist only while the checkbox is checked
  let cgpaGroup = null;
  let cgpaInput = null;
  let cgpaBadge = null;

  // Redraws the card, the name counter and the summary from the current field values
  function render() {
    const name = nameInput.value.trim();
    const roll = rollInput.value.trim();
    const dept = deptSelect.value;
    const semester = semesterInput.value;
    const cgpa = cgpaInput ? cgpaInput.value : '';
    const colorName = colorSelect.options[colorSelect.selectedIndex].text;

    const displayName = name || 'Your Name';
    const displayRoll = roll || 'Roll Number';
    const displayDept = dept || 'Department';
    const displaySemester = semester ? `Semester ${semester}` : 'Semester';

    cardName.textContent = displayName;
    cardRoll.textContent = displayRoll;
    cardDept.textContent = displayDept;
    cardSemester.textContent = displaySemester;
    card.style.backgroundColor = colorSelect.value;

    if (cgpaBadge) cgpaBadge.textContent = `CGPA: ${cgpa || '--'}`;

    nameCounter.textContent = `Characters left: ${nameInput.maxLength - nameInput.value.length}`;

    let summary = `Name: ${displayName}\nRoll Number: ${displayRoll}\nDepartment: ${displayDept}\nSemester: ${semester || '-'}\nCard Color: ${colorName}`;
    if (cgpaInput) summary += `\nCGPA: ${cgpa || '-'}`;
    summaryBox.value = summary;
  }

  function addCgpaField() {
    if (cgpaGroup) return;

    cgpaGroup = document.createElement('div');
    cgpaGroup.className = 'mb-3';

    const label = document.createElement('label');
    label.className = 'form-label';
    label.htmlFor = 'task2Cgpa';
    label.textContent = 'CGPA';

    cgpaInput = document.createElement('input');
    cgpaInput.type = 'number';
    cgpaInput.id = 'task2Cgpa';
    cgpaInput.className = 'form-control';
    cgpaInput.min = '0';
    cgpaInput.max = '4';
    cgpaInput.step = '0.01';
    cgpaInput.placeholder = 'e.g. 3.45';

    cgpaGroup.append(label, cgpaInput);
    checkboxRow.after(cgpaGroup);

    cgpaBadge = document.createElement('span');
    cgpaBadge.className = 'badge text-bg-success fs-6 mt-2';
    cardBody.appendChild(cgpaBadge);

    cgpaInput.addEventListener('input', () => {
      const value = Number(cgpaInput.value);
      if (cgpaInput.value !== '' && (value < 0 || value > 4)) {
        lab06ReplaceAlert(output, 'CGPA must be between 0 and 4.', 'danger');
      } else {
        output.textContent = '';
      }
      render();
    });
  }

  function removeCgpaField() {
    if (cgpaGroup) cgpaGroup.remove();
    if (cgpaBadge) cgpaBadge.remove();
    cgpaGroup = null;
    cgpaInput = null;
    cgpaBadge = null;
  }

  // Text and number fields update on "input"; selects update on "change"
  [nameInput, rollInput, semesterInput].forEach(el => {
    el.addEventListener('input', render);
  });
  [deptSelect, colorSelect].forEach(el => {
    el.addEventListener('change', render);
  });

  cgpaCheckbox.addEventListener('change', () => {
    if (cgpaCheckbox.checked) {
      addCgpaField();
      lab06ReplaceAlert(output, 'CGPA badge added to the card.', 'success');
    } else {
      removeCgpaField();
      lab06ReplaceAlert(output, 'CGPA badge removed.', 'info');
    }
    render();
  });

  resetBtn.addEventListener('click', () => {
    form.reset();          // restores the HTML defaults and unchecks the checkbox
    removeCgpaField();
    render();
    lab06ReplaceAlert(output, 'Form reset to its initial state.', 'info');
  });

  // Enter in a text field should not reload the page
  form.addEventListener('submit', event => event.preventDefault());

  render();
}

// Task 3: Course Registration Form
function initTask3() {
  const form = document.getElementById('task3Form');
  const nameInput = document.getElementById('task3Name');
  const emailInput = document.getElementById('task3Email');
  const phoneInput = document.getElementById('task3Phone');
  const phoneMessage = document.getElementById('task3PhoneMessage');
  const dobInput = document.getElementById('task3Dob');
  const courseSelect = document.getElementById('task3Course');
  const passwordInput = document.getElementById('task3Password');
  const confirmInput = document.getElementById('task3ConfirmPassword');
  const showPasswordBox = document.getElementById('task3ShowPassword');
  const termsInput = document.getElementById('task3Terms');
  const output = document.getElementById('task3Output');

  // Fields whose browser validation message is shown in their .invalid-feedback
  const fields = [nameInput, emailInput, dobInput, courseSelect, passwordInput, confirmInput, termsInput];

  // Age in whole years on a YYYY-MM-DD date
  function ageOn(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const today = new Date();
    let age = today.getFullYear() - year;
    const monthDiff = (today.getMonth() + 1) - month;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) age--;
    return age;
  }

  // Rules that HTML attributes cannot express, set with setCustomValidity()
  function applyCustomRules() {
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    const dob = dobInput.value;

    passwordInput.setCustomValidity(
      password !== '' && !/\d/.test(password) ? 'Password must contain at least one digit.' : ''
    );
    confirmInput.setCustomValidity(
      confirm !== '' && confirm !== password ? 'Passwords do not match.' : ''
    );
    dobInput.setCustomValidity(
      dob !== '' && ageOn(dob) < 16 ? 'You must be at least 16 years old.' : ''
    );
  }

  // Copies each field's current validation message into its .invalid-feedback
  function syncFeedback() {
    fields.forEach(field => {
      const feedback = field.closest('.field').querySelector('.invalid-feedback');
      feedback.textContent = field.validationMessage;
    });
  }

  // Live message under Phone, based on the validity flags
  function updatePhoneMessage() {
    const { valueMissing, patternMismatch, valid } = phoneInput.validity;
    phoneMessage.classList.remove('text-danger', 'text-success');

    if (valueMissing) {
      phoneMessage.textContent = 'Phone is required.';
      phoneMessage.classList.add('text-danger');
    } else if (patternMismatch) {
      phoneMessage.textContent = 'Phone must look like 03001234567.';
      phoneMessage.classList.add('text-danger');
    } else if (valid) {
      phoneMessage.textContent = 'Phone number looks good.';
      phoneMessage.classList.add('text-success');
    }
  }

  // Live validation through event delegation on the form
  form.addEventListener('input', event => {
    applyCustomRules();
    if (form.classList.contains('was-validated')) syncFeedback();
    if (event.target === phoneInput) updatePhoneMessage();
  });

  form.addEventListener('change', () => {
    applyCustomRules();
    if (form.classList.contains('was-validated')) syncFeedback();
  });

  // Show/Hide Password switches both password fields between "password" and "text"
  showPasswordBox.addEventListener('change', () => {
    const type = showPasswordBox.checked ? 'text' : 'password';
    passwordInput.type = type;
    confirmInput.type = type;
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    form.classList.add('was-validated');
    applyCustomRules();
    syncFeedback();
    updatePhoneMessage();

    if (!form.checkValidity()) {
      form.querySelector(':invalid').focus();
      lab06ReplaceAlert(output, 'Please fix the highlighted fields.', 'danger');
      return;
    }

    const data = new FormData(form);
    const details = {
      'Full Name': data.get('fullName'),
      'Email': data.get('email'),
      'Phone': data.get('phone'),
      'Date of Birth': data.get('dob'),
      'Course': data.get('course'),
      'Terms': data.get('terms') ? 'Accepted' : 'Not accepted'
    };

    const card = document.createElement('div');
    card.className = 'card border-success';

    const header = document.createElement('div');
    header.className = 'card-header bg-success text-white fw-semibold';
    header.textContent = 'Registration Successful';

    const body = document.createElement('div');
    body.className = 'card-body';

    const list = document.createElement('dl');
    list.className = 'row mb-0';
    Object.entries(details).forEach(([label, value]) => {
      const dt = document.createElement('dt');
      dt.className = 'col-sm-5';
      dt.textContent = label;

      const dd = document.createElement('dd');
      dd.className = 'col-sm-7';
      dd.textContent = value;

      list.append(dt, dd);
    });

    body.appendChild(list);
    card.append(header, body);
    output.textContent = '';
    output.appendChild(card);

    // Reset the form for the next registration; the password is never shown
    form.reset();
    form.classList.remove('was-validated');
    passwordInput.type = 'password';
    confirmInput.type = 'password';
    showPasswordBox.checked = false;
    phoneMessage.textContent = '';
    phoneMessage.classList.remove('text-danger', 'text-success');
    applyCustomRules();
  });

  applyCustomRules();
}

// Task 4: Student Management Dashboard
const DEPARTMENTS = ['Computer Science', 'Software Engineering', 'Information Technology', 'Data Science'];

const STATUS_CLASSES = {
  'Excellent': 'text-bg-success',
  'Good': 'text-bg-primary',
  'Satisfactory': 'text-bg-warning',
  'Academic Warning': 'text-bg-danger'
};

// Maps a CGPA to a status label
function getStatus(cgpa) {
  return cgpa >= 3 ? 'Excellent'
    : cgpa >= 2.5 ? 'Good'
    : cgpa >= 2 ? 'Satisfactory'
    : 'Academic Warning';
}

// Builds one student card with createElement() and appendChild()
function createStudentCard({ name, rollNumber, department, semester, cgpa, email }) {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-xl-4';

  const card = document.createElement('div');
  card.className = 'card h-100 shadow-sm';

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h5');
  title.className = 'card-title mb-1';
  title.textContent = name;

  const rollEl = document.createElement('p');
  rollEl.className = 'text-muted small mb-2';
  rollEl.textContent = rollNumber;

  const status = getStatus(cgpa);
  const badge = document.createElement('span');
  badge.className = `badge ${STATUS_CLASSES[status]} mb-3`;
  badge.textContent = status;

  const details = document.createElement('ul');
  details.className = 'list-unstyled small mb-3';
  [`Department: ${department}`, `Semester: ${semester}`, `Email: ${email}`, `CGPA: ${cgpa.toFixed(2)}`]
    .forEach(text => {
      const item = document.createElement('li');
      item.textContent = text;
      details.appendChild(item);
    });

  const actions = document.createElement('div');
  actions.className = 'd-flex gap-2';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn btn-sm btn-outline-primary';
  editBtn.textContent = 'Edit CGPA';
  editBtn.dataset.action = 'edit';
  editBtn.dataset.roll = rollNumber;

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn-sm btn-outline-danger';
  deleteBtn.textContent = 'Delete';
  deleteBtn.dataset.action = 'delete';
  deleteBtn.dataset.roll = rollNumber;

  actions.append(editBtn, deleteBtn);
  body.append(title, rollEl, badge, details, actions);
  card.appendChild(body);
  col.appendChild(card);
  return col;
}

function initTask4() {
  // Starting data; exactly one student (Zara Khan) is below 2.00
  const students = [
    { name: 'Sara Ahmed', rollNumber: 'BSCS-023', department: 'Software Engineering', semester: 5, cgpa: 3.8, email: 'sara.ahmed@example.com' },
    { name: 'Ali Raza', rollNumber: 'BSCS-007', department: 'Computer Science', semester: 3, cgpa: 2.65, email: 'ali.raza@example.com' },
    { name: 'Hina Malik', rollNumber: 'BSCS-012', department: 'Computer Science', semester: 7, cgpa: 3.2, email: 'hina.malik@example.com' },
    { name: 'Usman Tariq', rollNumber: 'BSCS-031', department: 'Software Engineering', semester: 2, cgpa: 2.2, email: 'usman.tariq@example.com' },
    { name: 'Zara Khan', rollNumber: 'BSCS-018', department: 'Information Technology', semester: 4, cgpa: 1.85, email: 'zara.khan@example.com' },
    { name: 'Bilal Hussain', rollNumber: 'BSCS-045', department: 'Data Science', semester: 6, cgpa: 2.9, email: 'bilal.hussain@example.com' },
    { name: 'Noor Fatima', rollNumber: 'BSCS-052', department: 'Data Science', semester: 1, cgpa: 2.0, email: 'noor.fatima@example.com' }
  ];

  const output = document.getElementById('task4Output');
  const statTotal = document.getElementById('task4StatTotal');
  const statAverage = document.getElementById('task4StatAverage');
  const statHighest = document.getElementById('task4StatHighest');
  const statWarning = document.getElementById('task4StatWarning');

  const addForm = document.getElementById('task4AddForm');
  const nameInput = document.getElementById('task4Name');
  const rollInput = document.getElementById('task4Roll');
  const deptSelect = document.getElementById('task4Dept');
  const semesterInput = document.getElementById('task4Semester');
  const cgpaInput = document.getElementById('task4Cgpa');
  const emailInput = document.getElementById('task4Email');
  const addFields = [nameInput, rollInput, deptSelect, semesterInput, cgpaInput, emailInput];

  const searchInput = document.getElementById('task4Search');
  const deptFilter = document.getElementById('task4DeptFilter');
  const sortBtn = document.getElementById('task4SortBtn');
  const grid = document.getElementById('task4Grid');

  const editModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('task4EditModal'));
  const editForm = document.getElementById('task4EditForm');
  const editName = document.getElementById('task4EditName');
  const editRoll = document.getElementById('task4EditRoll');
  const editCgpa = document.getElementById('task4EditCgpa');

  let sortDirection = null;   // null, 'desc' (high first) or 'asc' (low first)
  let editingRoll = null;

  // Fill both department dropdowns from one list
  DEPARTMENTS.forEach(dept => {
    [deptSelect, deptFilter].forEach(select => {
      const option = document.createElement('option');
      option.value = dept;
      option.textContent = dept;
      select.appendChild(option);
    });
  });

  // Returns the validation message for a field, or '' if it is valid
  function getErrorMessage(field) {
    const { validity } = field;
    const label = field.labels[0].textContent;

    if (validity.valueMissing) return `${label} is required.`;
    if (validity.badInput) return 'Please enter a valid number.';
    if (validity.typeMismatch) return 'Please enter a valid email address.';
    if (validity.tooShort) return `${label} must be at least ${field.minLength} characters.`;
    if (validity.patternMismatch) return 'Roll number must look like BSCS-001.';
    if (validity.rangeUnderflow || validity.rangeOverflow) return field.dataset.rangeError;
    if (validity.stepMismatch) return field.dataset.stepError;
    if (validity.customError) return field.validationMessage;
    return '';
  }

  // Runs the custom roll number rule, then shows red or green state for one field
  function checkField(field) {
    if (field === rollInput) {
      const duplicate = rollInput.value !== '' && students.some(({ rollNumber }) => rollNumber === rollInput.value);
      rollInput.setCustomValidity(duplicate ? 'Roll number already exists.' : '');
    }

    const message = getErrorMessage(field);
    field.closest('.mb-3').querySelector('.invalid-feedback').textContent = message;
    field.classList.toggle('is-invalid', message !== '');
    field.classList.toggle('is-valid', message === '');
    return message === '';
  }

  function clearValidation(fields) {
    fields.forEach(field => {
      field.setCustomValidity('');
      field.classList.remove('is-valid', 'is-invalid');
      field.closest('.mb-3').querySelector('.invalid-feedback').textContent = '';
    });
  }

  // Validate on blur; re-check on input only while the field shows an error
  function attachValidation(field) {
    field.addEventListener('blur', () => checkField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) checkField(field);
    });
  }

  // Recalculates the four stats from the full list
  function updateStats() {
    const total = students.length;
    const sum = students.reduce((acc, { cgpa }) => acc + cgpa, 0);
    const top = students.reduce((best, student) => (best === null || student.cgpa > best.cgpa ? student : best), null);
    const warnings = students.filter(({ cgpa }) => getStatus(cgpa) === 'Academic Warning').length;

    statTotal.textContent = total;
    statAverage.textContent = total > 0 ? (sum / total).toFixed(2) : 'N/A';
    statHighest.textContent = top ? `${top.cgpa.toFixed(2)} (${top.name})` : 'N/A';
    statWarning.textContent = warnings;
  }

  // Applies search, department filter and sort together, then redraws the grid and stats
  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const department = deptFilter.value;

    const visible = students
      .filter(({ name, rollNumber }) => name.toLowerCase().includes(query) || rollNumber.toLowerCase().includes(query))
      .filter(student => department === '' || student.department === department);

    if (sortDirection) {
      visible.sort((a, b) => (sortDirection === 'desc' ? b.cgpa - a.cgpa : a.cgpa - b.cgpa));
    }

    grid.textContent = '';
    if (visible.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'col-12';
      lab06ShowAlert(
        empty,
        students.length === 0 ? 'No students yet. Add one using the form.' : 'No students match your search or filter.',
        'secondary'
      );
      grid.appendChild(empty);
    }

    visible.forEach(student => grid.appendChild(createStudentCard(student)));
    updateStats();
  }

  function openEditModal({ name, rollNumber, cgpa }) {
    editingRoll = rollNumber;
    editName.textContent = name;
    editRoll.textContent = rollNumber;
    editCgpa.value = cgpa;
    clearValidation([editCgpa]);
    editModal.show();
  }

  // Add Student
  addFields.forEach(attachValidation);

  addForm.addEventListener('submit', event => {
    event.preventDefault();

    const results = addFields.map(checkField);
    if (!results.every(Boolean)) {
      addForm.querySelector('.is-invalid').focus();
      lab06ReplaceAlert(output, 'Please fix the highlighted fields.', 'danger');
      return;
    }

    const newStudent = {
      name: nameInput.value.trim(),
      rollNumber: rollInput.value,
      department: deptSelect.value,
      semester: Number(semesterInput.value),
      cgpa: Number(cgpaInput.value),
      email: emailInput.value.trim()
    };
    students.push(newStudent);

    addForm.reset();
    clearValidation(addFields);
    render();
    lab06ReplaceAlert(output, `Added ${newStudent.name} (${newStudent.rollNumber}).`, 'success');
    nameInput.focus();
  });

  // Edit CGPA modal
  attachValidation(editCgpa);

  editForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!checkField(editCgpa)) {
      editCgpa.focus();
      return;
    }

    const index = students.findIndex(({ rollNumber }) => rollNumber === editingRoll);
    if (index === -1) {
      editModal.hide();
      return;
    }

    const updated = { ...students[index], cgpa: Number(editCgpa.value) };
    students.splice(index, 1, updated);
    editModal.hide();
    render();
    lab06ReplaceAlert(output, `Updated CGPA for ${updated.name} to ${updated.cgpa.toFixed(2)}.`, 'success');
  });

  // Event delegation: one listener on the grid handles every Delete and Edit CGPA button
  grid.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const { action, roll } = button.dataset;
    const index = students.findIndex(({ rollNumber }) => rollNumber === roll);
    if (index === -1) return;

    if (action === 'delete') {
      const [{ name, rollNumber }] = students.splice(index, 1);
      render();
      lab06ReplaceAlert(output, `Deleted ${name} (${rollNumber}). That roll number can be used again.`, 'info');
    } else if (action === 'edit') {
      openEditModal(students[index]);
    }
  });

  // Search, department filter and sort all feed into render()
  searchInput.addEventListener('input', render);
  deptFilter.addEventListener('change', render);

  sortBtn.addEventListener('click', () => {
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    sortBtn.textContent = sortDirection === 'desc' ? 'Sort by CGPA: High to Low' : 'Sort by CGPA: Low to High';
    render();
  });

  render();
}

document.addEventListener('DOMContentLoaded', () => {
  initTask1();
  initTask2();
  initTask3();
  initTask4();
});
