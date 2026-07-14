// Base URL for API
const API_URL = 'http://localhost:8000';

// Universal fetch wrapper
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// Modal functions
function openModal(id) {
    document.getElementById(id).classList.add('active');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Router to load correct data on page load
function loadData(pageType) {
    if (pageType === 'patients') loadPatients();
    else if (pageType === 'doctors') loadDoctors();
    // Add other module loads here as implemented
}

// --- Patient Functions --- //
async function loadPatients() {
    const patients = await apiCall('/patients/');
    const tbody = document.getElementById('patients-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    if (patients && patients.length > 0) {
        patients.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${p.patient_id}</td>
                <td style="font-weight:500;">${p.patient_name}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${p.phone}</td>
                <td><span class="badge badge-success">${p.blood_group}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editPatient(${p.patient_id}, '${p.patient_name}', ${p.age}, '${p.gender}', '${p.phone}', '${p.email}', '${p.blood_group}', '${p.address}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePatient(${p.patient_id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem;">No patients found</td></tr>';
    }
}

async function savePatient(event) {
    event.preventDefault();
    const form = event.target;
    const id = form.patient_id.value;
    const patientData = {
        patient_name: form.patient_name.value,
        age: parseInt(form.age.value),
        gender: form.gender.value,
        phone: form.phone.value,
        email: form.email.value,
        blood_group: form.blood_group.value,
        address: form.address.value
    };

    if (id) await apiCall(`/patients/update/${id}/`, 'PUT', patientData);
    else await apiCall(`/patients/add/`, 'POST', patientData);
    
    closeModal('patientModal');
    loadPatients();
}

function editPatient(id, name, age, gender, phone, email, blood, address) {
    const form = document.getElementById('patientForm');
    form.patient_id.value = id;
    form.patient_name.value = name;
    form.age.value = age;
    form.gender.value = gender;
    form.phone.value = phone;
    form.email.value = email;
    form.blood_group.value = blood;
    form.address.value = address;
    openModal('patientModal');
}

async function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        await apiCall(`/patients/delete/${id}/`, 'DELETE');
        loadPatients();
    }
}

// --- Doctor Functions --- //
async function loadDoctors() {
    const doctors = await apiCall('/doctors/');
    const tbody = document.getElementById('doctors-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    if (doctors && doctors.length > 0) {
        doctors.forEach(d => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${d.doctor_id}</td>
                <td style="font-weight:500;">${d.doctor_name}</td>
                <td><span class="badge badge-success">${d.specialization}</span></td>
                <td>${d.department}</td>
                <td>${d.experience} yrs</td>
                <td>$${d.consultation_fee}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editDoctor(${d.doctor_id}, '${d.doctor_name}', '${d.specialization}', '${d.department}', ${d.experience}, ${d.consultation_fee}, '${d.phone}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDoctor(${d.doctor_id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem;">No doctors found</td></tr>';
    }
}

async function saveDoctor(event) {
    event.preventDefault();
    const form = event.target;
    const id = form.doctor_id.value;
    const doctorData = {
        doctor_name: form.doctor_name.value,
        specialization: form.specialization.value,
        department: form.department.value,
        experience: parseInt(form.experience.value),
        consultation_fee: parseFloat(form.consultation_fee.value),
        phone: form.phone.value
    };

    if (id) await apiCall(`/doctors/update/${id}/`, 'PUT', doctorData);
    else await apiCall(`/doctors/add/`, 'POST', doctorData);
    
    closeModal('doctorModal');
    loadDoctors();
}

function editDoctor(id, name, spec, dept, exp, fee, phone) {
    const form = document.getElementById('doctorForm');
    form.doctor_id.value = id;
    form.doctor_name.value = name;
    form.specialization.value = spec;
    form.department.value = dept;
    form.experience.value = exp;
    form.consultation_fee.value = fee;
    form.phone.value = phone;
    openModal('doctorModal');
}

async function deleteDoctor(id) {
    if (confirm('Are you sure you want to delete this doctor?')) {
        await apiCall(`/doctors/delete/${id}/`, 'DELETE');
        loadDoctors();
    }
}
