const urlBase = "https://postgres-restapi.onrender.com/api/users";

// Función para crear un nuevo usuario
function postUser() {
  const user = {
    name: $('#name').val(),
    email: $('#email').val(),
    age: $('#age').val(),
    comments: $('#comments').val()
  };

  $.ajax({
    url: urlBase,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(user),
    success: function (data) {
      alert('Usuario creado correctamente.');
      $('input').val(''); // Limpiar formulario
      $('#updateArea').html(''); // Ocultar el botón de actualización
      getUsers(); // Refrescar la lista de usuarios
    },
    error: function (err) {
      alert('Error al crear el usuario.');
      console.error(err);
    }
  });
}

// Función para obtener y mostrar la lista de usuarios
function getUsers() {
  $.ajax({
    url: urlBase,
    type: 'GET',
    success: function (data) {
      const users = data.usuarios || data.users || data; // adapta esto según lo que venga

      let html = '<table>';
      html += `
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Edad</th>
          <th>Comentarios</th>
          <th>Acciones</th>
        </tr>`;

      // Bucle para mostrar usuarios
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        html += `
          <tr>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${user.age}</td>
            <td>${escapeHtml(user.comments || '')}</td>
            <td>
              <button class="edit-btn"
                data-id="${user.id}"
                data-name="${escapeHtml(user.name)}"
                data-email="${escapeHtml(user.email)}"
                data-age="${user.age}"
                data-comments="${escapeHtml(user.comments || '')}"
                onclick="handleEditButtonClick(this)">✏️</button>
              <button onclick="deleteUser(${user.id})" class="delete-btn">🗑️</button>
            </td>
          </tr>`;
      }

      html += '</table>';
      $('#resultado').html(html);
    },
    error: function (err) {
      $('#resultado').html('<p>Error al obtener los usuarios.</p>');
      console.error(err);
    }
  });
}

// Escapa caracteres especiales para evitar errores HTML/JS
function escapeHtml(text) {
  return $('<div>').text(text).html();
}

// Manejador del botón de editar (seguro contra comillas)
function handleEditButtonClick(btn) {
  const $btn = $(btn);
  const id = $btn.data('id');
  const name = $btn.data('name');
  const email = $btn.data('email');
  const age = $btn.data('age');
  const comments = $btn.data('comments');

  fillForm(id, name, email, age, comments);
}

// Función para llenar el formulario con los datos del usuario
function fillForm(id, name, email, age, comments) {
  $('#name').val(name);
  $('#email').val(email);
  $('#age').val(age);
  $('#comments').val(comments);

  // Mostrar el botón de actualización
  $('#updateArea').html('<button id="updateUserBtn" class="post-btn" onclick="updateUser(' + id + ')">Actualizar Usuario</button>');
}

// Función para actualizar un usuario
function updateUser(id) {
  const user = {
    name: $('#name').val(),
    email: $('#email').val(),
    age: $('#age').val(),
    comments: $('#comments').val()
  };

  $.ajax({
    url: `${urlBase}/${id}`,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(user),
    success: function () {
      alert('Usuario actualizado correctamente.');
      $('#updateArea').html(''); // Ocultar el botón de actualización
      $('input').val(''); // Limpiar formulario
      getUsers(); // Refrescar la lista de usuarios
    },
    error: function (err) {
      alert('Error al actualizar el usuario.');
      console.error(err);
    }
  });
}

// Función para eliminar un usuario sin confirmación
function deleteUser(id) {
  $.ajax({
    url: `${urlBase}/${id}`,
    type: 'DELETE',
    success: function () {
      alert('Usuario eliminado correctamente.');
      getUsers(); // Refrescar la lista de usuarios
    },
    error: function (err) {
      alert('Error al eliminar el usuario.');
      console.error(err);
    }
  });
}
