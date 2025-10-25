const baseURL = 'http://localhost:3000/api';

// Register
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };
    const res = await fetch(`${baseURL}/register`, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message);
    if (result.success) window.location = 'index.html';
  });
}

// Login
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };
    const res = await fetch(`${baseURL}/login`, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      localStorage.setItem('user', JSON.stringify(result.user));
      if (result.user.role === 'admin') window.location = 'admin.html';
      else window.location = 'user.html';
    } else {
      alert(result.message);
    }
  });
}

// User Dashboard
if (window.location.pathname.endsWith('user.html')) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) window.location = 'index.html';
  document.getElementById('welcome').innerText = `Welcome ${user.name}!`;
  document.getElementById('email').innerText = `Email: ${user.email}`;
}

// Admin Dashboard
if (window.location.pathname.endsWith('admin.html')) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'admin') window.location = 'index.html';

  fetch(`${baseURL}/users`)
    .then(res => res.json())
    .then(users => {
      const tbody = document.getElementById('userTable');
      users.forEach(u => {
        tbody.innerHTML += `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td></tr>`;
      });
    });
}

// Logout
function logout() {
  localStorage.removeItem('user');
  window.location = 'index.html';
}
