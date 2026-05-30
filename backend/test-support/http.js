export async function withServer(server, handler) {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const address = server.address();
    return await handler(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

export async function requestJson(server, path, options = {}) {
  return withServer(server, async (baseUrl) => {
    const response = await fetch(`${baseUrl}${path}`, options);
    return {
      response,
      json: await response.json(),
    };
  });
}

export async function request(server, path, options = {}) {
  return withServer(server, async (baseUrl) => fetch(`${baseUrl}${path}`, options));
}

export async function withMockedFetch(matches, handler) {
  const originalFetch = global.fetch;

  global.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.url;

    for (const match of matches) {
      const response = await match(url, input, init);
      if (response !== undefined) {
        return response;
      }
    }

    return originalFetch(input, init);
  };

  try {
    return await handler();
  } finally {
    global.fetch = originalFetch;
  }
}
