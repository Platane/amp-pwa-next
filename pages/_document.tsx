import Document, { Html, Head, Main, NextScript } from "next/document";
import { renderToString } from "react-dom/server";
import { extractCritical } from "emotion-server";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    // const originalRenderPage = ctx.renderPage;
    //
    // let criticalStyle;
    //
    // ctx.renderPage = () =>
    //   originalRenderPage({
    //     enhanceApp: (App) => (props) => {
    //       const { html, ids, css } = extractCritical(ctx.renderPage(<App />));
    //
    //       criticalStyle = css;
    //
    //       return html;
    //     },
    //   });
    //
    // console.log(criticalStyle);

    return {
      ...initialProps
      // styles: <style dangerouslySetInnerHTML={{ __html: criticalStyle }} />,
    };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
