<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link href="/static/normalize.css" rel="stylesheet" />
    <link href="/static/logo.jpeg" rel="icon" type="image/x-icon" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/axios@1.14.0/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js"></script>
    <title>{{ name }}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .page-card {
        background: white;
        padding: 60px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        text-align: center;
      }
      h1 {
        color: #667eea;
        font-size: 48px;
        margin: 0 0 20px 0;
      }
      p {
        color: #666;
        font-size: 18px;
      }
    </style>
  </head>
  <body>
    <div class="page-card">
      <h1>Page 1</h1>
      <input type="text" id="env" value="{{ env }}" />
      <input type="text" id="options" value="{{ options }}" />

      <button onclick="handleClick()">发送请求</button>
    </div>
  </body>
  <script type="text/javascript">
    try {
      window.env = document.getElementById('env').value
      const options = document.getElementById('options').value
      if (options) {
        window.options = JSON.parse(options)
      }
    } catch (e) {
      console.log(e)
    }

    const handleClick = () => {
      // axios.get('/api/project/list').then(res => console.log(res))
      // axios
      //   .get('/api/project/list', { a: 1, b: 2, c: 3 })
      //   .then((res) => console.log(res))
      //   .catch((err) => console.error(err))
      const signKey = 'wrewerKe234K232Jfsdusd23K9sdJ2'
      const st = Date.now()
      axios.request({
        method: 'get',
        url: '/api/project/list',
        params: { proj_key: 'test' },
        headers: {
          s_t: st,
          s_sign: md5(`${signKey}_${st}`),
        },
      })
    }
  </script>
</html>
