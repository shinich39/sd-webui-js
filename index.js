'use strict';

const ROUTES = {
  info: "/info",
  getOptions: "/sdapi/v1/options",
  setOptions: "/sdapi/v1/options",
  txt2img: "/sdapi/v1/txt2img",
  img2img: "/sdapi/v1/img2img",
  extra: "/sdapi/v1/extra-single-image",
}

function normalizePayload(payload) {
  if (typeof payload !== "object") {
    return;
  }
  // batch_count
  if (payload["batch_count"] && !payload["n_iter"]) {
    payload["n_iter"] = payload["batch_count"];
    delete payload["batch_count"];
  }
  return JSON.stringify(payload);
}

class WEBUI {
  constructor(host, port) {
    this.__host__ = host ? host.replace(/https\:\/\/|http\:\/\//, "") : "127.0.0.1";
    this.__port__ = port ? Number(port) : 7860;
  }

  get host() { return "http://" + this.__host__ + ":" + this.__port__};
}

WEBUI.prototype.__get__ = async function(url) {
  const response = await fetch(url, {
    method: "GET"
  });

  return response.json();
}

WEBUI.prototype.__post__ = async function(url, payload) {
  payload = normalizePayload(payload);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  });

  return response.json();
}

WEBUI.prototype.isConnected = async function() {
  try {
    const url = this.host + ROUTES["info"];
    await this.__get__(url);
    return true;
  } catch(err) {
    return false;
  }
}

WEBUI.prototype.info = async function() {
  const url = this.host + ROUTES["info"];
  const response = await this.__get__(url);
  return response;
}

WEBUI.prototype.getOptions = async function() {
  const url = this.host + ROUTES["getOptions"];
  const response = await this.__get__(url);
  return response;
}

WEBUI.prototype.setOptions = async function(payload) {
  const url = this.host + ROUTES["setOptions"];
  const response = await this.__post__(url, payload);
  return response;
}

WEBUI.prototype.txt2img = async function(payload) {
  const url = this.host + ROUTES["txt2img"];
  const response = await this.__post__(url, payload);
  return response;
}

WEBUI.prototype.img2img = async function(base64, payload) {
  payload["init_images"] = Array.isArray(base64) ? base64 : [base64];
  const url = this.host + ROUTES["img2img"];
  const response = await this.__post__(url, payload);
  return response;
}

WEBUI.prototype.extra = async function(base64, payload) {
  payload["image"] = base64;
  const url = this.host + ROUTES["extra"];
  const response = await this.__post__(url, payload);
  return response;
}

export default WEBUI