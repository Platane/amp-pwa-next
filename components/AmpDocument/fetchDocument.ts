/**
 * fetch a html page as document
 *
 * xhr is recommended over fetch api since it provides a xml parser
 */
export const fetchDocument = (url: string) => {
  let xhr: XMLHttpRequest;

  const p: Promise<Document> & { abort: () => void } = new Promise(
    (resolve, reject) => {
      xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "document";
      xhr.setRequestHeader("Accept", "text/*");
      xhr.onreadystatechange = () => {
        if (xhr.readyState < /* STATUS_RECEIVED */ 2) {
          return;
        }
        if (xhr.status === 0) {
          xhr.onreadystatechange = null;
          reject(new Error(`Request aborted`));
          return;
        }
        if (xhr.status < 100 || xhr.status > 599) {
          xhr.onreadystatechange = null;
          reject(new Error(`Unknown HTTP status ${xhr.status}`));
          return;
        }
        if (xhr.readyState === /* COMPLETE */ 4) {
          if (xhr.responseXML) {
            resolve(xhr.responseXML);
          } else {
            reject(new Error("No xhr.responseXML"));
          }
        }
      };
      xhr.onerror = () => {
        reject(new Error("Network failure"));
      };
      xhr.onabort = () => {
        reject(new Error("Request aborted"));
      };
      xhr.send();
    }
  ) as any;

  p.abort = () => {
    xhr && xhr.abort();
  };

  return p;
};
