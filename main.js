
// AXIOS INSTANCES
axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

// GET REQUEST
function getTodos() {
  axiosInstance.get('/todos?_limit=10')
  .then(res => showOutput(res))
  .catch(err => console.log(err));
}

// POST REQUEST
function addTodo() {
  axiosInstance.post('/todos',{
      title: 'New Data Added',
      completed: false
    }
  ).then(res => showOutput(res))
  .catch(err => console.log(err));
}

// PUT/PATCH REQUEST
function updateTodo() {
  // axiosInstance.put('/todos/1',{
  //     title: 'New Data Added',
  //     completed: false
  //   }
  // ).then(res => showOutput(res))
  // .catch(err => console.log(err));

  axiosInstance.patch('/todos/2',{
    title: 'New Data Added',
    completed: false
  }
  ).then(res => showOutput(res))
  .catch(err => console.log(err));
}

// DELETE REQUEST
function removeTodo() {
  axiosInstance.delete('/todos/1').then(res => showOutput(res))
  .catch(err => console.log(err));
}

// SIMULTANEOUS DATA
function getData() {
  axios.all([axiosInstance.get('/todos'),axiosInstance.get('/posts?_limit=5')])
  .then(axios.spread((todo,post) => {
    console.log(todo.data);
    showOutput(post);
  })
  ).catch(err => console.log(err))

}

// CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'sometoken'
    }
  };

  axiosInstance
    .post(
      '/todos',
      {
        title: 'New Todo',
        completed: false
      },
      config
    )
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'Hello World'
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data;
    })
  };

  axios(options).then(res => showOutput(res));
}

// ERROR HANDLING
function errorHandling() {
  axiosInstance
    .get('/todoss', {
      // validateStatus: function(status) {
      //   return status < 500; // Reject only if status is greater or equal to 500
      // }
    })
    .then(res => showOutput(res))
    .catch(err => {
      if (err.response) {
        // Server responded with a status other than 200 range
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);

        if (err.response.status === 404) {
          alert('Error: Page Not Found');
        }
      } else if (err.request) {
        // Request was made but no response
        console.error(err.request);
      } else {
        console.error(err.message);
      }
    });
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();

  axiosInstance
    .get('/todos', {
      cancelToken: source.token
    })
    .then(res => showOutput(res))
    .catch(thrown => {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      }
    });

  if (true) {
    source.cancel('Request canceled!');
  }
}

// INTERCEPTING REQUESTS & RESPONSES

axios.interceptors.request.use(
  config => {
    console.log(
      `${config.method.toUpperCase()} request sent to ${
        config.url
      } at ${new Date().getTime()}`
    );

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
