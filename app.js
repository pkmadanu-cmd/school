import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCAN6kPnR6VWRV-f_6t8g4w1SkxNNHyl2c",
  authDomain: "schoolapp-a9681.firebaseapp.com",
  projectId: "schoolapp-a9681",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* MENU */
window.show = (page) => {
  document.getElementById("teacherPage").style.display = "none";
  document.getElementById("invPage").style.display = "none";

  if(page === "teacher") document.getElementById("teacherPage").style.display = "block";
  if(page === "inv") document.getElementById("invPage").style.display = "block";
};

/* ---------------- TEACHER ---------------- */
window.addTeacher = async () => {

  await addDoc(collection(db, "teachers"), {
    name: t_name.value,
    subject: t_subject.value,
    class: t_class.value,
    section: t_section.value,
    invigilationallotted: t_allotted.value,
    invigilationassigned: 0
  });

  loadTeachers();
};

/* LOAD TEACHERS */
async function loadTeachers() {
  const tbody = document.getElementById("teacherList");
  tbody.innerHTML = "";

  const snap = await getDocs(collection(db, "teachers"));

  snap.forEach(docSnap => {
    const t = docSnap.data();

    tbody.innerHTML += `
      <tr onclick="selectTeacher('${docSnap.id}', ${JSON.stringify(t)})">
        <td>${t.name}</td>
        <td>${t.subject}</td>
        <td>${t.class}</td>
        <td>${t.section}</td>
        <td>${t.invigilationassigned}</td>
        <td>${t.invigilationallotted}</td>
      </tr>
    `;
  });
}

/* ---------------- INVIGILATION ---------------- */
window.addInvigilation = async () => {

  await addDoc(collection(db, "invigilation"), {
    date: i_date.value,
    name_of_the_exam: i_exam.value,
    teacher_name: i_teacher.value,
    invigilation_room: i_room.value
  });

  loadInv();
};


window.selectTeacher = (id, t) => {
  selectedTeacherId = id;

  t_name.value = t.name;
  t_subject.value = t.subject;
  t_class.value = t.class;
  t_section.value = t.section;
  t_allotted.value = t.invigilationallotted;

  alert("Teacher selected ✏️");
};

window.updateTeacher = async () => {
  if (!selectedTeacherId) return alert("Select a teacher first");

  await updateDoc(doc(db, "teachers", selectedTeacherId), {
    name: t_name.value,
    subject: t_subject.value,
    class: t_class.value,
    section: t_section.value,
    invigilationallotted: t_allotted.value
  });

  alert("Updated ✅");

  loadTeachers();
  clearForm();
};

window.deleteTeacher = async () => {
  if (!selectedTeacherId) return alert("Select a teacher first");

  await deleteDoc(doc(db, "teachers", selectedTeacherId));

  alert("Deleted ✅");

  selectedTeacherId = null;

  loadTeachers();
  clearForm();
};

function clearForm() {
  t_name.value = "";
  t_subject.value = "";
  t_class.value = "";
  t_section.value = "";
  t_allotted.value = "";
}

/* LOAD INVIGILATION */
async function loadInv() {
  const tbody = document.getElementById("invList");
  tbody.innerHTML = "";

  const snap = await getDocs(collection(db, "invigilation"));

  snap.forEach(d => {
    const i = d.data();

    tbody.innerHTML += `
      <tr>
        <td>${i.date}</td>
        <td>${i.name_of_the_exam}</td>
        <td>${i.teacher_name}</td>
        <td>${i.invigilation_room}</td>
      </tr>
    `;
  });
}

/* INIT */
loadTeachers();
loadInv();