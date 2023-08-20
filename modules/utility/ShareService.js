import clipboardCopier from "./clipboard.js";
import share from "./share.js";

class BaseShareService {
  #url;
  constructor(url) {
    this.#url = url;
  }
  share(title, text, onSuccess = (message) => {}, onFailure = (error) => {}) {
    throw Error("Not implemented");
  }
  get description() {
    throw Error("Not implemented");
  }
  get url() {
    return this.#url;
  }
}

class CopyService extends BaseShareService {
  share(title, text, onSuccess = (message) => {}, onFailure = (error) => {}) {
    clipboardCopier(`${text}\n${this.url}`, onSuccess, onFailure);
  }
  get description() {
    return "Copy to Clipboard";
  }
}

class SocialShareService {
  share(title, text, onSuccess = (message) => {}, onFailure = (error) => {}) {
    share(title, text, this.url, onSuccess, onFailure);
  }
  get description() {
    return "Share Results";
  }
}

export default class ShareServiceFactory {
  #socialShareService;
  #copyService;
  constructor(url) {
    this.#socialShareService = new SocialShareService(url);
    this.#copyService = new CopyService(url);
  }
  getShareService() {
    if (!navigator.share) {
      return this.#copyService;
    } else {
      return this.#socialShareService;
    }
  }
}
