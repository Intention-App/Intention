import { ServerStyleSheets } from '@material-ui/core';
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
import React from 'react';
import { resetServerContext } from 'react-beautiful-dnd';

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {const sheets = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;
        
        ctx.renderPage = () =>
          originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
          });
      
        const initialProps = await Document.getInitialProps(ctx);
      
        resetServerContext();
        return {
          ...initialProps,
          // Styles fragment is rendered after the app and page rendering finish.
          styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
        };
    }

    render() {
        return (
            <Html>
                <Head>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    };
}

export default MyDocument;