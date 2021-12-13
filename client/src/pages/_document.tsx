import { ServerStyleSheets } from '@material-ui/core/styles';
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { resetServerContext } from 'react-beautiful-dnd';

// Next document template

class MyDocument extends Document {

    // Initializing server-side props for document
    static async getInitialProps(ctx: DocumentContext) {
        // MUI JSS stylesheets for server-side rendering
        const sheets = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;

        // Insert stylesheets into application
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
            });

        // Resets server context prevent client-server mismatch for React Beautiful DnD
        resetServerContext();

        // Passes initial props back to document
        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            // Styles fragment is rendered after the app and page rendering finish.
            styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
        };
    }

    render() {
        return (
            // Renders HTML with header and body
            <Html>
                <Head>
                    {/* #TODO: Add meta data */}
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