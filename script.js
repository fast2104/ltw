class Student {
    constructor(maSV, hoTen, ngaySinh, lopHoc, gpa) {
        this.maSV = maSV;
        this.hoTen = hoTen;
        this.ngaySinh = ngaySinh;
        this.lopHoc = lopHoc;
        this.gpa = gpa;
    }
    updateInfo(newData) {
        this.maSV = newData.maSV;
        this.hoTen = newData.hoTen;
        this.ngaySinh = newData.ngaySinh;
        this.lopHoc = newData.lopHoc;
        this.gpa = newData.gpa;
    }
}
let students = [];
const studentForm = document.getElementById('studentForm');
const studentTableBody = document.getElementById('studentTableBody');
const submitBtn = document.getElementById('submitBtn');
const editIndexInput = document.getElementById('editIndex');

function renderTable() {
    studentTableBody.innerHTML = '';
    students.forEach((student, index) => {
        const row = `
            <tr>
                <td>${student.maSV}</td>
                <td>${student.hoTen}</td>
                <td>${student.ngaySinh}</td>
                <td>${student.lopHoc}</td>
                <td>${student.gpa}</td>
                <td>
                    <button class="btn btn-sm btn-edit" onclick="editStudent(${index})">Sửa</button>
                </td>
            </tr>
        `;
        studentTableBody.innerHTML += row;
    });
}

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        maSV: document.getElementById('maSV').value,
        hoTen: document.getElementById('hoTen').value,
        ngaySinh: document.getElementById('ngaySinh').value,
        lopHoc: document.getElementById('lopHoc').value,        gpa: document.getElementById('gpa').value
    };

    const editIndex = parseInt(editIndexInput.value);

    if (editIndex === -1) {
        const newStudent = new Student(data.maSV, data.hoTen, data.ngaySinh, data.lopHoc, data.gpa);
        students.push(newStudent);
    } else {
        students[editIndex].updateInfo(data);
        editIndexInput.value = "-1";
        submitBtn.innerText = "Thêm Sinh viên";
        submitBtn.classList.replace('btn-success', 'btn-primary');
    }

    studentForm.reset();
    renderTable();
});

window.editStudent = function(index) {
    const s = students[index];
    document.getElementById('maSV').value = s.maSV;
    document.getElementById('hoTen').value = s.hoTen;
    document.getElementById('ngaySinh').value = s.ngaySinh;
    document.getElementById('lopHoc').value = s.lopHoc;
    document.getElementById('gpa').value = s.gpa;

    editIndexInput.value = index;
    submitBtn.innerText = "Lưu cập nhật";
    submitBtn.classList.replace('btn-primary', 'btn-success');
};